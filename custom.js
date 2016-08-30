var fs = require("fs");
var through = require('through')
  , jstransform = require('jstransform')
  , parser = require('./parser');

var processEnvPattern = /[\"\']<%\=\s*ENV\[[\"\']/;

module.exports = function() {
  var env;
  var buffer = [];

  return function erbify(file, argv) {
    if (/\.json$/.test(file)) return through();
    var envPath;
    if (argv.root) {
      envPath = argv.root + "/.env";
    } else {
      try {
        envPath = fs.accessSync("./../../../.env");
      } catch (e) {
        envPath = "./.env";
      }
    }
    var envBuf = fs.readFileSync(envPath);  
    env = envToArr(envBuf);
    return through(write, flush);
  };

  function envToArr (envBuf) {
    var envObjs = [];
    var envStr = envBuf.toString();
    var envArr = envStr.split("\n");
    envArr.forEach(function (pair) {
      var envObj = {};
      var pairs = pair.split("=");
      var key = pairs[0];
      var value = pairs[1] && pairs[1].replace(/["']/g, "");
      envObj[key] = value;
      if (!!key && key.charAt(0) !== "#") envObjs.push(envObj);
    });
    return envObjs;
  }

  function write(data) {
    buffer.push(data);
  }

  function flush() {
    var source = buffer.join('');

    if (processEnvPattern.test(source)) {
      try {
        source = parser.unerb(source, env);
      } catch(err) {
        console.log("err", err);
        return this.emit('error', err);
      }
    }

    this.queue(source);
    this.queue(null);
  }
};

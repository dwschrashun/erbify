var fs = require("fs");
var through = require('through'),
  parser = require('./parser');

var processEnvPattern = /[\"\']<%\=\s*ENV\[[\"\']/;

module.exports = function() {
  var env;
  var buffer = [];

  function parseEnvs (options) {
    if (options.stage) {
      var filename = ".env." + options.stage;
      return envToArr(Buffer.concat([fs.readFileSync(parseFilename(options.envDir, ".env")), fs.readFileSync(parseFilename(options.envDir, filename))]));
    } else {
      return envToArr(fs.readFileSync(parseFilename(options.envDir, ".env")));
    }
  }

  function parseFilename (envDir, filename) {
    var envPath;
    if (envDir) {
      envPath = envDir + filename;
    } else {
      try {
        envPath = fs.accessSync("./../../../" + filename);
      } catch (e) {
        envPath = "./" + filename;
      }
    }
    return envPath;
  }

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

  return function erbify(file, argv) {
    if (/\.erb$/.test(file)) {
      env = parseEnvs(argv);
      return through(write, flush);
    } else return through();
  };


};

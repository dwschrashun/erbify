var fs = require("fs");

var through = require('through')
  , jstransform = require('jstransform')
  , parser = require('./parser')

var processEnvPattern = /[\"\']<%\=\s*ENV\[[\"\']/

module.exports = function() {
  var env;
  var buffer = []

  return function envify(file, argv) {
    if (/\.json$/.test(file)) return through()
    var envBuf = fs.readFileSync('./.env');  
    env = envToArr(envBuf);
    return through(write, flush)
  };

  function envToArr (envBuf) {
    var envObjs = [];
    var envStr = envBuf.toString();
    var envArr = envStr.split("\n");
    envArr.forEach(function (pair) {
      var envObj = {};
      var pairs = pair.split("=");
      var key = pairs[0];
      var value = pairs[1];
      envObj[key] = value;
      if (!!key) envObjs.push(envObj);
    });
    return envObjs;
  }

  function write(data) {
    buffer.push(data)
  }

  function flush() {
    var source = buffer.join('')

    if (processEnvPattern.test(source)) {
      try {
        // var visitors = createVisitors(env)
        // console.log("visitors", visitors);
        // source = jstransform.transform(visitors, source).code
        source = parser.unerb(source, env);
        console.log("source:::", source);
      } catch(err) {
        console.log("err", err);
        return this.emit('error', err)
      }
    }

    this.queue(source)
    this.queue(null)
  }
}



    // return new Promise(function (resolve) {
    //   fs.readFile('./.env', function (err, data) {
    //     if (err) {
    //       console.log("error", err)
    //       return reject(new Error(err));
    //     }
    //     env = data;
    //     console.log("data?", data);

    //     var buffer = []
    //     argv = argv || {}

    //     // return through(write, flush)
    //     return resolve(through());
        
    //   });
    // });

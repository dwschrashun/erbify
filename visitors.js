var Syntax = require('jstransform').Syntax
var utils = require('jstransform/src/utils')

function create(env) {
  var args  = [].concat(env[0]._ || []).concat(env[1]._ || [])
  var purge = args.indexOf('purge') !== -1

  function visitEnvNode(traverse, node, path, state) {
    // var key = node.property.name || node.property.value
    console.log("node", node, node.property);
    // console.log("traverse!!!", traverse, "node!!!", node, "path!!!", path, "state!!!", state);

    // for (var i = 0; i < env.length; i++) {
    //   var value = env[i][key]
    //   if (value !== undefined) {
    //     replaceEnv(node, state, value)
    //     return false
    //   }
    // }

    // if (purge) {
    //   replaceEnv(node, state, undefined)
    // }

    return false
  }

  function replaceEnv(node, state, value) {
    utils.catchup(node.range[0], state)
    utils.append(JSON.stringify(value), state)
    utils.move(node.range[1], state)
  }

  visitEnvNode.test = function(node, path, state) {
    return true
  }

  return [visitEnvNode]
}

module.exports = create



var concatRegExp = require("concat-regexp");

var openErb = /<%\=\s*ENV\[[\"\']/;
var closeErb = /[\"\']\]\s*%>/g;

// var openErb = "[\\\"\']<%\\\=\\\s*ENV\\\[[\\\"\']";
// var closeErb = "[\\\"\']\\\]\\\s*%>";

function makeRegexes (env) {
  var matchers = [];
  env.forEach(function (envObj) {
    var matcherObj = {};
    var key = Object.getOwnPropertyNames(envObj)[0];
    var value = envObj[key];
    matcherObj.pattern = concatRegExp(openErb, key, closeErb);
    matcherObj.value = value.replace(/[\'\"]/g, "");
    matchers.push(matcherObj);
  });
  // console.log("matchers", matchers);
  return matchers;
}

var parser = {

  unerb: function (code, env) {
    var matchers = makeRegexes(env);
    var replaced = code;
    matchers.forEach(function (matcher) {
      replaced = replaced.replace(matcher.pattern, matcher.value);
    });
    return replaced;
  }
};

module.exports = parser;
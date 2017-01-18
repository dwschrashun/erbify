var expect = require('chai').expect;
var fs = require('fs');
var mock = require('mock-fs');
var erbify = require("./custom.js")();
var browserify = require("browserify");

describe("erbify", function () {
  var testErbJSContent = "var a = '<%= ENV[\"TEST_VALUE\"] %>';var b = '<%= ENV[\"BEST_VALUE\"] %>';";
  mock({
    "./test.js.erb": testErbJSContent
  });
  
  describe("with env contents from rails", function () {
    it("correctly replaces with a stringfied rails ENV object", function (done) {

      var b = browserify();
      b.add("./test.js.erb").transform(erbify, {env: "'TEST_VALUE'=>'barf', 'BEST_VALUE'=>'farb'"}).bundle(function(err, buf) {
        expect(err).to.be.null;
        expect(buf.toString().indexOf("barf")).to.be.above(-1);
        expect(buf.toString().indexOf("farb")).to.be.above(-1);
        expect(buf.toString().indexOf("ENV")).to.equal(-1);
        done();
      });
    });
  });

  describe("with .env file, without options", function () {
    var testNonErbContent = "var a = 'char';var b = 'spar';";
    var testErbHTMLContent = "<div><%= ENV['TEST_VALUE'] %></div>";

    mock({
      "./.env": "TEST_VALUE='barf'\nBEST_VALUE='farb'",
      "./test.js": testNonErbContent,
      "./test.js.erb": testErbJSContent,
      "./test.html.erb": testErbHTMLContent
    });

    it("replaces js correctly with .env file at default location", function (done) {

      var b = browserify();
      b.add("./test.js.erb").transform(erbify).bundle(function(err, buf) {
        expect(buf.toString().indexOf("barf")).to.be.above(-1);
        expect(buf.toString().indexOf("farb")).to.be.above(-1);
        expect(buf.toString().indexOf("ENV")).to.equal(-1);
        done();
      });

    });

    it("replaces html correctly with .env file at default location", function () {
      var b = browserify();
      b.add("./test.html.erb").transform(erbify).bundle(function(err, buf) {
        expect(buf.toString().indexOf("barf")).to.be.above(-1);
        expect(buf.toString().indexOf("ENV")).to.equal(-1);
        done();
      });
    });

    it("should not process non-erb files", function () {
      var b = browserify();
      b.add("./test.js").transform(erbify).bundle(function(err, buf) {
        expect(buf.toString()).to.equal("var a = 'char';var b = 'spar';");
        done();
      });
    });
  });

  describe("with .env file, with options", function () {
    it("replaces correctly with .env file at specified location", function () {
      mock({
        "./fake-dir/.env": "TEST_VALUE='carb'\nBEST_VALUE='barc'",
        "./test.js.erb": testErbJSContent,
      });
      var replacedJS = "var a = 'carb';var b = 'barc';";
      
      var b = browserify();
      b.add("./test.js.erb").transform(erbify, {envDir: './fake-dir'}).bundle(function(err, buf) {
        expect(buf.toString().indexOf("carb")).to.be.above(-1);
        expect(buf.toString().indexOf("barc")).to.be.above(-1);
        expect(buf.toString().indexOf("ENV")).to.equal(-1);
        done();
      });
    });


  });

  describe("without .env file", function () {
    it("should not change input if no .env present", function () {
      mock({
        "./test.js.erb": testErbJSContent,
      });
      var b = browserify();
      b.add("./test.js.erb").transform(erbify).bundle(function(err, buf) {
        expect(buf.toString().indexOf("barf")).to.equal(-1);
        expect(buf.toString().indexOf("farb")).to.equal(-1);
        expect(buf.toString().indexOf("ENV")).to.be.above(-1);
        done();
      });
    });
  });
});


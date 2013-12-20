var should      = require("should")
var superagent  = require('superagent')
var path        = require("path")
var fs          = require("fs")
var exec        = require("child_process").exec
var harp        = require("../")

describe("errors", function(){

  describe("err-invalid-config", function(){
    var projectPath = path.join(__dirname, "apps/err-invalid-config")
    var outputPath  = path.join(__dirname, "out/err-invalid-config")
    var port        = 8111

    before(function(done){
      harp.server(projectPath, { port: port }, function(){
        done()
      })
    })

    it("should get error message for invalid harp.json", function(done){
      var agent = superagent.agent()
      agent.get('http://localhost:'+ port +'/').end(function(err, rsp){
        rsp.should.have.status(500)
        harp.compile(projectPath, outputPath, function(error){
          should.exist(error)
          error.should.have.property("source")
          error.should.have.property("dest")
          error.should.have.property("filename")
          error.should.have.property("message")
          error.should.have.property("stack")
          error.should.have.property("lineno")
          done()
        })
      })
    })
  })

  describe("err-invalid-data", function(){
    var projectPath = path.join(__dirname, "apps/err-invalid-data")
    var outputPath  = path.join(__dirname, "out/err-invalid-data")
    var port        = 8112

    before(function(done){
      harp.server(projectPath, { port: port }, function(){
        done()
      })
    })

    it("should get error message for invalid _data.json", function(done){
      var agent = superagent.agent()
      agent.get('http://localhost:'+ port +'/').end(function(err, rsp){
        rsp.should.have.status(500)
        harp.compile(projectPath, outputPath, function(error){
          should.exist(error)
          error.should.have.property("source")
          error.should.have.property("dest")
          error.should.have.property("filename")
          error.should.have.property("message")
          error.should.have.property("stack")
          error.should.have.property("lineno")
          done()
        })
      })
    })
  })

  describe("err-missing-public", function(){
    var projectPath = path.join(__dirname, "apps/err-missing-public")
    var outputPath  = path.join(__dirname, "out/err-missing-public")
    var port        = 8113

    before(function(done){
      harp.server(projectPath, { port: port }, function(){
        done()
      })
    })

    it("should get error message for invalid _data.json", function(done){
      var agent = superagent.agent()
      agent.get('http://localhost:'+ port +'/').end(function(err, rsp){
        rsp.should.have.status(500)
        harp.compile(projectPath, outputPath, function(error){
          should.exist(error)
          error.should.have.property("source")
          error.should.have.property("dest")
          error.should.have.property("filename")
          error.should.have.property("message")
          error.should.have.property("stack")
          error.should.have.property("lineno")
          done()
        })
      })
    })
  })

  describe("err-missing-public", function(){
    var projectPath = path.join(__dirname, "apps/err-missing-404")
    var outputPath  = path.join(__dirname, "out/err-missing-404")
    var port        = 8114

    before(function(done){
      harp.server(projectPath, { port: port }, function(){
        done()
      })
    })

    it("should return proper mime type on 404 page", function(done){
      var agent = superagent.agent()
      agent.get('http://localhost:'+ port +'/some/missing/path.css').end(function(err, rsp){
        rsp.should.have.status(404)
        rsp.headers.should.have.property("content-type", "text/html; charset=UTF-8")
        done()
      })
    })
  })

  describe("err-port-taken", function () {
    var projectPath = path.join(__dirname, "apps/plain/root-style")
    var outputPath  = path.join(__dirname, "out/plain/root-style")
    var default_port = 9966
    var expected_port = default_port + 1

    before(function(done){
      harp.server(projectPath, {}, function(){
        done()
      })
    })

    it("should not find next available port when port is explicit", function(done){
      // 
      // TODO: start server on port 9966 and it should
      // error out saying that the port is not available
      // 
      // harp.server(projectPath, { port: default_port }, function(error, port){
      //   should.exist(error)
      //   done()
      // })
      done();
    });

    // do not find next if port is explicit
    it("should find next available port", function(done){
      done()
    });

    it("should find next available port", function(done){
      harp.server(projectPath, {}, function(error, port){
        should.not.exist(error)
        should.exist(port)
        port.should.eql(expected_port)
        done()
      })
    })

    it("should start server in port " + expected_port, function(done){
      var agent = superagent.agent()
      agent.get('http://localhost:' + expected_port + '/').end(function(err, rsp){
        should.not.exist(err);
        rsp.should.have.status(200);
        done()
      })
    })
  });

  after(function(done){
    exec("rm -rf " + path.join(__dirname, "out"), function(){
      done()
    })
  })

})

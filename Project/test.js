var Server = require('./app.js');
var request = require("superagent").agent();
var chai = require("chai");
var expect = chai.expect;
var mongo = require('mongodb').MongoClient;





var url = 'mongodb://localhost:27017/test';
describe("Clear collection", function(done){
	mongo.connect(url, function(err, db) {
		db.collection("users").remove();
	});
});

describe("Testing /register", function(){
	it("can register with two fields", function(done){
		request.post("http://localhost:8090/register")
		.send({
			u_id : "kalle",
			passwd : "1234",
			personalInfo : {
				"realName" : "",
				"bday" : "",
				"gender" : "",
				"occupation" : ""
			},
			friends : [],
			messages : [],
		})
		.end(function(err, results){
			expect(results.status).to.equal(200);
			done();
		});
	});

	it("can't register with occupied username", function(done){
		request.post("http://localhost:8090/register")
		.send({
			u_id : "kalle",
			passwd : "bajs",
			personalInfo : {
				"realName" : "",
				"bday" : "",
				"gender" : "",
				"occupation" : ""
			},
			friends : [],
			messages : [],
		})
		.end(function(err, results){
			expect(results.status).to.equal(409);
			done();
		});
	});

	it("can register with all fields", function(done){
		request.post("http://localhost:8090/register")
		.send({
			u_id : "musse",
			passwd : "1234",
			personalInfo : {
				"realName" : "Mustafa",
				"bday" : "now",
				"gender" : "Mouse",
				"occupation" : "no"
			},
			friends : [],
			messages : [],
		})
		.end(function(err, results){
			expect(results.status).to.equal(200);
			done();
		});
	});

	it("user1 is in DB", function(done){
		mongo.connect(url, function(err, db){
			db.collection("users").find({}).toArray(function(err, results){
				expect(results[0].u_id).to.equal("kalle");
				done();
			});
		});
	});

	it("user2 is in DB", function(done){
		mongo.connect(url, function(err, db){
			db.collection("users").find({}).toArray(function(err, results){
				expect(results[1].u_id).to.equal("musse");
				done();
			});
		});
	});
});

describe("Testing /login", function(){
	it("test to log in as kalle", function(done) {
		var uid;
		request.post("http://localhost:8090/login")
		.send({
			uname: "kalle",
			passwd: "1234"
		})
		.end(function(err, results){
			expect(results.status).to.equal(200);
			done();
		});
	});

	it("test to log in as kalle (wrong pass)", function(done) {
		var uid;
		request.post("http://localhost:8090/login")
		.send({
			uname: "kalle",
			passwd: "12346"
		})
		.end(function(err, results){
			expect(results.status).to.equal(404);
			done();
		});
	});

	it("gets back me if calling /me", function(done) {
		request.get("http://localhost:8090/me").end(function(err, results) {
			var resultsJSON = JSON.parse(results.text);
			expect(resultsJSON.u_id).to.equal("kalle");
			done();
		});
	});
});

describe("Testing adding friend", function() {
	it("Check the number of friends 'kalle' has is zero", function(done) {
		mongo.connect(url, function(err, db){
			db.collection("users").find({}).toArray(function(err, results){
				expect(results[0].friends.length).to.equal(0);
				done();
			});
		});
	});

	it("adding 'musse' as a friend", function(done) {
		request.post("http://localhost:8090/addfriend")
		.send({friend:"musse"})
		.end(function(err, result) {
			expect(JSON.parse(result.text).length).to.equal(2);
			done();
		});
	});

	it("adding 'qwerty' as a friend (not existing)", function(done) {
		request.post("http://localhost:8090/addfriend")
		.send({friend:"qwerty"})
		.end(function(err, result) {
			expect(result.status).to.equal(404);
			done();
		});
	});

	it("Check the number of friends 'kalle' has is one", function(done) {
		mongo.connect(url, function(err, db){
			db.collection("users").find({}).toArray(function(err, results){
				expect(results[0].friends.length).to.equal(1);
				done();
			});
		});
	});
});

describe("testing accepting friendrequests", function() {
	it("number of friends 'musse' has is zero", function(done) {
		mongo.connect(url, function(err, db){
			db.collection("users").find({}).toArray(function(err, results){
				expect(results[1].friends.length).to.equal(0);
				done();
			});
		});
	});

	it("logging out", function(done) {
		request.get("http://localhost:8090/logout")
		.end(function(err, result) {
			expect(result.status).to.equal(200);
			done();
		});
	});

	it("log in as 'musse'", function(done) {
		request.post("http://localhost:8090/login")
		.send({
			uname: "musse",
			passwd: "1234"
		})
		.end(function(err, results){
			expect(results.status).to.equal(200);
			done();
		});
	});

	it("accepting a friendrequests", function(done) {
		request.post("http://localhost:8090/acceptrequest")
		.send({acceptee:"kalle"})
		.end(function (err, result) {
			expect(result.status).to.equal(200);
			done();
		});
	});

	it("accepting a friendrequests", function(done) {
		request.post("http://localhost:8090/acceptrequest")
		.send({acceptee:"kallle"})
		.end(function (err, result) {
			expect(result.status).to.equal(404);
			done();
		});
	});

	it("number of friends 'musse' has is one", function(done) {
		mongo.connect(url, function(err, db){
			db.collection("users").find({}).toArray(function(err, results){
				expect(results[1].friends.length).to.equal(1);
				done();
			});
		});
	});
});

describe("send messages", function() {
	it("number of messages 'kalle' has is zero", function(done) {
		mongo.connect(url, function(err, db){
			db.collection("users").find({}).toArray(function(err, results){
				expect(results[0].messages.length).to.equal(0);
				done();
			});
		});
	});


	it("send message to non exiting", function(done) {
		request.post("http://localhost:8090/sendmessage")
		.send({
			to : "kallle",
			message : {
				from : "musse",
				message : "heeeej"
			}
		})
		.end(function(err, result) {
			expect(result.text).to.equal('false');
			done();
		});
	});

	it("send message to kalle", function(done) {
		request.post("http://localhost:8090/sendmessage")
		.send({
			to : "kalle",
			message : {
				from : "musse",
				message : "heeeej"
			}
		})
		.end(function(err, result) {
			expect(result.text).to.not.equal('false');
			done();
		});
	});

	it("number of messages 'kalle' has is one", function(done) {
		mongo.connect(url, function(err, db){
			db.collection("users").find({}).toArray(function(err, results){
				expect(results[0].messages.length).to.equal(1);
				done();
			});
		});
	});
});

describe("test various gets", function() {
	it("test /me", function(done) {
		request.get("http://localhost:8090/me")
		.end(function (err, result) {
			expect(result.status).to.equal(200);
			done();
		});
	});

	it("test /getall", function(done) {
		request.get("http://localhost:8090/getall")
		.end(function (err, result) {
			expect(result.status).to.equal(200);
			done();
		});
	});

	it("test /friends", function(done) {
		request.get("http://localhost:8090/friends")
		.end(function (err, result) {
			expect(result.status).to.equal(200);
			done();
		});
	});

	it("test /messages", function(done) {
		request.get("http://localhost:8090/messages")
		.end(function (err, result) {
			expect(result.status).to.equal(200);
			done();
		});
	});

	it("test /search (existing user)", function(done) {
		request.get("http://localhost:8090/search?name=kalle")
		.end(function (err, result) {
			expect(result.status).to.equal(200);
			done();
		});
	});

	it("test /search (nonexisting user)", function(done) {
		request.get("http://localhost:8090/search?name=gustav")
		.end(function (err, result) {
			expect(result.status).to.equal(404);
			done();
		});
	});

	it("test /", function(done) {
		request.get("http://localhost:8090/")
		.end(function (err, result) {
			expect(result.status).to.equal(200);
			done();
		});
	});
});

describe("test various gets while logged out", function() {
	it("logging out", function(done) {
		request.get("http://localhost:8090/logout")
		.end(function(err, result) {
			expect(result.status).to.equal(200);
			done();
		});
	});

	it("test /me", function(done) {
		request.get("http://localhost:8090/me")
		.end(function (err, result) {
			expect(result.status).to.equal(404);
			done();
		});
	});

	it("test /getall", function(done) {
		request.get("http://localhost:8090/getall")
		.end(function (err, result) {
			expect(result.status).to.equal(200);
			done();
		});
	});

	it("test /friends", function(done) {
		request.get("http://localhost:8090/friends")
		.end(function (err, result) {
			expect(result.text).to.equal('false');
			done();
		});
	});

	it("test /messages", function(done) {
		request.get("http://localhost:8090/messages")
		.end(function (err, result) {
			expect(result.status).to.equal(404);
			done();
		});
	});

	it("test /search (existing user)", function(done) {
		request.get("http://localhost:8090/search?name=kalle")
		.end(function (err, result) {
			expect(result.status).to.equal(200);
			done();
		});
	});

	it("test /search (nonexisting user)", function(done) {
		request.get("http://localhost:8090/search?name=gustav")
		.end(function (err, result) {
			expect(result.status).to.equal(404);
			done();
		});
	});

	it("test /", function(done) {
		request.get("http://localhost:8090/")
		.end(function (err, result) {
			expect(result.status).to.equal(200);
			done();
		});
	});
});

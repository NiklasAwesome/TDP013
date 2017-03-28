var cookieParser = require('cookie-parser');
var express      = require('express');
var assert       = require('assert');
var bodyParser   = require('body-parser');
var db           = require('./dbCalls.js');
var app          = express();

var path = '/publicng/'

app.use(cookieParser());
app.use(express.static(__dirname + path));
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(bodyParser.json());

var url = 'mongodb://localhost:27017/test';

app.post('/login', function (req, res) {

	db.login(url, req.body.uname, req.body.passwd, function(result) {
		if (result) {
			res.cookie('uid', result);
			res.send(result);
		}
		else {
			res.sendStatus(404);
		}

	})
});

app.get('/logout', function (req, res) {
	res.clearCookie('uid');
	res.redirect('/');
});

app.get('/', function(req, res) {
	var userID = req.cookies.uid;
	if (userID != null) {
		res.sendFile(__dirname + path + 'start.html');
	}
	else {
		res.sendFile(__dirname + path + 'login.html');
	}
});

app.get('/me', function(req, res) {
	var userID = req.cookies.uid;
	if (userID != null) {
		db.getUser(url, userID, function(user) {
			res.send(user);
		});
	}
	else {
		res.sendStatus(404);
	}
});

app.post('/addfriend', function(req, res) {
	var userID = req.cookies.uid;

	db.addFriend(url, userID, req.body.friend, function(result, resulta){
		if(result) {
			res.send([result, resulta]);
		}
		else {
			res.sendStatus(404);
		}
	});
});

app.get('/friends', function(req, res) {
	var userID = req.cookies.uid;

	db.getFriends(url, userID, function(result){
		if(result !== undefined) {
			res.send(result);
		}
		else {
			res.send(false);
		}
	});
});

app.get('/search', function(req, res) {
	var name = req.query.name;
	db.search(url, name, function(users) {
		if (users) {
			res.send(users);
		}
		else {
			res.sendStatus(404);
		}
	});
});

app.get('/getall', function(req, res) {
	db.getAll(url, function(users) {
		res.send(users);
	});
});

app.get('/messages', function(req, res) {
	db.getMessages(url, req.cookies.uid, function(d) {
		if (d) {
			res.send(d);
		}
		else {
			res.sendStatus(404);
		}
	});
});

app.post('/sendmessage', function(req, res) {
	db.sendMessage(url, req.body.to, req.cookies.uid, req.body.message, function(result) {
		res.send(result);
	})
});

app.post('/acceptrequest', function(req, res) {
	db.acceptFriendRequest(url, req.cookies.uid, req.body.acceptee, function(result) {
		if (result) {
			res.send(result);
		}
		else {
			res.sendStatus(404);
		}
	});
});

app.post('/register', function(req, res) {
	db.registerUser(url, req.body, function(worked) {
		console.log(worked);
		if (worked) {
			res.status(200).send(worked);
		}
		else {
			res.status(200).send(worked);
		}
	})
});







function start() {
	var host = server.address().address;
	var port = server.address().port;

	console.log("Your awesome node.js/express app listening at http://%s:%s", host, port);
}

var server = app.listen(8090, start);

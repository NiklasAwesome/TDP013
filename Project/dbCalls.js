var mongo    = require('mongodb').MongoClient;
var ObjectId = require('mongodb').ObjectID;


module.exports = {
	addFriend: function (url, userID, newFriend, callback) {
		mongo.connect(url, function(err, db){
			module.exports.search(url, newFriend, function(exist) {
				if (exist != false) {
					db.collection('users').update({'_id': ObjectId(userID)}, {$addToSet : {'friends' : newFriend}}, function(err, resulta) {
						whoAmI(url, userID, function(name) {
							db.collection('users').update({'u_id': newFriend}, {$addToSet : {'friendrequests' : name}}, function(err, result) {
								if (err) {
									callback(err)
								}
								else {
									var success = true;
									callback(result, resulta);
								}
							});
						});
					});
				}
				else {
					callback(false, false);
				}
			});
		});
	},
	getMessages: function (url, userID, callback) {
		if (userID) {
			mongo.connect(url, function(err, db){
				db.collection('users').findOne({ "_id" : ObjectId(userID)}, function(err, user) {
					callback(user.messages);
				});
			});
		}
		else {
			callback(false);
		}
	},
	getFriends: function (url, userID, callback) {
		var result;
		mongo.connect(url, function(err, db){
			db.collection('users').find().toArray(function(err, users) {
				var found = false;
				users.forEach(function(doc) {
					if(doc['_id'] == userID){
						found = true;
						result = doc['friends'];
						db.close();
					}
				});
				callback(result);
			});
		});
	},
	registerUser: function (url, person, callback) {
		var noConflict = true;
		mongo.connect(url, function(err, db){
			db.collection('users').find().toArray(function(err, users) {
				users.forEach(function(doc) {
					if(doc['u_id'] === person.u_id){
						noConflict = false;
						db.close();
					}
				});
				if (noConflict) {
					db.collection('users').insert(person);
				}
				callback(noConflict);
			});
		});
	},
	search: function (url, name, callback) {
		mongo.connect(url, function(err, db){
			db.collection('users').findOne({"u_id" : name}, function(err, data) {
				if (data != null) {
					data.passwd = false;
					callback(data);
				}
				else {
					callback(false);
				}
			});
		});
	},
	getAll: function (url, callback) {
		var list = [];
		mongo.connect(url, function(err, db){
			db.collection('users').find().toArray(function(err, data) {
				data.forEach(function(doc) {
					list.push({u_id : doc.u_id, name : doc.personalInfo.realName});
				});
				callback(list);
			});
		});
	},
	getUser: function (url, userID, callback) {
    	whoAmI(url, userID, function(name) {
			module.exports.search(url, name, function(user) {
				callback(user);
			});
    	});
	},
	acceptFriendRequest: function (url, userID, acceptee, callback) {
    	mongo.connect(url, function(err, db) {
    		db.collection('users').findOne({'_id' : ObjectId(userID)}, function(err, data) {
				//console.log(data);
				if (data.friendrequests.indexOf(acceptee) !== -1) {
					db.collection('users').update({'_id' : ObjectId(userID)}, {$pull : {'friendrequests' : acceptee}}, function(err, result) {
						db.collection('users').update({'_id' : ObjectId(userID)}, {$addToSet: {'friends': acceptee}}, function(err, resulta) {
							callback([result, resulta]);

						});
					});
				}
				else {
					callback(false);
				}
    		});
    	});
	},
	sendMessage: function (url, reciver, sender, message, callback) {
		whoAmI(url, sender, function(name) {
			module.exports.isFriends(url, reciver, name, function(isOK) {
				if (isOK) {
					message._id = ObjectId();
					mongo.connect(url, function(err, db) {
						db.collection('users').update({'u_id': reciver}, {$addToSet : {'messages' : message}}, function(err, result) {
							callback(result);
						});
					});
				}
				else {
					callback(false);
				}
			});
		});
	},
	login: function (url, userID, password, callback) {
		mongo.connect(url, function(err, db){
			db.collection('users').find().toArray(function(err, users) {
				var result = false;
				users.forEach(function(doc) {
					if(doc['u_id'] === userID && doc['passwd'] === password){
						result = doc['_id'];
						db.close();
					}
				});
				callback(result);
			});
		});
	},
	isFriends: function (url, user1, user2, callback) {
		isMyFriend(url, user1, user2, function(a) {
			isMyFriend(url, user2, user1, function(b) {
				callback(a && b);
			});
		});
	}
};


function whoAmI(url, id, callback) {
	mongo.connect(url, function(err, db){
		db.collection('users').findOne({'_id' : ObjectId(id)}, function(err, result) {
			var name = result['u_id']
			callback(name);
		});
	});
}

function isMyFriend(url, main, friend, callback) {
	mongo.connect(url, function(err, db) {
		db.collection('users').findOne({"u_id" : main}, function(err, result) {
			if (result && result.friends) {
				if (result.friends.indexOf(friend) !== -1) {
					callback(true);
				}
				else {
					callback(false);
				}
			}
			else {
				callback(false);
			}
		});
	});
}

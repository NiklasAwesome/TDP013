function showFriends() {
	//$.cookie('uid', 'kalle');
	$.get('/friends', function(data){
		//console.log(data);
		$('#sak').append('<p>' + $.cookie('uid') + '</p>');
		data.forEach(function(friend) {
			$('#sak').append('<p>' + friend + '</p>');
		})
		//$.removeCookie('uid');
	});
}

function addFriend() {
	var name = $('#friendname').val();
	if (name !== '') {
		$.post('/addfriend', { friend : name }, function(data) {
			console.log(data);
		});
	}
}

function addPizza() {
	$.get('/addfriend', function(data){
		//console.log(data);
		$('#sak').append('<p>' + $.cookie('uid') + '</p>');
		$('#sak').append('<p>' + data + '</p>');
	});
}

function loginUnsafe() {
	var username = $('#u').val();
	var password = $('#p').val();
	console.log(username);
	console.log(password);
	var loginInfo = { uname: username, passwd: password };
	$.ajax({
	    url: '/login',
	    type: 'POST',
	    contentType: 'application/json',
	    data: JSON.stringify(loginInfo)
	}).done(function(data) {
		if (data) {
			console.log(data);
			//$.cookie('uid', data);
			location.reload(true);
		}
		else {
			console.log(data);
			$('#sak').append('<p>Wrong password or username</p>');
		}
	})
	/*$.post('/login', JSON.stringify(loginInfo), function(data) {
		if (data) {
			console.log(data);
			$.cookie('uid', data);
			location.reload(true);
		}
		else {
			console.log(data);
			$('#sak').append('<p>Wrong password or username</p>');
		}
	});*/
}

function registerUser() {
	if ($('#uname').val() === '' || $('#password').val() === '') {
		$('#wrong').text('at least username and password')
		return 0;
	}
	var person = new user($('#uname').val(), $('#password').val(), $('#name').val(), $('#bday').val(), $('#gender').val(), $('#job').val());

	$.post('/register', person, function(data) {
		if (data) {
			console.log(data);
			$('#sak').append('<p>Sweet! Now <a href="/">Login!</a></p>');
		}
		else {
			console.log(data);
			$('#sak').append('<p>User already exists</p>');
		}
	});

}

function sendDaMsg() {
	var to = $('#to').val();
	var msg = {
		"from" : "kalle",
		'message' : $('#msgtext').val()
	}
	var messageInfo = {
		'to' : to,
		'message' : msg
	}
	$.post('/sendmessage', messageInfo, function(data) {
		console.log(data);
	})
}

function acceptDaRequest() {
	var toAccept = $('#toAccept').val();

	var accepter = {
		'acceptee' : toAccept,
	}
	$.post('/acceptrequest', accepter, function(data) {
		console.log(data);
	})
}

function renderThing(thing) {
	$('#main').append('<' + thing + '></' + thing + '>');
}



function user(userName, password, name, birthday, gender, occupation) {
	this.u_id = userName;
	this.passwd = password;
	this.personalInfo = {
		"realName" : name,
		"bday" : birthday,
		"gender" : gender,
		"occupation" : occupation
	}
	this.friends = [];
	this.messages = [];
}

function logOut() {
	$.removeCookie('uid');
	location.reload(true);
}

$(function(){

	//$('#namem8').text(data.u_id)
	/*	$.ajaxSetup({
	xhrFields: {
	withCredentials: true
}
});*/
});

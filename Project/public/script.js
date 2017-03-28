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
	$.post('/login', loginInfo, function(data) {
		if (data) {
			console.log(data);
			$.cookie('uid', data);
			location.reload(true);
		}
		else {
			$('#sak').append('<p>Wrong password or username</p>');
		}
	});
}

function registerUser() {
	if ($('#uname').val() === '' || $('#password').val() === '') {
		$('#wrong').text('at least username and password')
		return 0;
	}
	var person = new user($('#uname').val(), $('#password').val(), $('#name').val(), $('#bday').val(), $('#gender').val(), $('#job').val());

	$.post('/register', person, function(data) {
		if (data === '200') {
			console.log(data);
			$('#sak').append('<p>Sweet! Now <a href="/">Login!</a></p>');
		}
		else {
			console.log(data);
		}
	});

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

$(function(){
	/*	$.ajaxSetup({
	xhrFields: {
	withCredentials: true
}
});*/
});

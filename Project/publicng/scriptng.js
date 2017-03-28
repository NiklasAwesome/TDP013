angular.module('myApp', ['ngSanitize', 'ngRoute', 'ngCookies'])
	.controller('userCtrl', function($scope, $http, $templateRequest, $sce) {

	});

	angular.module('myApp').config(function($routeProvider) {
	    $routeProvider
	    .when("/", {
	        template : "<me></me>"
	    })
	    .when("/friends", {
	        template : "<friends></friends>"
	    })
	    .when("/search", {
	        template : "<search></search>"
	    })
		.when("/:user", {
			template : "<other-user-page></other-user-page>"
		});
	});


	angular.module('myApp').component('me', {
		templateUrl: "/userpage.html",
		controller: function($http, $scope, $cookies) {
			var self = this

			$scope.exists = true;
			$scope.me = true;

			self.getmsg = function() {
				$http.get('/messages').then(function(res) {
					self.messages = res.data;
				});
			}

			self.getmsg();

			$http.get('/me').then(function(res) {
				self.user = res.data;
				self.me = res.data.u_id;
			});

			var myCookie = $cookies.get('uid');
			$scope.sendMsg = function(msg) {
				if (msg != undefined) {
					var msgdata = {
						to : self.user.u_id,
						message : {
							from : self.me,
							message : msg
						}
					}
					$http.post('/sendmessage', msgdata).then(function(data) {
						console.log(msgdata);
						console.log(data.data);
						self.getmsg();

					});

				}
			}
			$scope.notFriends = false;
		}
	});

	angular.module('myApp').component('otherUserPage', {
		templateUrl: "/userpage.html",
		controller: function($http, $scope, $routeParams, $cookies) {
			var self = this
			this.usera = $routeParams.user;
			$scope.me = false;

			console.log("kiss");
			self.getThem = function() {
				$http.get('/search?name=' + this.usera).then(function(res) {
					self.user = res.data;
					if (self.user.u_id != null) {
						$scope.exists = true;
					}
					else {
						$scope.exists = false;
					}
					self.messages = res.data.messages;
					self.namem = "balle";
					console.log(res.data[0]);


					$http.get('/friends').then(function(res) {
						self.friends = res.data;
						console.log(res.data);
						if (self.friends == false) {
							$scope.notFriends = true;
						}
						else if (self.friends.indexOf(self.user.u_id) == -1) {
							$scope.notFriends = true;
						}
						else {
							$scope.notFriends = false;
						}
					});

				});
			}
			self.getThem();
			$http.get('/me').then(function(res) {
				self.me = res.data.u_id;
			});

			var myCookie = $cookies.get('uid');
			//$scope.newMsg;
			$scope.sendMsg = function(msg) {
				console.log("här..." + msg);
				if (msg != undefined) {
					console.log("däär");
					var msgdata = {
						to : self.user.u_id,
						message : {
							from : self.me,
							message : msg
						}
					}
					$http.post('/sendmessage', msgdata).then(function(data) {
						console.log(msgdata);
						console.log(data);
						self.getThem();

					});
					$scope.newMsg = '';

				}
			}

			$scope.addAsFriend = function() {
				console.log("innan obj");
				var newfriend = {
					friend : self.user.u_id

				}

				console.log("efter obj");
				$http.post('/addfriend', newfriend).then(function(data) {
					console.log("i httpreq");
					//console.log(data);
					self.getThem();
					console.log("efter getThem");

				}, function(data) {
					console.log("fel... ");
					console.log(data);
				});
			}




		}
	});

	angular.module('myApp').component('friends', {
		templateUrl: "/friends.html",
		controller: function($http, $scope) {
			var self = this;

			self.test = "funkar!"


			console.log("kiss");
			$http.get('/friends').then(function(res) {
				self.friends = res.data;
				self.test = "Funkar!!!";
				console.log(res.data);

			});
			$http.get('/me').then(function(res) {
				self.user = res.data;
			});
			$scope.acceptFriend = function(acte) {
				$http.post('/acceptrequest', {acceptee : acte}).then(function(data) {
					console.log(data);

					$http.get('/friends').then(function(res) {
						self.friends = res.data;
						self.test = "Funkar!!!";
						console.log(res.data);

					});

					$http.get('/me').then(function(res) {
						self.user = res.data;
					});

				});
			}
		}
	});

	angular.module('myApp').component('search', {
		templateUrl: "/search.html",
		controller: function($http, $scope) {
			$scope.searchbox = '';
			var self = this;

			self.test = "funkar!"

			$http.get('/getall').then(function(res) {
				self.all = res.data;
			});

		}
	});

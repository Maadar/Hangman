//main module
var app = angular.module("mainApp", []);

//service which load answers.json
app.service("answersService", function($http, $q) {
    var deferred = $q.defer(); 
    $http.get('json/answers.json').success(function(data) {
        deferred.resolve(data);
    });
    this.getData = function() {
        return deferred.promise;
    }
});

//main controller
app.controller("mainCtrl", function($scope, answersService) {
	var promiseAnswers = answersService.getData();
	
	//load data from json and put it to the variable
	promiseAnswers.then(function(data) {
		$scope.answer = data;
		console.log($scope.answer);
	});

	//array contains values of buttons
	$scope.letters = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "R", "S", "T", "U", "W", "Y", "Z"];

	var config = {
		test : "Just a test",
		charCounter : 0
	};
	$scope.config = config;
 
	$scope.start = function() {
		//draw random word from answers.json
	    $scope.chosenWord = $scope.answer[Math.floor(Math.random() * $scope.answer.length)];
		console.log($scope.chosenWord.jsonVal);
		convertString();
	}

	var convertString = function() {
		config.charCounter = $scope.chosenWord.jsonVal.length;
		$scope.hiddenPassword = "";
		$scope.new = "";
		//add " " when space appear "-" for the others
		for(i = 0; i < config.charCounter; i++) {
			($scope.chosenWord.jsonVal.charAt(i).charCodeAt() === 32) 
			? $scope.hiddenPassword = $scope.hiddenPassword + " "
			: $scope.hiddenPassword = $scope.hiddenPassword + "-"
		}
		console.log($scope.hiddenPassword); 
	}
	
	//created function, which 
	String.prototype.setLetter = function(place, character, index) {
		if (place > this.length -1) return this.toString(); //check length and protect against check letter, which doesn't exist and be sure it is converted on string
		else return this.substr(0, place) + character + this.substr(place + 1);
	} 

	//check exist letters in string and switch "-" on letter
	$scope.check = function(index, letter) {
		//contain clicked letter
		console.log($scope.letters[letter, index]);
		//iterate via each letter and check if this letter is equal to the button value
		for (i=0; i<config.charCounter; i++) { //charCounter contains int
			if ($scope.chosenWord.jsonVal.charAt(i) == $scope.letters[letter, index]) { //letter contains value of the button, index contains correct number of the button
				$scope.hiddenPassword = $scope.hiddenPassword.setLetter(i, letter, index);
				console.log($scope.hiddenPassword);
			}
		}
	}
});
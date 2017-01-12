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
		charCounter : 0,
		displayStartBtn : true,
		isAlreadyDrawn : [],
		attempts : 6,
		chosenWord : "",
		strikedLetter : true,
		displayHangmanImage : ""
	};
	$scope.config = config;

	var convert = {
		charCounter : 0,
		hiddenPassword : ""
	};
	$scope.convert = convert;
	
	config.displayStartBtn;
 	config.isAlreadyDrawn;
 	$scope.disableClickedButton = false;
	
	String.prototype.setLetter = function(place, character, index) {
		if (place > this.length -1) return this.toString(); //check length and protect against check letter, which doesn't exist and be sure it is converted on string
		else return this.substr(0, place) + character + this.substr(place + 1);
	} 

	$scope.start = function() {
		//draw random word from answers.json
	    config.chosenWord = $scope.answer[Math.floor(Math.random() * $scope.answer.length)];
		console.log(config.chosenWord.jsonVal);
		isAlreadyDrawn(); 
		convertString();
		config.attempts = 6;
		$scope.disableClickedButton = false;
		
		if (config.attempts == 6) { config.displayHangmanImage = $scope.answer[0].img; } 

		}

	//check exist letters in string and switch "-" on letter
	$scope.check = function(index, letter) {
		config.strikedLetter = true;
		console.log($scope.letters[letter, index]); //contain clicked letter
		//iterate via each letter and check if this letter is equal to the button value
		for (i=0; i<config.charCounter; i++) { //charCounter contains int
			if (config.chosenWord.jsonVal.charAt(i) == $scope.letters[letter, index]) { //letter contains value of the button, index contains correct number of the button
				convert.hiddenPassword = convert.hiddenPassword.setLetter(i, letter, index);
				config.strikedLetter = false;
				console.log(convert.hiddenPassword);
			}
		}

		if (config.strikedLetter == true) {
			config.attempts = config.attempts - 1;
			this.disableClickedButton = true;
			
		// display images when letter is missed
		if 		(config.attempts == 5) { config.displayHangmanImage = $scope.answer[1].img; } 
		else if (config.attempts == 4) { config.displayHangmanImage = $scope.answer[2].img; }
		else if (config.attempts == 3) { config.displayHangmanImage = $scope.answer[3].img; }
		else if (config.attempts == 2) { config.displayHangmanImage = $scope.answer[4].img; }
		else if (config.attempts == 1) { config.displayHangmanImage = $scope.answer[5].img; }
		else if (config.attempts == 0) { config.displayHangmanImage = $scope.answer[6].img; }

		} else this.disableClickedButton = true;
		finishAlert();
		//info about defeat
		if (config.attempts == 0) {
			console.log("Przegrales");
			$scope.disableClickedButton = true;
		}
	}

	//convert string on password
	var convertString = function() {
		config.charCounter = config.chosenWord.jsonVal.length;
		convert.hiddenPassword = "";
		//add " " when space appear "-" for the others
		for(i = 0; i < config.charCounter; i++) {
			(config.chosenWord.jsonVal.charAt(i).charCodeAt() === 32) 
			? convert.hiddenPassword = convert.hiddenPassword + " "
			: convert.hiddenPassword = convert.hiddenPassword + "-"
		}
		console.log(convert.hiddenPassword); 
	}			

	//function checks if word is already drawn. If true, push to the array and dont draw it again
	var isAlreadyDrawn = function () {
		if (config.isAlreadyDrawn.indexOf(config.chosenWord.jsonVal) == -1) {
			config.isAlreadyDrawn.push(config.chosenWord.jsonVal);
			console.log(config.isAlreadyDrawn);
		} 
		else {
			do {
				console.log(config.chosenWord.jsonVal);
				for (i = 0; i <= config.isAlreadyDrawn.length; i++) {
					config.chosenWord = $scope.answer[Math.floor(Math.random() * $scope.answer.length)];
					if (config.isAlreadyDrawn[i] == config.chosenWord.jsonVal) {
					    console.log(config.chosenWord.jsonVal);
					}
				}
			} while (config.isAlreadyDrawn.indexOf(config.chosenWord.jsonVal) != -1);
		config.isAlreadyDrawn.push(config.chosenWord.jsonVal);
		console.log(config.isAlreadyDrawn);
		}
		finishAlert();
	}

	//finish alert, which should display modal with info
	var finishAlert = function() {
		if (config.isAlreadyDrawn.length == 6) {
			config.displayStartBtn = false;
			if (convert.hiddenPassword == config.chosenWord.jsonVal) {
				console.log("display modal with info"); // modal will be displayed 
			}
		}
	}
});
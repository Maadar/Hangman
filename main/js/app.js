//main module
var app = angular.module("mainApp", []);

//service which loads answers.json
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
	});

	//array contains values of buttons
	$scope.letters = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z"];

	var config = {
		charCounter : 0,
		isAlreadyDrawn : [],
		attempts : 6,
		chosenWord : "",
		strikedLetter : true,
		displayHangmanImage : "",
		guessedWords : 0
	};
	$scope.config = config;

	var convert = {
		charCounter : 0,
		hiddenPassword : ""
	};
	$scope.convert = convert;

	var alert = {
		showSuccessAlert : true,
		showDefeatAlert : true
	}
	$scope.alert = alert;

	var buttons = {
		displayStartBtn : true,
		displayNextBtn : false,
		disableClickedButton : true
	}
	$scope.buttons = buttons;

	String.prototype.setLetter = function(place, character, index) {
		if (place > this.length -1) return this.toString(); //check length and protect against check letter, which doesn't exist and be sure it is converted on string
		else return this.substr(0, place) + character + this.substr(place + 1);
	} 

	$scope.start = function() {
		//draw random word from answers.json
		configuration();
		isAlreadyDrawn(); 
		convertString();
		buttons.displayNextBtn = true;
		buttons.disableClickedButton = false;
	}

	$scope.next = function() {
		configuration();
		isAlreadyDrawn(); 
		convertString();
		alert.showSuccessAlert = true;
		alert.showDefeatAlert = true;
	}

	//check exist letters in string and switch "-" on letter
	$scope.check = function(index, letter) {
		config.strikedLetter = true;
		//iterate via each letter and check if this letter is equal to the button value
		for (i=0; i<config.charCounter; i++) { //charCounter contains int
			if (config.chosenWord.jsonVal.charAt(i) == $scope.letters[letter, index]) { //letter contains value of the button, index contains correct number of the button
				convert.hiddenPassword = convert.hiddenPassword.setLetter(i, letter, index);
				config.strikedLetter = false;
			}
		}
		isLetterStriked();	
		attemptsResult();
		finishAlert();
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
	}			

	//function checks if word is already drawn. If true, push to the array and dont draw it again
	var isAlreadyDrawn = function () {
		if (config.isAlreadyDrawn.indexOf(config.chosenWord.jsonVal) == -1) {
			config.isAlreadyDrawn.push(config.chosenWord.jsonVal);
		} 
		else 
		{
			do {
				for (i = 0; i <= config.isAlreadyDrawn.length; i++) {
					config.chosenWord = $scope.answer[Math.floor(Math.random() * $scope.answer.length)];
				}
			} while (config.isAlreadyDrawn.indexOf(config.chosenWord.jsonVal) != -1);
			config.isAlreadyDrawn.push(config.chosenWord.jsonVal);
		}
		finishAlert();
	}

	//finish alert, which should display modal with info
	var finishAlert = function() {
		if (config.isAlreadyDrawn.length == 6) {
			buttons.displayNextBtn = false;
			if ((config.attempts == 0) || (convert.hiddenPassword == config.chosenWord.jsonVal)){
				window.alert("Game finished! You earned " + config.guessedWords + " points");
			}
		}
	}
	
	var configuration = function() {
		config.attempts = 6;
		(config.attempts == 6) ? config.displayHangmanImage = $scope.answer[0].img : "";
		config.chosenWord = $scope.answer[Math.floor(Math.random() * $scope.answer.length)];
		buttons.disableClickedButton = false;
		buttons.displayStartBtn = false;
	}

	// function responsible for display images with hangman elements
	var isLetterStriked = function() {
		if (config.strikedLetter == true) {
			config.attempts = config.attempts - 1;
			
		// display images when letter is missed
		if 	(config.attempts == 5) { config.displayHangmanImage = $scope.answer[1].img; } 
		else if (config.attempts == 4) { config.displayHangmanImage = $scope.answer[2].img; }
		else if (config.attempts == 3) { config.displayHangmanImage = $scope.answer[3].img; }
		else if (config.attempts == 2) { config.displayHangmanImage = $scope.answer[4].img; }
		else if (config.attempts == 1) { config.displayHangmanImage = $scope.answer[5].img; }
		else if (config.attempts == 0) { config.displayHangmanImage = $scope.answer[6].img; }

		}
	}

	// display alert, depend, which if is executed
	var attemptsResult = function() {
		if (config.attempts == 0){
			buttons.disableClickedButton = true;
			alert.showDefeatAlert = false;
		} 
		if ((config.attempts !=0) && (convert.hiddenPassword == config.chosenWord.jsonVal)) {
			alert.showSuccessAlert = false;
			config.guessedWords = config.guessedWords + 1;
		}
	}
});
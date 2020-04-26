// Global Variables
let testItem = [];		//  Array of testItem objects.  Used to control HTML content and appearance.
let currentItem = 0;	//  Index for testItem Array.
let timeRemaining = 0;	//  Controls game timer. 
let quizInterval = null;	
let totalCorrect = 0;	//  Score tracking.
let totalIncorrect = 0;
let totalQuestions = 0;
let finalScore = 0;		
let storedScores = [];	//  Controls persistence of High Scores.

$(document).ready(function () {

	//  A random number generator.
	function jRandom(x) {

		return Math.floor(Math.random() * x);

	}

	//  Function sortScores sorts storedScores. 
	//  NOTE: Index 1 is Score %.  Index 2 is Time Remaining.
	//  x and y are elements in storedScores being compared to eachother.
	function sortScores() {

		storedScores = storedScores.sort(function(x,y) {

			//  If Score is tied, sort by Time Remaining...
			if(x[1]-y[1] == 0) {
				return y[2]-x[2];
			}
			//  ...otherwise sort by score.
			else {
				return y[1]-x[1];
			}

		});
		
	}

	//  Function renderScores renders scores. (Who would have thought?)
	function renderScores() {
		
		if (localStorage.getItem("scores") !== null) {
			
			storedScores = JSON.parse(localStorage.getItem("scores"));
		  
			$(".added").remove();
			sortScores();
			//  Place High Scores from localStorage into newly created elements inside High Score modal.
			for (let i = 0; i < storedScores.length; i++) {

				//NOTE:  Class 'added' is used to easily remove highScores elements.
				let newRow = $("<tr class='added'>");
				$("#highScores").append(newRow);
				newRow.append($("<td class='added'>").text(storedScores[i][0])).append($("<td class='added'>").text(storedScores[i][1] + " %")).append($("<td class='added'>").text(storedScores[i][2] + " seconds"));

			}

		}

	}

	//  Sounds are fun.
	let sounds = {

		select:    () => $("#menuSelect")[0].play(),
		right: 	 () => $("#correctSound")[0].play(),
		wrong:     () => $("#incorrectSound")[0].play(),
		scoreGong: () => $("#scoreGong")[0].play(),
		timeUp:	 () => $("#timeUp")[0].play(),
		complete:  () => $("#complete" + (jRandom(3) + 1))[0].play(),
		click:	 () => $("#click")[0].play(),
		woosh:     () => $("#woosh")[0].play(),
		shutdown:  () => $("#shutdown")[0].play()

	};

	//  Function newGame sets up content of HTML, testItems element,s and event listeners for a new game.
	function newGame() {

		renderScores();
		
		//  Exam question objects.
		testItem = [

			{
				name: "alert in JS",
				question: "Which makes an alert box?",
				correctAnswer: "alert();",
				incorrectAnswers: ["alertBox();", "msg();", "msgBox();"]
			},

			{
				name: "Comment in JavaScript",
				question: "Which is a comment in a JavaScript?",
				correctAnswer: "// This",
				incorrectAnswers: ["<!--This-->", "`This`", "#This"]
			},

			{
				name: "FOR loop",
				question: "Which starts a FOR loop?",
				correctAnswer: "for",
				incorrectAnswers: ["four", "fore!", "4"]
			},

			{
				name: "jQuery question",
				question: "The 'shorthand' version of JavaScript is called ____________.",
				correctAnswer: "jQuery",
				incorrectAnswers: ["HTML", "miniJava", "jScript"]
			},

			{
				name: "id Syntax Question",
				question: "Which of these selects an element by ID?",
				correctAnswer: "#",
				incorrectAnswers: [".", "@", "$"]
			},

			{
				name: "class Syntax Question",
				question: "Which of these select an element by class?",
				correctAnswer: ".",
				incorrectAnswers: ["#", "@", "$"]
			},

			{
				name: "Identify event listeners",
				question: "Which of these can add an event listener?",
				correctAnswer: ".on()",
				incorrectAnswers: [ ".off()", ".up()", ".down()"]
			},

			{
				name: "Variable types",
				question: "Which variable type holds a value of true or false?",
				correctAnswer: "Boolean",
				incorrectAnswers: ["String", "Array", "Integer"]
			},

			{
				name: "For loop question",
				question: "Which of these belong inside a FOR-loop's argument?",
				correctAnswer: "all of these",
				incorrectAnswers: ["iterator", "condition", "initializer"]
			},

			{
				name: "Linking .js files to html",
				question: "Which <script> attribute links HTML to a js file?",
				correctAnswer: "src",
				incorrectAnswers: ["href", "rel", "name"]
			},

			{
				name: "DOM",
				question: "What does the 'O' in DOM stand for?",
				correctAnswer: "Object",
				incorrectAnswers: ["Olive", "Ocelot", "Octogon"]
			},

			{
				name: "Conditional Q",
				question: "let x = !!!true;  What is the value of x?",
				correctAnswer: "false",
				incorrectAnswers: ["true", "null", "supertrue"]
			}

		];

		//  Reset certain globals.
		totalIncorrect = 0;
		totalCorrect = 0;
		totalQuestions = testItem.length;
		timeRemaining = 120;

		$("*").off();
		$("#unanswered").remove();

		//  Add fun sounds for High Score link (only <a> on the site).
		$("a").click(function () {

			$("#scoreModal").modal('show');
			sounds.woosh();

		});
		$('#scoreModal').on('hide.bs.modal', function () {

			sounds.woosh();
			$(".clearScores").off();

		});

		//  Ensure Clear Scores button only works when there is a high score to delete.
		$("#scoreModal").on("shown.bs.modal", function() {

			if($("#highScores tr").length > 1) {
				
				$(".clearScores").click(sounds.shutdown).click(function () {
	
					//  Fun animation, fun sound, and removal of localStorage/High Score elements.
					$(".added").animate({

						'padding': "0px",
						'height': "0px",
						'font-size': "0px",
						'margin': "0px"

					}, 4800, function() {

						$(".added").remove();
						localStorage.removeItem("scores");
						storedScores = [];

					});

					$(".clearScores").off();

				});
	
			}
		});

		$(".question").text("Depth of Knowledge: JavaScript Edition");
		$(".answerBtn").text("_").addClass("off").removeClass("on active correct incorrect smaller");
		$(".submitBtn").text("CLICK TO BEGIN").addClass("on correct").click(startTimer).click(sounds.select).click(phaseOne);
		

	}

	//  Function phaseOne presents a new question and its answer choices to the player.
	function phaseOne() {

		currentItem = jRandom(testItem.length)
		let item = testItem[currentItem];
		$(".question").text(item.question);
		$(".submitBtn").text("SELECT YOUR ANSWER").removeClass("correct incorrect on").off();
		$(".answerBtn").attr("value", "false");
		$(".answerBtn")[jRandom(4)].setAttribute("value", "true");

		$(".answerBtn").each(function () {

			if (this.value === "true") {
				$(this).text(item.correctAnswer).click(sounds.right);
			}
			else {
				let x = jRandom(item.incorrectAnswers.length);
				$(this).text(item.incorrectAnswers[x]).click(sounds.wrong);
				item.incorrectAnswers.splice(x, 1);
			}

		});

		$(".answerBtn").addClass("active").removeClass("off on correct incorrect").click(sounds.click).click(phaseTwo);

	}

	//  Function phaseTwo gives feedback to player and updates score/time variable
	//  base on player's choice in phaseOne.
	function phaseTwo() {
		
		$(".answerBtn").removeClass("active").off();
		$(".answerBtn").each(function () {

			if (this.value === "true") {
				$(this).addClass("correct");
			}
			else {
				$(this).addClass("incorrect");
			}

		});

		if (this.value === "true") {

			totalCorrect += 1;

			$(".submitBtn").text("CORRECT!  CLICK FOR NEXT QUESTION").addClass("correct on");

			if (testItem.length == 1) {

				$(".submitBtn").text("CORRECT! CLICK TO COMPLETE EXAM");

			}

		}
		else {

			totalIncorrect += 1;
			timeRemaining -= 10;

			$(".submitBtn").text("INCORRECT.  CLICK FOR NEXT QUESTION").addClass("incorrect on");

			if (testItem.length == 1) {
				$(".submitBtn").text("INCORRECT! CLICK TO COMPLETE EXAM");
			}

			if (timeRemaining < 0) {
				timeRemaining = 0;
			}

			$("#timer").text("Time remaining: " + timeRemaining + "s");

		}

		$(".submitBtn").click(stateCheck);

	}

	//  Function stateCheck either starts a new phaseOne with a new question or
	//  ends the current game if there are no questions left.
	function stateCheck() {

		if (testItem.length !== 1) {

			testItem.splice(currentItem, 1);
			currentItem = jRandom(testItem.length);
			sounds.select();
			phaseOne();

		}
		else {

			endPhase("complete");

		}

	}

	//  Function endPhase ends the current game based on the reason passed to it.
	//  The player is given feedback and offered to save his/her score.
	function endPhase(reason) {

		$(".submitBtn").removeClass("on active correct incorrect").off();
		$(".answerBtn").removeClass("on active correct incorrect").off();

		if (reason === "complete") {

			$(".question").text("Examination Complete!");
			$(".four").text(totalIncorrect).addClass("incorrect");
			sounds.complete();

		}

		if (reason === "timeUp") {

			$(".question").text("TIME EXPIRED.   GAME OVER.");
			$(".four").text(totalIncorrect).addClass("incorrect").append($("<div id='unanswered'>").text(" (" + (totalQuestions - (totalCorrect + totalIncorrect)) + " unanswered)"));

		}

		finalScore = Math.round((totalCorrect / (totalQuestions)) * 100);
		$(".submitBtn").off();
		$(".submitBtn").text("FINAL SCORE : " + finalScore + "%  CLICK TO SAVE").addClass("on");
		$(".one").text("Total Correct").addClass("correct smaller");
		$(".two").text("Total Incorrect").addClass("incorrect smaller");
		$(".three").text(totalCorrect).addClass("correct");
		clearInterval(quizInterval);
		$(".submitBtn").click(getName);

	}

	//  Function getName shows modal for player to input a name.
	function getName() {

		$(".submitBtn").off();
		$("#initialsModal").modal('show');
		sounds.woosh();

		setTimeout(function () { 

			$("#initial-input").focus() ;

		}, 500);

		$("#initial-input").keydown(function (event) {

			if (event.keyCode === 13) {

				$(".saver").click();

			}

		});

		$("#initial-input").keydown(function(event) {

			if(event.keyCode == 16) {

				return;

			}

			sounds.click();
		});

		$(".saver").click(sounds.scoreGong).click(logScore);
		$(".submitBtn").text("FINAL SCORE : " + finalScore + "%  CLICK TO RETRY").click(sounds.click).click(newGame);

	}

	//  Function logScore adds the player's stats for his/her current
	//  game to localStorage and to the High Score modal.
	//  NOTE:  This function is purely optional and may never be called.
	function logScore() {
		
		$("initial-input").off();
		$(".saver").off();
		
		let playerName = $("#initial-input").val();
		let results = [playerName, finalScore, timeRemaining]
		storedScores.push(results);
		localStorage.setItem("scores", JSON.stringify(storedScores));
		renderScores();

		$("#initial-input").val("");
		$("#initialsModal").modal('hide');	
		$("#scoreModal").modal('show');

	}

	//  Function startTimer tracks the player's time left and ends the game if time expires.
	function startTimer() {

		timeRemaining -= 1;
		$("#timer").text("Time remaining: " + timeRemaining + "s")
		
		quizInterval = setInterval(function () {

			timeRemaining -= 1;
			$("#timer").text("Time remaining: " + timeRemaining + "s");
			
			if (timeRemaining == 0) {
				sounds.timeUp();
			}
			if (timeRemaining <= -1) {
				timeRemaining = 0;
				clearInterval(quizInterval);
				$("#timer").text("Time remaining: 0s");
				endPhase("timeUp");
			}

		}, 1000);

	}

	//  Start the game already!
	newGame();

});
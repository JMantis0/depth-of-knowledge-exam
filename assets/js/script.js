// Global Variables
let testItem = [];		//  Array of testItem objects.  Used to control HTML content and appearance.
let currentItem = 0;	//  Index for testItem Array.
let timeRemaining = 0;	//  Controls game timer. 
let quizInterval = null;	
let totalCorrect = 0;	//  Score tracking.
let totalIncorrect = 0;
let totalQuestions = 0;
let finalScore = 0;		
let storedScores = [].concat(JSON.parse(localStorage.getItem("scores")));  //  Controls persistence of High Scores.

$(document).ready(function () {

	//  A random number generator.
	function jRandom(x) {

		return Math.floor(Math.random() * x);

	}

	//  Add High Scores in localStorage to High Score modal.
	for (let i = 1; i < storedScores.length; i++) {

		let newRow = $("<tr class='added'>");
		$("#highScores").append(newRow);
		newRow.append($("<td class='added'>").text(storedScores[i][0])).append($("<td class='added'>").text(storedScores[i][1] + " %")).append($("<td class='added'>").text(storedScores[i][2] + " seconds"));

	}

	//  Define sounds object for audio events.
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

	//  Function newGame resets initial content of HTML, test items elements and event listeners.
	function newGame() {

		$("*").off();
		$("#unanswered").remove();
		$(".clearScores").click(sounds.shutdown).click(function () {
			$(".added").animate({
				'padding': "0px",
				'width': "0px",
				'font-size': "0px",
				'margin': "0px"
			}, 4800, function() {
				$(".added").remove();
				localStorage.removeItem("scores");
			});
		});

		//  Exam question objects.  Add or remove question from here.
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

		//  Adjust event listeners, CSS classes, and element content for a new game.
		$("a").click(function () {
			$("#scoreModal").modal('show');
			sounds.woosh();
		})
		$('#scoreModal').on('hide.bs.modal', function () {
			sounds.woosh();
		 });
		$(".question").text("Depth of Knowledge: JavaScript Edition");
		$(".submitBtn").text("CLICK TO BEGIN").addClass("on correct").click(startTimer).click(sounds.select).click(phaseOne);
		$(".answerBtn").text("_").addClass("off").removeClass("on active correct incorrect");

	}

	//  Function phaseOne adjusts event listeners, CSS classes, and element content for Phase One of the game.
	//  In every Phase One a new question and answers are displayed to the player.
	function phaseOne() {

		currentItem = jRandom(testItem.length)
		let item = testItem[currentItem];
		$(".question").text(item.question);
		$(".submitBtn").text("SELECT YOUR ANSWER").removeClass("correct incorrect on").off();
		$(".answerBtn").addClass("active").removeClass("off on correct incorrect").attr("value", "false").click(phaseTwo).click(sounds.click);
		$(".answerBtn")[jRandom(4)].setAttribute("value", "true");
		//$(".answerBtn").mouseover(sounds.click);

		let wrongAnswers = item.incorrectAnswers;
		$(".answerBtn").each(function () {

			if (this.value === "true") {
				$(this).text(item.correctAnswer).click(sounds.right);
			}
			else {
				let x = jRandom(wrongAnswers.length);
				$(this).text(wrongAnswers[x]).click(sounds.wrong);
				wrongAnswers.splice(x, 1);
			}

		});

	}

	//  Function phaseTwo adjusts event listeners, CSS classes, element content
	//  and updates score and time variables based upon the player's responses.
	//  In every Phase Two the player gets feedback for the answer s/he chose in Phase One.
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

			$(".submitBtn").text("CORRECT!  CLICK FOR NEXT QUESTION").addClass("correct on");
			if (testItem.length == 1) {
				$(".submitBtn").text("CORRECT! CLICK TO COMPLETE EXAM");
			}
			totalCorrect += 1;

		}
		else {

			$(".submitBtn").text("INCORRECT.  CLICK FOR NEXT QUESTION").addClass("incorrect on");
			if (testItem.length == 1) {
				$(".submitBtn").text("INCORRECT! CLICK TO COMPLETE EXAM");
			}
			totalIncorrect += 1;
			if (timeRemaining - 5 < 0) {
				timeRemaining = 0;
			}
			else {
				timeRemaining -= 10;
			}
			$("#timer").text("Time remaining: " + timeRemaining + "s");
		}

		$(".submitBtn").click(stateCheck);

	}

	//  Function stateCheck checks whether to start a new phaseOne or to proceed to endPhase.
	//  If starting a new Phase One, removes current testItem from array and generates an index for
	//  the next testItem.
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

	//  Function endPhase occurs when the quiz is over.  Can be called by stateCheck or
	//  by startTimer.  Adjusts event listeners, CSS classes, element content. In every
	//  endPhase the player scores are displayed.
	function endPhase(reason) {

		$(".submitBtn").removeClass("on active correct incorrect").off();
		$(".answerBtn").removeClass("on active correct incorrect").off();

		if (reason === "complete") {
			if (timeRemaining , 0) {timeRemaining = 0;}
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
		$(".one").text("Total Correct").addClass("correct");
		$(".two").text("Total Incorrect").addClass("incorrect");
		$(".three").text(totalCorrect).addClass("correct");
		clearInterval(quizInterval);
		$(".submitBtn").click(getName);

	}

	//  Function getName causes modal to appear where Player can enter a name
	//  used for logging the quiz score.  Adjusts event listeners, CSS classes, element content.
	function getName() {

		$(".submitBtn").off();
		$(".submitBtn").text("FINAL SCORE : " + finalScore + "%  CLICK TO RETRY").click(newGame);
		$("#initialsModal").modal('show');
		sounds.woosh();
		setTimeout(function () { $("#initial-input").focus() }, 500);
		$(".saver").click(logScore).click(sounds.scoreGong);
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
	}

	//  Function logScore adds the player name and score to the High Scores modal
	//  and also adds the results to local storage. Then hides the input modal
	//  and shows the High Score modal.  Adjusts event listeners, CSS classes, element content.
	function logScore() {

		$("initial-input").off();
		$(".saver").off();
		let playerName = $("#initial-input").val();
		let results = [playerName, finalScore, timeRemaining]
		let newRow = $("<tr class='added'>");
		$("#highScores").append(newRow);
		newRow.append($("<td class='added'>").text(playerName)).append($("<td class='added'>").text(finalScore + " %")).append($("<td class='added'>").text(timeRemaining + " seconds"));
		storedScores.push(results);
		localStorage.setItem("scores", JSON.stringify(storedScores));
		$("#initial-input").val("");
		$("#initialsModal").modal('hide');
		$("#scoreModal").modal('show');
	}

	//  Function startTimer keeps track of how much time the player has left.
	//  When the time expires endPhase is called.
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

	//  Start a new game!
	newGame();

});
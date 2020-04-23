let testItem = [];
let currentItem = 0;
let timeRemaining = 0;
let totalCorrect = 0;
let totalIncorrect = 0;
let totalQuestions = 0;
let finalScore = 0;
let quizInterval = null;
let scores = [];

$(document).ready(function () {

		//scores = JSON.parse(localStorage.getItem("scores"));
		/*for(let i=1; i < JSON.parse(localStorage.getItem("scores")); i++) {
			$("#highScores").append($("<li>").text(localStorage.getItem("scores")));
		}*/

	function jRandom(x) {

		return Math.floor(Math.random() * x);

	}
	
	//Function newGame sets up the initial content of HTML elements and event listeners
	function newGame() {

		$("*").off();
		
		testItem= [

			{
				name: "Declare function",
				question: "Which declares a function named turnRed?",
				correctAnswer: "function turnRed() {}",
				incorrectAnswers: ["function() turnRed {}", "function = turnRed() {}", "function turnRed{}"]
			},
		
			{
				name: "alert in JS",
				question: "How do you write \"Hello World\" in an alert box?",
				correctAnswer: "alert(\"Hello World\");",
				incorrectAnswers: ["alertBox(\"Hello World\");", "msg(\"Hello World\");", "msgBox(\"Hello World\");"]
			},
		
			{
				name: "Comment in JavaScript",
				question: "How can you add a comment in a JavaScript?",
				correctAnswer: "// This is a comment",
				incorrectAnswers: ["<!--This is a comment-->", "`This is a comment", "#This is a comment"]
			},
		
			{
				name: "FOR loop",
				question: "How does a FOR loop start?",
				correctAnswer: "for (i = 0; i < 10; i++)",
				incorrectAnswers: ["for i = 1 to 5", "for (i <= 5; i++)", "for (i = 0; i <= 5)"]
			},
		
			{
				name: "jQuery question",
				question: "The 'shorthand' version of JavaScript is called ____________.",
				correctAnswer: "jQuery",
				incorrectAnswers: ["HTML", "Boolean", "jScript"]
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
				correctAnswer: "all of these",
				incorrectAnswers: [".addEventListener()", ".on()", ".click()"]
			},
		
			{
				name: "Variable types",
				question: "This variable type holds a value of true or false:",
				correctAnswer: "Boolean",
				incorrectAnswers: ["String", "Constant", "Integer"]
			},
		
			{
				name: "For loop question",
				question: "What belongs inside a FOR-loop's argument?",
				correctAnswer: "all of these",
				incorrectAnswers: ["iterator", "condition", "initializer"]
			},
			{
				name: "Linking .js files to html",
				question: "Which links HTML to a file called \"script.js\"?",
				correctAnswer: "<script src=\"script.js\">",
				incorrectAnswers: ["<script href=\"script.js\">", "<script ref=\"script.js\">", "<script name=\"script.js\">"]
			},
		
			{
				name: "DOM",
				question: "What does the 'O' in DOM stand for?",
				correctAnswer: "Object",
				incorrectAnswers: ["Olive", "Ocelot", "Octogon"]
			}
	
		];

		totalIncorrect =0;
		totalCorrect = 0;
		totalQuestions = testItem.length;
		timeRemaining = 3;

		$("a").click(function(){
			$("#scoreModal").modal('show');
		})
		$(".question").text("Depth of Knowledge Exam. This exam is exactly " + testItem.length + " questions.");
		$(".answerBtn").text("_").addClass("off").removeClass("on active correct incorrect");
		$(".submitBtn").text("CLICK TO BEGIN").addClass("on correct").click(phaseOne).click(startTimer);

	}

	function phaseOne() {
		
		$(".submitBtn").text("SELECT YOUR ANSWER").removeClass("correct incorrect on").off();
		currentItem = jRandom(testItem.length)
		let item = testItem[currentItem];
		$(".question").text(item.question);
		$(".answerBtn").addClass("active").removeClass("off on correct incorrect").attr("value", "false").click(phaseTwo);	
		$(".answerBtn")[jRandom(4)].setAttribute("value", "true");

		let wrongAnswers = item.incorrectAnswers;
		$(".answerBtn").each(function () {

			if (this.value === "true") {
				$(this).text(item.correctAnswer);
			}
			else {
				let x = jRandom(wrongAnswers.length);
				$(this).text(wrongAnswers[x]);
				wrongAnswers.splice(x, 1);
			}

		});
			
	}

	function phaseTwo(event) {

		event.preventDefault();
		$(".answerBtn").removeClass("active").off();
		$(".answerBtn").each(function () {

			if (this.value === "true") {
				$(this).addClass("correct on");
			}
			else {
				$(this).addClass("incorrect");
			}

		});

		if (this.value === "true") {

			$(".submitBtn").text("CORRECT!  CLICK FOR NEXT QUESTION").addClass("correct on");
			totalCorrect += 1;

		}
		else {

			$(".submitBtn").text("INCORRECT.  CLICK FOR NEXT QUESTION").addClass("incorrect on");
			totalIncorrect += 1;
			if(timeRemaining - 5 < 0) {
				timeRemaining = 0;
			}
			else{
				timeRemaining -= 5;
			}
			$("#timer").text("Time remaining: " + timeRemaining + "s");
		}
		
		$(".submitBtn").click(stateCheck);

	}

	function stateCheck(event) {

		event.preventDefault();
		if(testItem.length !== 1) {

			testItem.splice(currentItem, 1);
			currentItem = jRandom(testItem.length);
			phaseOne();
		}
		else{
			endPhase("complete");
		}
		
	}

	function endPhase(reason) {

		$(".btn").removeClass("on active correct incorrect").off();
		if(reason === "complete") {
			$(".question").text("Examination Complete!");
			$(".four").text(totalIncorrect).addClass("incorrect");
		}
		if(reason === "timeUp"){
			$(".question").text("TIME EXPIRED. GAME OVER.");
			$(".four").text(totalIncorrect + " (" + (totalQuestions - (totalCorrect + totalIncorrect)) + " unanswered)").addClass("incorrect");
		}
		finalScore = Math.round((totalCorrect / (totalQuestions))*100);
		$(".submitBtn").off();
		$(".submitBtn").text("FINAL SCORE : " + finalScore + "%  CLICK TO SAVE").addClass("on");
		$(".one").text("Total Correct").addClass("correct");
		$(".two").text("Total Incorrect").addClass("incorrect");
		$(".three").text(totalCorrect).addClass("correct");	
		clearInterval(quizInterval);
		$(".submitBtn").click(getName);

	}

	function getName() {
		$(".submitBtn").off();
		$(".submitBtn").text("FINAL SCORE : " + finalScore + "%  CLICK TO RETRY").click(newGame);
		$("#initialsModal").modal('show');
		$(".saver").click(logScore);
	}

	function logScore() {

		$(".saver").off();

		$("#highScores").append($("<li>").text($("#initial-input").val() + "  " + finalScore + "%"));

		//scores.push($("#initial-input").val() + "  " + finalScore + "%");
		//localStorage.setItem("scores", JSON.stringify(scores));

		$("#initial-input").val("");
		$("#initialsModal").modal('hide');
		$("#scoreModal").modal('show');
	}

	function startTimer() {
		console.log("inside start timer");
		$("#timer").text("Time remaining: " + timeRemaining + "s")
		timeRemaining -= 1;
		quizInterval = setInterval(function () {

			$("#timer").text("Time remaining: " + timeRemaining + "s");
			timeRemaining -= 1;
			if (timeRemaining <= -1) {
				clearInterval(quizInterval);
				$("#timer").text("Time remaining: 0s");
				endPhase("timeUp");
			}

		}, 1000);

	}

	newGame();

});
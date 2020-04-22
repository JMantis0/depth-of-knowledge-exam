


testItem = [

	{
		name: "Declare function",
		question: "Which declares a function named turnRed?",
		correctAnswer : "function turnRed() {}",
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
		question: "The shorthand version of JavaScript is called ____________.",
		correctAnswer: "jQuery",
		incorrectAnswers: ["HTML", "Boolean", "jScript"]
	},

	{
		name: "id Syntax Question",
		question: "Which of the following selects an element by ID?",
		correctAnswer: "#",
		incorrectAnswers: [".", "@", "$"]
	},

	{
		name: "class Syntax Question",
		question: "Which of the following selects an element by class?",
		correctAnswer: ".",
		incorrectAnswers: ["#", "@", "$"]
	},

	{
		name: "API question",
		question: "Which code appends an element to the <body>?",
		correctAnswer: "$(\"body\").append(\"<div>Hello</div>\");",
		incorrectAnswers: ["let x = document.body.createElement(<div>);", "console.log(\"Add element to body\")", "document.append(thisElement);"]
	},

	{
		name: "Identify event listeners",
		question: "Which of the following does not add an event listener",
		correctAnswer: ".append()",
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
		question: "Which does not belong inside F-loop parenthesis?",
		correctAnswer: "event listener",
		incorrectAnswers: ["iterator", "condition", "initializer"]
	},
	{
		name: "Linking .js files to html",
		question: "What is the correct syntax for referring to an external script called \"script.js\"?",
		correctAnswer: "<script src=\"script.js\">",
		incorrectAnswers: ["<script href=\"script.js\">", "<script ref=\"script.js\">", "<script name=\"script.js\">"]
	}
];

let testPool = testItem;
let timeRemaining = 0;
let totalCorrect = 0;
let totalIncorrect = 0;

let quizInterval = null;

$(document).ready(function () {

	let currentItem = jRandom(testPool.length)

	function jRandom(x) {
		return Math.floor(Math.random() * x);
	}

	//Function initialize sets up the initial content of HTML elements and event listeners
	function initialize() {

		timeRemaining = 900;
		$(".question").text("Depth of Knowledge Exam. This exam is exactly " + testPool.length + " questions.");

		//  Click handler for submit button at initialization.

		$(".answerBtn").addClass("off");
		$(".submitBtn").addClass("on correct");

		$(".submitBtn").click(function () {

			presentNextQuestion(testPool[currentItem]);

			$(".submitBtn").removeClass("on correct").off().text("SELECT YOUR ANSWER");
			$(".answerBtn").addClass("active").removeClass("off");
			$("#timer").text("Time remaining: " + timeRemaining)

			quizInterval = setInterval(function () {

				timeRemaining -= 1;
				$("#timer").text("Time remaining: " + timeRemaining);
				if (timeRemaining <= 0) {
					clearInterval(quizInterval);
					gameOver("TIME EXPIRED.");
				}

			}, 1000)

		});
	}

	function presentNextQuestion(item) {

		$(".question").text(item.question);

		//set all answerBtns value to false
		//then sets one  answerBtn value to true at random
		$(".answerBtn").attr("value", "false");
		$(".answerBtn")[jRandom(4)].setAttribute("value", "true");




		// for each answerBtn set text to correct answer or incorrect answer by value
		$(".answerBtn").each(function () {

			let wrongAnswers = item.incorrectAnswers;

			if (this.value === "true") {
				$(this).text(item.correctAnswer); //.textContent = item.correctAnswer;
			}
			else {
				let x = jRandom(wrongAnswers.length);
				$(this).text(wrongAnswers[x]);
				wrongAnswers.splice(x, 1);
			}

		});

		$(".answerBtn").click(clickHandler);
		//  Clickhandler for answer buttons.
		function clickHandler(event) {

			$(".answerBtn").each(function () {

				if (this.value === "true") {
					$(this).addClass("correct");
				}
				else {
					$(this).addClass("incorrect");
				}

			});

			if (this.value === "true") {

				if(lastQuestion()) {
					$(".submitBtn").text("CORRECT! EXAM COMPLETE. CLICK HERE");
					totalCorrect += 1;
					$(".submitBtn").addClass("correct")
					$(".submitBtn").off();
					clearInterval(quizInterval);
				}
				else {
					$(".submitBtn").text("CORRECT!  CLICK FOR NEXT QUESTION");
					totalCorrect += 1;
					$(".submitBtn").addClass("correct on");

				}
			}
			else {

				if(lastQuestion()) {
					$(".submitBtn").text("INCORRECT. EXAM COMPLETE. CLICK HERE ");
					totalIncorrect += 1;
					$(".submitBtn").addClass("incorrect");
					$(".submitBtn").off();
					clearInterval(quizInterval);
					
				}
				else {
					$(".submitBtn").text("INCORRECT.  CLICK FOR NEXT QUESTION");
					totalIncorrect += 1;
					timeRemaining -= 5;
					$(".submitBtn").addClass("incorrect on");
					$("#timer").text("Time remaining: " + timeRemaining);
				}
			}


			$(".answerBtn").removeClass("active");
			$(".answerBtn").off();


			$(".submitBtn").click(function () {

				if(!lastQuestion()) {
					testPool.splice(currentItem, 1);
					currentItem = jRandom(testPool.length);
					$(".submitBtn").text("SELECT THE CORRECT ANSWER").removeClass("incorrect correct on").off();
					$(".answerBtn").removeClass("correct incorrect").addClass("active");
					presentNextQuestion(testPool[currentItem]);
				}
				if(lastQuestion()) {
					gameOver("You reached the end of the exam.")
				}

			});
		};

		

	}

	function lastQuestion() {
		console.log("inside lastQuestion()")
		console.log("currentItem " +currentItem);
		console.log("testPool[currentItem] " + JSON.stringify(testPool[currentItem]));
		console.log("testPool.length " + testPool.length);
		console.log("testPool.length == 0 " + (testPool.length == 0));
		return (testPool.length == 0);
	}
	
	function gameOver(message) {
		console.log("inside gameover");
		
		$(".question").text(message + " GAME OVER.");
		$(".btn").addClass("off").removeClass("active on incorrectOn correct incorrect").off();

	}





	initialize();





});



testItem = [

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
		question: "Which does not belong inside FOR-loop parenthesis?",
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

let timeRemaining = 0;
let totalCorrect = 0;
let totalIncorrect = 0;

let quizInterval = null;

$(document).ready(function () {

	let currentItem = jRandom(testItem.length)

	function jRandom(x) {
		return Math.floor(Math.random() * x);
	}

	//Function initialize sets up the initial content of HTML elements and event listeners
	function initialize() {

		timeRemaining = 900;
		$(".question").text("Depth of Knowledge Exam. This exam is exactly " + testItem.length + " questions.");

		//  Click handler for submit button at initialization.

		$(".answerBtn").addClass("off");
		$(".submitBtn").addClass("on correct");

		quizInterval = setInterval(function () {

			timeRemaining -= 1;
			$("#timer").text("Time remaining: " + timeRemaining);
			if (timeRemaining <= 0) {
				clearInterval(quizInterval);
				gameOver("TIME EXPIRED.");
			}

		}, 1000);

		$(".submitBtn").click(phaseOne);

	}

	function phaseOne() {

		//local variable for simplicity
		let item = testItem[currentItem];
		// Update question
		$(".question").text(item.question);

		// remove css and listener from submitbutton
		$(".submitBtn").removeClass("correct incorrect on");
		$(".submitBtn").off();
		$(".submitBtn").text("SELECT YOUR ANSWER");

		// change CSS for answerbuttons
		$(".answerBtn").removeClass("off correct incorrect");
		$(".answerBtn").addClass("active");
		

		// Set text of answerbuttons
		$(".answerBtn").attr("value", "false");
		$(".answerBtn")[jRandom(4)].setAttribute("value", "true")

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
		
		// Add click listener to answer buttons
		$(".answerBtn").click(phaseTwo);
			
	}

	function phaseTwo() {

		
		$(".answerBtn").removeClass("active");
		$(".answerBtn").off();

		// add CSS
		$(".answerBtn").each(function () {

			if (this.value === "true") {
				$(this).addClass("correct");
			}
			else {
				$(this).addClass("incorrect");
			}

		});

		//  adjust time and scores and display according to correct/incorrect response
		//  Special triggers if last question (consider different seperate function)
		if (this.value === "true") {

			$(".submitBtn").text("CORRECT!  CLICK FOR NEXT QUESTION");
			totalCorrect += 1;
			$(".submitBtn").addClass("correct on");

		}
		
		else {

			$(".submitBtn").text("INCORRECT.  CLICK FOR NEXT QUESTION");
			totalIncorrect += 1;
			timeRemaining -= 5;
			$(".submitBtn").addClass("incorrect on");
			$("#timer").text("Time remaining: " + timeRemaining);
		}
		
		$(".submitBtn").click(stateCheck);

	}

	function stateCheck() {

		if(testItem.length !== 1) {
			testItem.splice(currentItem, 1);
			currentItem = jRandom(testItem.length);
			phaseOne();
		}
		else{
			finalScore = Math.round((totalCorrect / (totalCorrect+totalIncorrect))*100);
			$(".btn").removeClass("active correct incorrect")
			$(".question").text("Examination Complete!");
			$(".submitBtn").text("FINAL SCORE : " + finalScore + "%");
			$(".one").text("Total Correct").addClass("correct");
			$(".two").text("Total Incorrect").addClass("incorrect");
			$(".three").text(totalCorrect).addClass("correct");
			$(".four").text(totalIncorrect).addClass("incorrect");

		}
		

	}


	function lastQuestion() {
		console.log("inside lastQuestion.  testItem.length == 0 is " + (testItem.length == 1));
		console.log("inside lastQuestion.  testItem.length is " + testItem.length);
		return (testItem.length == 1);
	}

	function gameOver(message) {

		$(".question").text(message + " GAME OVER.");
		$(".btn").addClass("off").removeClass("active on incorrectOn correct incorrect").off();

	}





	initialize();





});
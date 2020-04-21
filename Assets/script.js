testItem = [

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
		name: "God Question",
		question: "Does God love you?",
		correctAnswer: "Yes, by punishing me.",
		incorrectAnswers: ["Yes, by caring for me.", "No, he hates me", "God doesn't exist"]
	},

	{
		name: "jQuery question",
		question: "The shorthand version of JavaScript is called ____________.",
		correctAnswer: "jQuery",
		incorrectAnswers: ["HTML", "Boolean", "jScript"]
	},

	{
		name: "Semantics question",
		question: "An example of a symantic HTML tag would be:",
		correctAnswer: "<h1>",
		incorrectAnswers: ["<html>", "<head>", "<br>"]

	},

	{
		name: "CSS Syntax Question",
		question: "In CSS, which of the following is an ID selector?",
		correctAnswer: "#",
		incorrectAnswers: [".", "@", "$"]
	},

	{
		name: "Responsive Design Question",
		question: "In web development, 'responsive web design' means:",
		correctAnswer: "Website appearance dynamically changes",
		incorrectAnswers: ["Website responses designed for specific users", "Website changes depending on time of day", "Website can read your mind"]
	},

	{
		name: "API question",
		question: "Which code adds an element to the <body>?",
		correctAnswer: "$(\"body\").append(\"<div>Hello</div>\");",
		incorrectAnswers: ["let x = document.body.createElement(<div>);", "console.log(\"Add element to body\")", "document.append(thisElement);"]
	},

	{
		name: "Identify event listeners",
		question: "Which of the following are not ways to add an event listener",
		correctAnswer: ".append()",
		incorrectAnswers: [".addEventListener()", ".on()", ".click()"]
	},

	{
		name: "Variable types",
		question: "This variable type is either true or false:",
		correctAnswer: "Boolean",
		incorrectAnswers: ["String", "Constant", "Integer"]
	},

	{
		name: "For loop question",
		question: "Which do not belong inside for-loop parenthesis?",
		correctAnswer: "event listener",
		incorrectAnswers: ["iterator", "condition", "initializer"]
	}

];

let timeRemaining = 60;
let totalCorrect = 0;
let totalIncorrect = 0;
let currentItem = 0;
let quizInterval = null;

$(document).ready(function(){

	function jRandom(x) {
		return Math.floor(Math.random() * x);
	}

	//Function initialize sets up the initial content of HTML elements and event listeners
	function initialize() {

		timeRemaining = 60;
		$(".question").text("Depth of Knowledge Exam. This exam is exactly " + testItem.length + " questions.");

		//  Click handler for submit button at initialization.
		$(".submitBtn").click(function() {

			presentNextQuestion(testItem[currentItem]);

			$(".submitBtn").text("Select an answer");
			$("#timer").text("Time remaining: " + timeRemaining)

			quizInterval = setInterval(function () {
				
				timeRemaining -= 1;
				$("#timer").text("Time remaining: " + timeRemaining);
				if(timeRemaining <= 0) {
					clearInterval(quizInterval);
					//gameover();
				}
				
			}, 1000)

		});
	}

	function presentNextQuestion(item) {

		$(".submitBtn").off();
		$(".question").text(item.question);

		//set all answerBtns value to false
		//then sets one  answerBtn value to true at random
		$(".answerBtn").attr("value", "false");
		$(".answerBtn")[jRandom(4)].setAttribute("value", "true");

		
		

		// for each answerBtn set text to correct answer or incorrect answer by value
		$(".answerBtn").each(function() {

			let wrongAnswers = item.incorrectAnswers;
	
			if(this.value === "true") {
				$(this).text(item.correctAnswer); //.textContent = item.correctAnswer;
			}
			else {
				let x = jRandom(wrongAnswers.length);
				$(this).text(wrongAnswers[x]);
				wrongAnswers.splice(x,1);
			}

		});

		$(".answerBtn").click(clickHandler);
		//  Clickhandler for answer buttons.
		function clickHandler(event) {

			if(this.value === "true") {
				$(".submitBtn").text("Correct! Click for Next Question");
				totalCorrect += 1;
				$("#totalCor").text(totalCorrect);
			}
			else {
				$(".submitBtn").text("Incorrect! Click for Next Question");
				totalIncorrect += 1;
				timeRemaining -= 5;
				$("#timer").text("Time remaining: " + timeRemaining)
				$("#totalInc").text(totalIncorrect);
			}

			$(".answerBtn").off();

			$(".submitBtn").click(function() {
				 currentItem += 1;
				 presentNextQuestion(testItem[currentItem]);
				 $(".submitBtn").text("Select an answer");
		
			});
		};
	
	}

	

	
		
	

	initialize();

	
	


});
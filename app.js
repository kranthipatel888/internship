let timer;
let timeLeft = 15;
let score = 0;
let currentQuestionIndex = 0;
let questions = [];
let selectedTopic = null;

// Function to shuffle array
function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

// Function to get random questions
function getRandomQuestions(allQuestions, numQuestions = 10) {
    const shuffledQuestions = shuffleArray([...allQuestions]);
    if (shuffledQuestions.length < numQuestions) {
        alert(`Not enough questions available for this topic. Only ${shuffledQuestions.length} questions available.`);
        return shuffledQuestions;
    }
    return shuffledQuestions.slice(0, numQuestions);
}

function setTopic(topic) {
    selectedTopic = topic;
    // Update button styles
    document.querySelectorAll('.topic-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    event.target.closest('.topic-btn').classList.add('active');
    
    // Start quiz directly without validation
    startQuizWithTopic();
}

// Function to get questions for selected topic
function getTopicQuestions(allQuestions, topic) {
    return allQuestions.filter(q => q.topic === topic);
}

// Function to get all questions from all topics
function getAllQuestions(allQuestions) {
    let allTopicQuestions = [];
    allQuestions.forEach(topicObj => {
        if (topicObj.questions) {
            allTopicQuestions = [...allTopicQuestions, ...topicObj.questions];
        }
    });
    return allTopicQuestions;
}

async function startQuizWithTopic() {
    try {
        const response = await fetch('questions.json');
        const allQuestions = await response.json();
        
        if (selectedTopic) {
            // Find the topic object
            const topicObj = allQuestions.find(t => t.topic === selectedTopic);
            if (topicObj && topicObj.questions && topicObj.questions.length >= 10) {
                questions = getRandomQuestions(topicObj.questions, 10);
            } else {
                alert(`Not enough questions available for ${selectedTopic}. Need at least 10 questions.`);
                return;
            }
        } else {
            // Get mixed questions from all topics
            const allTopicQuestions = getAllQuestions(allQuestions);
            if (allTopicQuestions.length >= 10) {
                questions = getRandomQuestions(allTopicQuestions, 10);
            } else {
                alert('Not enough questions available. Please try again later.');
                return;
            }
        }
        
        // Reset quiz state
        score = 0;
        currentQuestionIndex = 0;
        timeLeft = 15;

        // Store username if provided
        const username = document.getElementById("username").value;
        if (username) {
            localStorage.setItem('username', username);
        }

        document.getElementById("access-container").style.display = "none";
        document.getElementById("topic-selection").style.display = "none";
        document.getElementById("quiz-section").style.display = "block";
        loadQuestion();
        startTimer();
    } catch (error) {
        console.error('Error loading questions:', error);
        alert('Error loading questions. Please try again.');
    }
}

async function startQuiz() {
    const username = document.getElementById("username").value;
    const quizCode = document.getElementById("quiz-code").value;

    if (!username) {
        alert("Please enter your username");
        return;
    }
    if (quizCode !== "12345") {
        alert("Invalid quiz code");
        return;
    }

    startQuizWithTopic();
}

function loadQuestion() {
    if (currentQuestionIndex >= questions.length) {
        localStorage.setItem('mostRecentScore', score);
        return window.location.assign('end.html');
    }

    // Update progress
    const progress = (currentQuestionIndex / questions.length) * 100;
    document.getElementById("progress-fill").style.width = `${progress}%`;
    document.getElementById("progress-text").textContent = `Question ${currentQuestionIndex + 1} of ${questions.length}`;

    const questionData = questions[currentQuestionIndex];
    document.getElementById("question").textContent = questionData.question;
    const choicesContainer = document.getElementById("choices");
    choicesContainer.innerHTML = "";

    questionData.choices.forEach(choice => {
        const button = document.createElement("button");
        button.textContent = choice;
        button.onclick = () => checkAnswer(choice);
        choicesContainer.appendChild(button);
    });
}

function startTimer() {
    timeLeft = 15;
    document.getElementById("timer").textContent = timeLeft;
    timer = setInterval(() => {
        timeLeft--;
        document.getElementById("timer").textContent = timeLeft;
        if (timeLeft <= 0) {
            clearInterval(timer);
            nextQuestion();
        }
    }, 1000);
}

function checkAnswer(choice) {
    const questionData = questions[currentQuestionIndex];
    if (choice === questionData.answer) {
        score++;
        document.getElementById("score").textContent = score;
    }
    nextQuestion();
}

function nextQuestion() {
    clearInterval(timer);
    currentQuestionIndex++;
    loadQuestion();
    startTimer();
}

function endQuiz() {
    clearInterval(timer);
    localStorage.setItem('mostRecentScore', score);
    return window.location.assign('end.html');
}

const username = document.getElementById('username');
const saveScoreBtn = document.getElementById('saveScoreBtn');

const aScore = document.getElementById('Score');
const finalScore = document.getElementById('finalScore');
const mostRecentScore = localStorage.getItem('mostRecentScore');

const highScores = JSON.parse(localStorage.getItem('highScores')) || [];

const MAX_HIGH_SCORES = 15;
aScore.innerText= "score";
finalScore.innerText = mostRecentScore;

username.addEventListener('keyup', () => {
    saveScoreBtn.disabled = !username.value;
});

saveHighScore = (e) => {
    e.preventDefault();

    const score = {
        score: mostRecentScore,
        name: username.value,
    };
    highScores.push(score);
    highScores.sort((a, b) => b.score - a.score);
    highScores.splice(5);

    localStorage.setItem('highScores', JSON.stringify(highScores));
    window.location.assign('/');
};

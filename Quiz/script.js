// Language data sources
const isoLangs = {
    en: "English",
    hi: "Hindi",
    ta: "Tamil",
    bn: "Bengali"
};

// Quiz variables
let questionCount = 0;
let questionNumb = 1;
let userScore = 0;

// DOM Elements
const startBtn = document.querySelector('.start-btn');
const popupInfo = document.querySelector('.popup-info');
const exitBtn = document.querySelector('.exit-btn');
const main = document.querySelector('.main');
const continueBtn = document.querySelector('.continue-btn');
const quizSection = document.querySelector('.quiz-section');
const quizBox = document.querySelector('.quiz-box');
const resultBox = document.querySelector('.result-box');
const tryAgainBtn = document.querySelector('.tryAgain-btn');
const goHomeBtn = document.querySelector('.goHome-btn');
const nextBtn = document.querySelector('.next-btn');
const optionList = document.querySelector('.option-list');

// Default language
let currentLanguage = "en";

// Function to switch quiz language
function translateContent(targetLang) {
    currentLanguage = targetLang;

    // Update homepage text dynamically
    document.querySelectorAll("[data-translate]").forEach(element => {
        const key = element.getAttribute("data-translate");
        if (translations[targetLang] && translations[targetLang][key]) {
            element.textContent = translations[targetLang][key];
        }
    });

    // Update quiz questions
    showQuestions(0);
}

// Function to show questions in the selected language
function showQuestions(index) {
    const questionText = document.querySelector('.question-text');
    const optionsList = document.querySelector('.option-list');

    let selectedQuestions = questions[currentLanguage];

    questionText.textContent = `${selectedQuestions[index].numb}. ${selectedQuestions[index].question}`;

    let optionTag = selectedQuestions[index].options
        .map(option => `<div class="option"><span>${option}</span></div>`)
        .join('');

    optionsList.innerHTML = optionTag;

    document.querySelectorAll('.option').forEach(option => {
        option.setAttribute('onclick', 'optionSelected(this)');
    });
}

// Function to handle answer selection
function optionSelected(answer) {
    let userAnswer = answer.textContent;
    let correctAnswer = questions[currentLanguage][questionCount].answer;

    if (userAnswer === correctAnswer) {
        answer.classList.add('correct');
        userScore++;
        headerScore();
    } else {
        answer.classList.add('incorrect');
        document.querySelectorAll('.option').forEach(option => {
            if (option.textContent === correctAnswer) {
                option.classList.add('correct');
            }
        });
    }

    document.querySelectorAll('.option').forEach(option => option.classList.add('disabled'));
    nextBtn.classList.add('active');
}

// Function to update question counter
function questionCounter(index) {
    document.querySelector('.question-total').textContent = `${index} of ${questions[currentLanguage].length} Questions`;
}

// Function to update the score
function headerScore() {
    document.querySelector('.header-score').textContent = `Score: ${userScore} / ${questions[currentLanguage].length}`;
}

// Function to show result box
function showResultBox() {
    quizBox.classList.remove('active');
    resultBox.classList.add('active');

    const scoreText = document.querySelector('.score-text');

    // Fetch the translated string and replace placeholders with actual values
    let translatedScoreText = translations[currentLanguage]?.yourScore || translations["en"].yourScore;
    translatedScoreText = translatedScoreText.replace("0", userScore).replace("5", questions[currentLanguage].length);

    scoreText.textContent = translatedScoreText;

    const circularProgress = document.querySelector('.circular-progress');
    const progressValue = document.querySelector('.progress-value');

    let progressStartValue = 0;
    let progressEndValue = Math.round((userScore / questions[currentLanguage].length) * 100);
    let speed = 20;

    let progress = setInterval(() => {
        if (progressStartValue >= progressEndValue) {
            clearInterval(progress);
            return;
        }
        progressStartValue++;
        progressValue.textContent = `${progressStartValue}%`;
        circularProgress.style.background = `conic-gradient(white ${progressStartValue * 3.6}deg, rgba(255, 255, 255, .1) 0deg)`;
    }, speed);
}



// Initialize application
function initializeApp() {
    const languageSelect = document.getElementById('languageSelect');
    
    // Add language selection event listener
    languageSelect.addEventListener('change', (e) => {
        translateContent(e.target.value);
    });

    // Initialize existing quiz functionality
    startBtn.onclick = () => {
        popupInfo.classList.add('active');
        main.classList.add('active');
    };

    exitBtn.onclick = () => {
        popupInfo.classList.remove('active');
        main.classList.remove('active');
    };

    continueBtn.onclick = () => {
        quizSection.classList.add('active');
        popupInfo.classList.remove('active');
        main.classList.remove('active');
        quizBox.classList.add('active');

        showQuestions(0);
        questionCounter(1);
        headerScore();
    };

    tryAgainBtn.onclick = () => {
        quizBox.classList.add('active');
        resultBox.classList.remove('active');
        nextBtn.classList.remove('active');

        questionCount = 0;
        questionNumb = 1;
        userScore = 0;
        showQuestions(questionCount);
        questionCounter(questionNumb);
        headerScore();
    };

    goHomeBtn.onclick = () => {
        quizSection.classList.remove('active');
        resultBox.classList.remove('active');
        nextBtn.classList.remove('active');

        questionCount = 0;
        questionNumb = 1;
        userScore = 0;
        showQuestions(questionCount);
        questionCounter(questionNumb);
    };

    nextBtn.onclick = () => {
        if (questionCount < questions[currentLanguage].length - 1) {
            questionCount++;
            showQuestions(questionCount);
            questionNumb++;
            questionCounter(questionNumb);
            nextBtn.classList.remove('active');
        } else {
            showResultBox();
        }
    };

    

}


// Start app initialization
initializeApp();
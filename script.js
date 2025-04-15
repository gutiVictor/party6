// Game state
let gameState = {
    teams: [],
    scores: {},
    currentQuestion: null,
    timer: null,
    questionsAnswered: 0,
    totalQuestions: 0,
    selectedQuestions: {}
};

// Import category modules
import { bibliaQuestions } from './categories/biblia.js';
import { libroDemormonQuestions } from './categories/librodemormon.js';
import { perlaQuestions } from './categories/perla.js';
import { dcQuestions } from './categories/dc.js';

// Game data with imported categories
const gameData = {
    categories: [
        bibliaQuestions,
        libroDemormonQuestions,
        perlaQuestions,
        dcQuestions
    ]
};

// Initialize game
function initGame() {
    // Reset game state
    gameState.teams = [];
    gameState.scores = {};
    gameState.currentQuestion = null;
    gameState.timer = null;
    gameState.questionsAnswered = 0;
    gameState.totalQuestions = 0;
    gameState.selectedQuestions = {};

    const container = document.querySelector('.game-container');
    container.innerHTML = `
        <div class="start-screen fade-in">
            <h1 class="logo">¡Party Sud!</h1>
            <button class="start-button">Comenzar Juego</button>
        </div>
    `;

    document.querySelector('.start-button').addEventListener('click', showConfig);
}

// Show game configuration
function showConfig() {
    const container = document.querySelector('.game-container');
    container.innerHTML = `
        <div class="config-screen fade-in">
            <h2>Configuración del Juego</h2>
            <div class="player-select">
                <h3>Número de Equipos</h3>
                <button class="config-button" data-teams="1">1 Equipo</button>
                <button class="config-button" data-teams="2">2 Equipos</button>
                <button class="config-button" data-teams="3">3 Equipos</button>
                <button class="config-button" data-teams="4">4 Equipos</button>
                <button class="config-button" data-teams="5">5 Equipos</button>
                <button class="config-button" data-teams="6">6 Equipos</button>
            </div>
            <button class="start-button">Comenzar</button>
        </div>
    `;

    // Event listeners for team selection
    document.querySelectorAll('.config-button').forEach(button => {
        button.addEventListener('click', (e) => {
            document.querySelectorAll('.config-button').forEach(b => b.classList.remove('selected'));
            e.target.classList.add('selected');
            gameState.teams = Array.from({length: parseInt(e.target.dataset.teams)}, (_, i) => `Equipo ${i + 1}`);
            gameState.teams.forEach(team => gameState.scores[team] = 0);
        });
    });

    document.querySelector('.start-button').addEventListener('click', () => {
        if (gameState.teams.length > 0) {
            selectRandomQuestions();
            createGameBoard();
        }
    });
}

// Select random questions for each category and value
function selectRandomQuestions() {
    gameState.selectedQuestions = {};
    const questionValues = [10, 20, 30, 40, 50, 60];
    const usedQuestions = new Set(); // Track used questions to prevent repetition

    gameData.categories.forEach((category, categoryIndex) => {
        gameState.selectedQuestions[categoryIndex] = {};
        
        questionValues.forEach(value => {
            const availableQuestions = category.questionBank.filter(q => 
                q.value === value && !usedQuestions.has(`${categoryIndex}-${q.question}`)
            );
            
            if (availableQuestions.length > 0) {
                const randomIndex = Math.floor(Math.random() * availableQuestions.length);
                const selectedQuestion = availableQuestions[randomIndex];
                gameState.selectedQuestions[categoryIndex][value] = selectedQuestion;
                usedQuestions.add(`${categoryIndex}-${selectedQuestion.question}`);
            } else {
                // If all questions are used, reset the pool for this value
                const allQuestionsForValue = category.questionBank.filter(q => q.value === value);
                const randomIndex = Math.floor(Math.random() * allQuestionsForValue.length);
                gameState.selectedQuestions[categoryIndex][value] = allQuestionsForValue[randomIndex];
            }
        });
    });
}

// Create game board
function createGameBoard() {
    const container = document.querySelector('.game-container');
    gameState.totalQuestions = gameData.categories.length * 6; // 6 questions per category

    let boardHTML = `
        <div class="score-display">
            ${gameState.teams.map(team => `
                <div class="team-score">${team}: ${gameState.scores[team]}</div>
            `).join('')}
        </div>
        <div class="total-questions">Preguntas respondidas: ${gameState.questionsAnswered}/${gameState.totalQuestions}</div>
        <div class="game-board">
    `;

    // Add categories
    gameData.categories.forEach(category => {
        boardHTML += `<div class="category">${category.name}</div>`;
    });

    // Add questions in ascending order by value
    const questionValues = [10, 20, 30, 40, 50, 60];
    questionValues.forEach(value => {
        gameData.categories.forEach((_, categoryIndex) => {
            boardHTML += `
                <div class="question-card" data-category="${categoryIndex}" data-value="${value}">
                    $${value}
                </div>
            `;
        });
    });

    boardHTML += '</div>';
    container.innerHTML = boardHTML;

    // Add event listeners to question cards
    document.querySelectorAll('.question-card').forEach(card => {
        card.addEventListener('click', () => {
            const categoryIndex = parseInt(card.dataset.category);
            const value = parseInt(card.dataset.value);
            showQuestion(categoryIndex, value);
            card.style.visibility = 'hidden';
        });
    });
}

// Show question
function showQuestion(categoryIndex, value) {
    const question = gameState.selectedQuestions[categoryIndex][value];
    gameState.currentQuestion = question;

    const modal = document.createElement('div');
    modal.className = 'question-modal fade-in';
    modal.innerHTML = `
        <div class="question-content">
            <div class="question-header">
                <div class="question-value">Valor: $${question.value}</div>
                <div class="current-score">Puntaje Actual: $${gameState.scores[gameState.teams[gameState.questionsAnswered % gameState.teams.length]]}</div>
            </div>
            <div class="question-text">
                <h3>${question.question}</h3>
            </div>
            <form class="answer-form">
                ${question.answers.map((answer, index) => `
                    <div class="answer-option">
                        <input type="radio" name="answer" value="${index}" id="answer${index}">
                        <label for="answer${index}">${answer}</label>
                    </div>
                `).join('')}
                <button type="submit" class="submit-answer">Enviar Respuesta</button>
            </form>
        </div>
    `;

    document.body.appendChild(modal);

    modal.querySelector('form').addEventListener('submit', (e) => {
        e.preventDefault();
        const selectedAnswer = parseInt(modal.querySelector('input[name="answer"]:checked')?.value);
        if (selectedAnswer !== undefined) {
            checkAnswer(selectedAnswer);
            modal.remove();
            gameState.questionsAnswered++;
            updateScoreDisplay();
        }
    });
}

// Check answer and update score
function checkAnswer(selectedAnswer) {
    const currentTeam = gameState.teams[gameState.questionsAnswered % gameState.teams.length];
    if (selectedAnswer === gameState.currentQuestion.correct) {
        gameState.scores[currentTeam] += gameState.currentQuestion.value;
    }
    if (gameState.questionsAnswered === gameState.totalQuestions) {
        showGameOver();
    }
}

// Update score display
function updateScoreDisplay() {
    const scoreDisplay = document.querySelector('.score-display');
    scoreDisplay.innerHTML = gameState.teams.map(team => `
        <div class="team-score">${team}: ${gameState.scores[team]}</div>
    `).join('');

    const totalQuestions = document.querySelector('.total-questions');
    totalQuestions.textContent = `Preguntas respondidas: ${gameState.questionsAnswered}/${gameState.totalQuestions}`;
}

// Show game over screen
function showGameOver() {
    const winner = gameState.teams.reduce((a, b) => gameState.scores[a] > gameState.scores[b] ? a : b);
    const container = document.querySelector('.game-container');
    container.innerHTML = `
        <div class="game-over fade-in">
            <h1>¡Juego Terminado!</h1>
            <h2>¡${winner} Gana!</h2>
            <div class="final-scores">
                ${gameState.teams.map(team => `
                    <div class="team-score">${team}: ${gameState.scores[team]}</div>
                `).join('')}
            </div>
            <button class="start-button" onclick="initGame()">Jugar de Nuevo</button>
        </div>
    `;
}

// Start the game
document.addEventListener('DOMContentLoaded', initGame);
// ===============================================
// GAME STATE
// ===============================================
let gameState = {
    teams: [],
    scores: {},
    statistics: {}, // Track performance stats per team
    currentQuestion: null,
    timer: null,
    timerValue: 30,
    questionsAnswered: 0,
    totalQuestions: 0,
    selectedQuestions: {},
    answeredQuestions: new Set(), // Track answered questions
    currentTeamIndex: 0,
    questionStartTime: null // For response time tracking
};

// Import category modules
import { historiaQuestions } from './categories/historia.js';
import { cienciaNaturalezaQuestions } from './categories/ciencia-y-naturaleza.js';
import { arteCulturaQuestions } from './categories/arte-y-cultura.js';
import { geografiaQuestions } from './categories/geografia.js';

// Game data with imported categories
const gameData = {
    categories: [
        historiaQuestions,
        cienciaNaturalezaQuestions,
        arteCulturaQuestions,
        geografiaQuestions
    ]
};

// ===============================================
// INITIALIZE GAME
// ===============================================
function initGame() {
    // Reset game state
    gameState.teams = [];
    gameState.scores = {};
    gameState.statistics = {};
    gameState.currentQuestion = null;
    gameState.timer = null;
    gameState.timerValue = 30;
    gameState.questionsAnswered = 0;
    gameState.totalQuestions = 0;
    gameState.selectedQuestions = {};
    gameState.answeredQuestions = new Set();
    gameState.currentTeamIndex = 0;

    const container = document.querySelector('.game-container');
    container.innerHTML = `
        <div class="start-screen fade-in">
            <h1 class="logo">¡Party para todos!</h1>
            <p style="font-size: 1.2rem; margin-bottom: 30px; opacity: 0.9;">
                🎮 Juego de Preguntas y Respuestas 🎮
            </p>
            <button class="start-button">Comenzar Juego</button>
        </div>
    `;

    document.querySelector('.start-button').addEventListener('click', showConfig);
}

// ===============================================
// CONFIGURATION SCREEN
// ===============================================
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
            <button class="start-button" style="margin-top: 20px;">Comenzar</button>
        </div>
    `;

    // Event listeners for team selection
    document.querySelectorAll('.config-button').forEach(button => {
        button.addEventListener('click', (e) => {
            document.querySelectorAll('.config-button').forEach(b => b.classList.remove('selected'));
            e.target.classList.add('selected');
            
            const numTeams = parseInt(e.target.dataset.teams);
            gameState.teams = Array.from({length: numTeams}, (_, i) => `Equipo ${i + 1}`);
            
            // Initialize scores and statistics
            gameState.teams.forEach(team => {
                gameState.scores[team] = 0;
                gameState.statistics[team] = {
                    correct: 0,
                    wrong: 0,
                    totalTime: 0,
                    streak: 0,
                    bestStreak: 0
                };
            });
        });
    });

    document.querySelector('.start-button').addEventListener('click', () => {
        if (gameState.teams.length > 0) {
            selectRandomQuestions();
            createGameBoard();
        }
    });
}

// ===============================================
// QUESTION SELECTION
// ===============================================
function selectRandomQuestions() {
    gameState.selectedQuestions = {};
    const questionValues = [10, 20, 30, 40, 50, 60];
    const usedQuestions = new Set();

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
                const allQuestionsForValue = category.questionBank.filter(q => q.value === value);
                const randomIndex = Math.floor(Math.random() * allQuestionsForValue.length);
                gameState.selectedQuestions[categoryIndex][value] = allQuestionsForValue[randomIndex];
            }
        });
    });
}

// ===============================================
// CREATE GAME BOARD
// ===============================================
function createGameBoard() {
    const container = document.querySelector('.game-container');
    gameState.totalQuestions = gameData.categories.length * 6;

    const currentTeam = gameState.teams[gameState.currentTeamIndex];
    
    let boardHTML = `
        <div class="score-display">
            ${gameState.teams.map((team, index) => `
                <div class="team-score ${index === gameState.currentTeamIndex ? 'active-team' : ''}">
                    ${team}: $${gameState.scores[team]}
                </div>
            `).join('')}
        </div>
        <div class="current-turn-banner">
            <div class="turn-indicator">
                <span class="turn-label">🎯 TURNO ACTUAL:</span>
                <span class="turn-team">${currentTeam}</span>
            </div>
        </div>
        <div class="total-questions">
            Preguntas respondidas: ${gameState.questionsAnswered}/${gameState.totalQuestions}
        </div>
        <div class="category-dropdown">
            <select id="categorySelect">
                ${gameData.categories.map((category, index) => `
                    <option value="${index}">${category.name}</option>
                `).join('')}
            </select>
        </div>
        <div class="game-board">
    `;

    // Add categories
    gameData.categories.forEach(category => {
        boardHTML += `<div class="category">${category.name}</div>`;
    });

    // Add questions
    const questionValues = [10, 20, 30, 40, 50, 60];
    questionValues.forEach(value => {
        gameData.categories.forEach((_, categoryIndex) => {
            const questionId = `${categoryIndex}-${value}`;
            const isAnswered = gameState.answeredQuestions.has(questionId);
            
            boardHTML += `
                <div class="question-card ${isAnswered ? 'answered' : ''}" 
                     data-category="${categoryIndex}" 
                     data-value="${value}"
                     ${isAnswered ? 'style="visibility: hidden; opacity: 0.3;"' : ''}>
                    $${value}
                </div>
            `;
        });
    });

    boardHTML += '</div>';
    container.innerHTML = boardHTML;

    // Add event listeners to question cards
    document.querySelectorAll('.question-card:not(.answered)').forEach(card => {
        card.addEventListener('click', () => {
            const categoryIndex = parseInt(card.dataset.category);
            const value = parseInt(card.dataset.value);
            showQuestion(categoryIndex, value);
        });
    });

    // Category dropdown for mobile
    const categorySelect = document.getElementById('categorySelect');
    if (categorySelect) {
        categorySelect.addEventListener('change', () => {
            const selectedCategory = parseInt(categorySelect.value);
            document.querySelectorAll('.question-card').forEach(card => {
                const cardCategory = parseInt(card.dataset.category);
                card.style.display = (cardCategory === selectedCategory || window.innerWidth > 768) ? 'block' : 'none';
            });
        });
        categorySelect.dispatchEvent(new Event('change'));
    }
}

// ===============================================
// SHOW QUESTION WITH TIMER
// ===============================================
function showQuestion(categoryIndex, value) {
    const question = gameState.selectedQuestions[categoryIndex][value];
    gameState.currentQuestion = question;
    gameState.questionStartTime = Date.now();
    
    const currentTeam = gameState.teams[gameState.currentTeamIndex];

    const modal = document.createElement('div');
    modal.className = 'question-modal fade-in';
    modal.innerHTML = `
        <div class="question-content">
            <div class="question-header">
                <div class="question-value">Valor: $${question.value}</div>
                <div class="current-team">Equipo Actual: ${currentTeam}</div>
                <div class="current-score">Puntaje: $${gameState.scores[currentTeam]}</div>
            </div>
            
            <div class="timer-container">
                <div class="timer-display">⏱️ <span id="timer-seconds">30</span>s</div>
                <div class="timer-bar-container">
                    <div class="timer-bar" id="timer-bar"></div>
                </div>
            </div>
            
            <div class="question-text">
                <h3>${question.question}</h3>
            </div>
            
            <form class="answer-form" id="answer-form">
                ${question.answers.map((answer, index) => `
                    <div class="answer-option" data-answer="${index}">
                        <input type="radio" name="answer" value="${index}" id="answer${index}">
                        <label for="answer${index}">${answer}</label>
                    </div>
                `).join('')}
                <button type="submit" class="submit-answer">Enviar Respuesta</button>
            </form>
        </div>
    `;

    document.body.appendChild(modal);

    // Start timer
    startQuestionTimer(modal, categoryIndex, value);

    // Form submission
    modal.querySelector('form').addEventListener('submit', (e) => {
        e.preventDefault();
        const selectedAnswerInput = modal.querySelector('input[name="answer"]:checked');
        
        if (selectedAnswerInput) {
            const selectedAnswer = parseInt(selectedAnswerInput.value);
            clearInterval(gameState.timer);
            handleAnswer(selectedAnswer, modal, categoryIndex, value);
        }
    });
}

// ===============================================
// TIMER FUNCTIONALITY
// ===============================================
function startQuestionTimer(modal, categoryIndex, value) {
    let timeLeft = 30;
    const timerDisplay = modal.querySelector('#timer-seconds');
    const timerBar = modal.querySelector('#timer-bar');
    
    timerBar.style.width = '100%';
    
    gameState.timer = setInterval(() => {
        timeLeft--;
        timerDisplay.textContent = timeLeft;
        timerBar.style.width = `${(timeLeft / 30) * 100}%`;
        
        // Change color when time is running out
        if (timeLeft <= 10) {
            timerBar.style.background = 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)';
            timerDisplay.style.color = '#ef4444';
        }
        
        if (timeLeft === 0) {
            clearInterval(gameState.timer);
            autoSubmitAnswer(modal, categoryIndex, value);
        }
    }, 1000);
}

// ===============================================
// AUTO-SUBMIT ON TIMEOUT
// ===============================================
function autoSubmitAnswer(modal, categoryIndex, value) {
    const selectedAnswerInput = modal.querySelector('input[name="answer"]:checked');
    const selectedAnswer = selectedAnswerInput ? parseInt(selectedAnswerInput.value) : -1;
    
    handleAnswer(selectedAnswer, modal, categoryIndex, value, true);
}

// ===============================================
// HANDLE ANSWER & FEEDBACK
// ===============================================
function handleAnswer(selectedAnswer, modal, categoryIndex, value, isTimeout = false) {
    const currentTeam = gameState.teams[gameState.currentTeamIndex];
    const correctAnswer = gameState.currentQuestion.correct;
    const isCorrect = selectedAnswer === correctAnswer;
    
    // Calculate response time
    const responseTime = (Date.now() - gameState.questionStartTime) / 1000;
    
    // Update statistics
    updateStatistics(currentTeam, isCorrect, responseTime);
    
    // Show visual feedback
    showAnswerFeedback(modal, selectedAnswer, correctAnswer, isCorrect, isTimeout);
    
    // Update score
    if (isCorrect) {
        gameState.scores[currentTeam] += gameState.currentQuestion.value;
    }
    
    // Mark question as answered
    const questionId = `${categoryIndex}-${value}`;
    gameState.answeredQuestions.add(questionId);
    gameState.questionsAnswered++;
    
    // Move to next team
    gameState.currentTeamIndex = (gameState.currentTeamIndex + 1) % gameState.teams.length;
    
    // Close modal and update board after delay
    setTimeout(() => {
        modal.remove();
        
        if (gameState.questionsAnswered >= gameState.totalQuestions) {
            showGameOver();
        } else {
            createGameBoard(); // Recreate board to update turn indicator
        }
    }, 2500);
}

// ===============================================
// VISUAL FEEDBACK FOR ANSWERS
// ===============================================
function showAnswerFeedback(modal, selectedAnswer, correctAnswer, isCorrect, isTimeout) {
    const options = modal.querySelectorAll('.answer-option');
    const submitButton = modal.querySelector('.submit-answer');
    
    // Disable all inputs
    modal.querySelectorAll('input').forEach(input => input.disabled = true);
    submitButton.disabled = true;
    
    if (isTimeout) {
        // Show timeout message
        const timerDisplay = modal.querySelector('.timer-display');
        timerDisplay.innerHTML = '⏰ ¡Tiempo agotado!';
        timerDisplay.style.color = '#ef4444';
    }
    
    // Highlight correct answer
    options[correctAnswer].classList.add('correct-answer');
    
    if (!isCorrect && selectedAnswer >= 0) {
        // Highlight wrong answer if one was selected
        options[selectedAnswer].classList.add('wrong-answer');
    }
    
    // Show confetti for correct answers
    if (isCorrect) {
        createConfetti();
        const timerDisplay = modal.querySelector('.timer-display');
        timerDisplay.innerHTML = '✅ ¡Correcto!';
        timerDisplay.style.color = '#10b981';
    } else {
        const timerDisplay = modal.querySelector('.timer-display');
        timerDisplay.innerHTML = '❌ Incorrecto';
        timerDisplay.style.color = '#ef4444';
    }
}

// ===============================================
// CONFETTI EFFECT
// ===============================================
function createConfetti() {
    const colors = ['#00f7ff', '#667eea', '#10b981', '#f59e0b', '#ef4444'];
    const confettiCount = 50;
    
    for (let i = 0; i < confettiCount; i++) {
        setTimeout(() => {
            const confetti = document.createElement('div');
            confetti.className = 'confetti';
            confetti.style.left = Math.random() * 100 + 'vw';
            confetti.style.background = colors[Math.floor(Math.random() * colors.length)];
            confetti.style.animationDelay = Math.random() * 0.3 + 's';
            confetti.style.animationDuration = (Math.random() * 2 + 2) + 's';
            
            document.body.appendChild(confetti);
            
            setTimeout(() => confetti.remove(), 3000);
        }, i * 30);
    }
}

// ===============================================
// UPDATE STATISTICS
// ===============================================
function updateStatistics(team, isCorrect, responseTime) {
    const stats = gameState.statistics[team];
    
    if (isCorrect) {
        stats.correct++;
        stats.streak++;
        if (stats.streak > stats.bestStreak) {
            stats.bestStreak = stats.streak;
        }
    } else {
        stats.wrong++;
        stats.streak = 0;
    }
    
    stats.totalTime += responseTime;
}

// ===============================================
// GAME OVER SCREEN WITH STATISTICS
// ===============================================
function showGameOver() {
    const winner = gameState.teams.reduce((a, b) => 
        gameState.scores[a] > gameState.scores[b] ? a : b
    );
    
    const container = document.querySelector('.game-container');
    
    let statsHTML = gameState.teams.map(team => {
        const stats = gameState.statistics[team];
        const totalAnswered = stats.correct + stats.wrong;
        const accuracy = totalAnswered > 0 ? ((stats.correct / totalAnswered) * 100).toFixed(1) : 0;
        const avgTime = totalAnswered > 0 ? (stats.totalTime / totalAnswered).toFixed(1) : 0;
        
        return `
            <div class="statistics-panel fade-in">
                <h3>📊 ${team}</h3>
                <div class="stat-item">
                    <span class="stat-label">Puntaje Final:</span>
                    <span class="stat-value">$${gameState.scores[team]}</span>
                </div>
                <div class="stat-item">
                    <span class="stat-label">Respuestas Correctas:</span>
                    <span class="stat-value">${stats.correct} ✅</span>
                </div>
                <div class="stat-item">
                    <span class="stat-label">Respuestas Incorrectas:</span>
                    <span class="stat-value">${stats.wrong} ❌</span>
                </div>
                <div class="stat-item">
                    <span class="stat-label">Precisión:</span>
                    <span class="stat-value">${accuracy}%</span>
                </div>
                <div class="stat-item">
                    <span class="stat-label">Mejor Racha:</span>
                    <span class="stat-value">${stats.bestStreak} 🔥</span>
                </div>
                <div class="stat-item">
                    <span class="stat-label">Tiempo Promedio:</span>
                    <span class="stat-value">${avgTime}s ⏱️</span>
                </div>
            </div>
        `;
    }).join('');
    
    container.innerHTML = `
        <div class="game-over fade-in">
            <h1>🎉 ¡Juego Terminado! 🎉</h1>
            <h2>🏆 ¡${winner} Gana! 🏆</h2>
            
            <div style="margin: 30px 0;">
                ${statsHTML}
            </div>
            
            <button class="start-button" onclick="location.reload()">Jugar de Nuevo</button>
        </div>
    `;
    
    // Show victory confetti
    createConfetti();
    setTimeout(() => createConfetti(), 300);
}

// ===============================================
// START THE GAME
// ===============================================
document.addEventListener('DOMContentLoaded', initGame);
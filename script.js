// Game state
let gameState = {
    teams: [],
    scores: {},
    currentQuestion: null,
    timer: null,
    questionsAnswered: 0,
    totalQuestions: 0
};

// Sample categories and questions
const gameData = {
    categories: [
        {
            name: 'Historia',
            questions: [
                { value: 100, question: '¿En qué año se descubrió América?', answers: ['1492', '1498', '1500', '1489'], correct: 0 },
                { value: 200, question: '¿Quién fue el primer presidente de México?', answers: ['Guadalupe Victoria', 'Benito Juárez', 'Miguel Hidalgo', 'Agustín de Iturbide'], correct: 0 },
                { value: 300, question: '¿En qué año comenzó la Revolución Mexicana?', answers: ['1910', '1920', '1900', '1915'], correct: 0 }
            ]
        },
        {
            name: 'Geografía',
            questions: [
                { value: 100, question: '¿Cuál es el río más largo del mundo?', answers: ['Amazonas', 'Nilo', 'Misisipi', 'Yangtsé'], correct: 0 },
                { value: 200, question: '¿Cuál es el país más grande del mundo?', answers: ['Rusia', 'China', 'Estados Unidos', 'Canadá'], correct: 0 },
                { value: 300, question: '¿Cuál es la capital de Australia?', answers: ['Canberra', 'Sídney', 'Melbourne', 'Brisbane'], correct: 0 }
            ]
        },
        {
            name: 'Ciencia',
            questions: [
                { value: 100, question: '¿Cuál es el elemento químico más abundante en el universo?', answers: ['Hidrógeno', 'Helio', 'Oxígeno', 'Carbono'], correct: 0 },
                { value: 200, question: '¿Cuál es la velocidad de la luz?', answers: ['299,792 km/s', '199,792 km/s', '399,792 km/s', '499,792 km/s'], correct: 0 },
                { value: 300, question: '¿Qué planeta es conocido como el planeta rojo?', answers: ['Marte', 'Venus', 'Júpiter', 'Mercurio'], correct: 0 }
            ]
        },
        {
            name: 'Arte',
            questions: [
                { value: 100, question: '¿Quién pintó la Mona Lisa?', answers: ['Leonardo da Vinci', 'Miguel Ángel', 'Rafael', 'Botticelli'], correct: 0 },
                { value: 200, question: '¿En qué país nació Pablo Picasso?', answers: ['España', 'Francia', 'Italia', 'Portugal'], correct: 0 },
                { value: 300, question: '¿Quién pintó "La noche estrellada"?', answers: ['Vincent van Gogh', 'Claude Monet', 'Salvador Dalí', 'Pablo Picasso'], correct: 0 }
            ]
        }
    ]
};

// Initialize game
function initGame() {
    const container = document.querySelector('.game-container');
    container.innerHTML = `
        <div class="start-screen fade-in">
            <h1 class="logo">¡Jeoparty!</h1>
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
                <button class="config-button" data-teams="2">2 Equipos</button>
                <button class="config-button" data-teams="3">3 Equipos</button>
                <button class="config-button" data-teams="4">4 Equipos</button>
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
            createGameBoard();
        }
    });
}

// Create game board
function createGameBoard() {
    const container = document.querySelector('.game-container');
    gameState.totalQuestions = gameData.categories.length * gameData.categories[0].questions.length;

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

    // Add questions
    gameData.categories.forEach(category => {
        category.questions.forEach(question => {
            boardHTML += `
                <div class="question-card" data-value="${question.value}">
                    $${question.value}
                </div>
            `;
        });
    });

    boardHTML += '</div>';
    container.innerHTML = boardHTML;

    // Add event listeners to question cards
    document.querySelectorAll('.question-card').forEach((card, index) => {
        card.addEventListener('click', () => {
            const categoryIndex = Math.floor(index / 3);
            const questionIndex = index % 3;
            showQuestion(categoryIndex, questionIndex);
            card.style.visibility = 'hidden';
        });
    });
}

// Show question
function showQuestion(categoryIndex, questionIndex) {
    const question = gameData.categories[categoryIndex].questions[questionIndex];
    gameState.currentQuestion = question;

    const modal = document.createElement('div');
    modal.className = 'question-modal fade-in';
    modal.innerHTML = `
        <div class="question-content">
            <h2>$${question.value}</h2>
            <p>${question.question}</p>
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
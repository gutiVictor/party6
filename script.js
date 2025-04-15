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

// Sample categories and questions with larger question banks
const gameData = {
    categories: [
        {
            name: 'Biblia',
            questionBank: [
                { value: 10, question: '¿En qué año se descubrió América?', answers: ['1492', '1498', '1500', '1489'], correct: 0 },
                { value: 10, question: '¿Quién escribió los primeros cinco libros de la Biblia?', answers: ['Moisés', 'Abraham', 'David', 'Salomón'], correct: 0 },
                { value: 10, question: '¿Cuántos libros tiene la Biblia?', answers: ['66', '73', '39', '27'], correct: 0 },
                { value: 20, question: '¿Quién fue el primer presidente de México?', answers: ['Guadalupe Victoria', 'Benito Juárez', 'Miguel Hidalgo', 'Agustín de Iturbide'], correct: 0 },
                { value: 20, question: '¿Cuál fue el primer milagro de Jesús?', answers: ['Convertir agua en vino', 'Multiplicar los panes', 'Resucitar a Lázaro', 'Caminar sobre el agua'], correct: 0 },
                { value: 20, question: '¿Quién construyó el Arca?', answers: ['Noé', 'Abraham', 'Moisés', 'David'], correct: 0 },
                { value: 30, question: '¿En qué año comenzó la Revolución Mexicana?', answers: ['1910', '1920', '1900', '1915'], correct: 0 },
                { value: 30, question: '¿Cuántos días y noches llovió durante el diluvio?', answers: ['40', '7', '30', '100'], correct: 0 },
                { value: 30, question: '¿Quién fue llevado al cielo en un carro de fuego?', answers: ['Elías', 'Moisés', 'Enoc', 'Eliseo'], correct: 0 },
                { value: 40, question: '¿Qué tratado puso fin a la Revolución Mexicana?', answers: ['Tratados de Córdoba', 'Plan de Iguala', 'Tratados de Teoloyucan', 'Plan de Ayala'], correct: 0 },
                { value: 40, question: '¿Cuántos años vagó Israel por el desierto?', answers: ['40', '30', '50', '20'], correct: 0 },
                { value: 40, question: '¿Quién traicionó a Jesús?', answers: ['Judas', 'Pedro', 'Tomás', 'Juan'], correct: 0 },
                { value: 50, question: '¿En qué año se promulgó la Constitución Mexicana?', answers: ['1917', '1910', '1921', '1915'], correct: 0 },
                { value: 50, question: '¿Cuántos discípulos tenía Jesús?', answers: ['12', '10', '7', '15'], correct: 0 },
                { value: 50, question: '¿Quién fue el rey más sabio de Israel?', answers: ['Salomón', 'David', 'Saúl', 'Roboam'], correct: 0 },
                { value: 60, question: '¿Quién fue el último emperador de México?', answers: ['Maximiliano de Habsburgo', 'Agustín de Iturbide', 'Antonio López de Santa Anna', 'Porfirio Díaz'], correct: 0 },
                { value: 60, question: '¿Cuál es el último libro de la Biblia?', answers: ['Apocalipsis', 'Juan', 'Daniel', 'Malaquías'], correct: 0 },
                { value: 60, question: '¿Quién fue el primer mártir cristiano?', answers: ['Esteban', 'Santiago', 'Pedro', 'Pablo'], correct: 0 }
            ]
        },
        {
            name: 'Libro de Mormón',
            questionBank: [
                { value: 10, question: '¿Quién escribió las planchas de oro?', answers: ['Mormón', 'Nefi', 'Moroni', 'Lehi'], correct: 0 },
                { value: 10, question: '¿En qué año se publicó el Libro de Mormón?', answers: ['1830', '1820', '1827', '1823'], correct: 0 },
                { value: 10, question: '¿Quién fue el primer profeta en el Libro de Mormón?', answers: ['Lehi', 'Nefi', 'Mormón', 'Moroni'], correct: 0 },
                { value: 20, question: '¿Qué construyó Nefi?', answers: ['Un barco', 'Un templo', 'Una ciudad', 'Un ejército'], correct: 0 },
                { value: 20, question: '¿Qué objeto guió a Lehi y su familia?', answers: ['Liahona', 'Urim y Tumim', 'Espada de Labán', 'Planchas de bronce'], correct: 0 },
                { value: 20, question: '¿Quién era el rey de los lamanitas?', answers: ['Lamán', 'Lemuel', 'Lamoni', 'Amalickíah'], correct: 0 },
                { value: 30, question: '¿Qué profeta vio el dedo del Señor?', answers: ['El hermano de Jared', 'Nefi', 'Moroni', 'Alma'], correct: 0 },
                { value: 30, question: '¿Quién fue convertido por un ángel?', answers: ['Alma el joven', 'Lamoni', 'Zeezrom', 'Amulek'], correct: 0 },
                { value: 30, question: '¿Cuántos años predicó Abinadí?', answers: ['2', '5', '10', '7'], correct: 0 },
                { value: 40, question: '¿Quién tradujo el Libro de Mormón?', answers: ['José Smith', 'Oliver Cowdery', 'Martin Harris', 'Moroni'], correct: 0 },
                { value: 40, question: '¿Cuántas planchas de oro había?', answers: ['60', '50', '70', '80'], correct: 0 },
                { value: 40, question: '¿Quién era el último nefita?', answers: ['Moroni', 'Mormón', 'Éter', 'Nefi'], correct: 0 },
                { value: 50, question: '¿Cuántos testigos vieron las planchas?', answers: ['11', '3', '8', '12'], correct: 0 },
                { value: 50, question: '¿Qué edad tenía José Smith cuando tuvo la Primera Visión?', answers: ['14', '12', '16', '18'], correct: 0 },
                { value: 50, question: '¿Quién era el rey de los nefitas?', answers: ['Mosíah', 'Benjamín', 'Limhi', 'Noé'], correct: 0 },
                { value: 60, question: '¿En qué monte se escondieron las planchas?', answers: ['Cumorah', 'Sinaí', 'Shim', 'Ramah'], correct: 0 },
                { value: 60, question: '¿Cuántos años duró la guerra final nefita?', answers: ['10', '5', '15', '20'], correct: 0 },
                { value: 60, question: '¿Quién era el último jaredita?', answers: ['Coriántumr', 'Éter', 'Shiz', 'Akish'], correct: 0 }
            ]
        },
        {
            name: 'Perla',
            questionBank: [
                { value: 10, question: '¿Quién escribió el Libro de Moisés?', answers: ['José Smith', 'Moisés', 'Abraham', 'Pedro'], correct: 0 },
                { value: 10, question: '¿En qué año se publicó la Perla de Gran Precio?', answers: ['1851', '1830', '1842', '1880'], correct: 0 },
                { value: 10, question: '¿Qué contiene el Libro de Abraham?', answers: ['Facsímiles', 'Profecías', 'Historia', 'Doctrina'], correct: 0 },
                { value: 20, question: '¿Quién tradujo el Libro de Abraham?', answers: ['José Smith', 'Oliver Cowdery', 'Sidney Rigdon', 'Brigham Young'], correct: 0 },
                { value: 20, question: '¿De dónde vinieron los papiros egipcios?', answers: ['Michael Chandler', 'Antonio Lebolo', 'Napoleón', 'Howard Carter'], correct: 0 },
                { value: 20, question: '¿Qué muestra el Facsímile 1?', answers: ['Abraham en el altar', 'El sistema planetario', 'La creación', 'El bautismo'], correct: 0 },
                { value: 30, question: '¿Cuántos facsímiles hay?', answers: ['3', '2', '4', '5'], correct: 0 },
                { value: 30, question: '¿Qué contiene José Smith-Mateo?', answers: ['Profecías', 'Historia', 'Doctrina', 'Parábolas'], correct: 0 },
                { value: 30, question: '¿Quién es el autor de los Artículos de Fe?', answers: ['José Smith', 'Oliver Cowdery', 'Brigham Young', 'John Taylor'], correct: 0 },
                { value: 40, question: '¿Cuántos Artículos de Fe hay?', answers: ['13', '12', '14', '10'], correct: 0 },
                { value: 40, question: '¿Qué muestra el Facsímile 2?', answers: ['Kolob', 'Abraham', 'La creación', 'El sacerdocio'], correct: 0 },
                { value: 40, question: '¿Qué es Kolob?', answers: ['La estrella más cercana a Dios', 'Un planeta', 'Un ángel', 'Un templo'], correct: 0 },
                { value: 50, question: '¿Cuántos libros contiene la Perla de Gran Precio?', answers: ['5', '4', '6', '3'], correct: 0 },
                { value: 50, question: '¿Qué contiene el Libro de Moisés?', answers: ['La creación', 'El diluvio', 'El éxodo', 'Los mandamientos'], correct: 0 },
                { value: 50, question: '¿Qué es la Piedra de Videntes?', answers: ['Un instrumento de traducción', 'Una roca común', 'Un altar', 'Un símbolo'], correct: 0 },
                { value: 60, question: '¿Qué es el Urim y Tumim?', answers: ['Intérpretes sagrados', 'Piedras preciosas', 'Escrituras antiguas', 'Instrumentos musicales'], correct: 0 },
                { value: 60, question: '¿Quién escribió José Smith-Historia?', answers: ['José Smith', 'Oliver Cowdery', 'Emma Smith', 'Lucy Mack Smith'], correct: 0 },
                { value: 60, question: '¿En qué año tuvo José Smith la Primera Visión?', answers: ['1820', '1823', '1827', '1830'], correct: 0 }
            ]
        },
        {
            name: 'D & C',
            questionBank: [
                { value: 10, question: '¿Cuántas secciones tiene D&C?', answers: ['138', '135', '140', '130'], correct: 0 },
                { value: 10, question: '¿Quién recibió la primera revelación en D&C?', answers: ['José Smith', 'Oliver Cowdery', 'Martin Harris', 'David Whitmer'], correct: 0 },
                { value: 10, question: '¿En qué año se publicó D&C?', answers: ['1835', '1830', '1833', '1837'], correct: 0 },
                { value: 20, question: '¿Qué es la Palabra de Sabiduría?', answers: ['Sección 89', 'Sección 76', 'Sección 88', 'Sección 87'], correct: 0 },
                { value: 20, question: '¿Qué es la Visión?', answers: ['Sección 76', 'Sección 89', 'Sección 88', 'Sección 87'], correct: 0 },
                { value: 20, question: '¿Qué es la Declaración Oficial 1?', answers: ['Fin del matrimonio plural', 'Sacerdocio', 'Diezmo', 'Bautismo'], correct: 0 },
                { value: 30, question: '¿Quién vio la visión del reino celestial?', answers: ['José Smith y Sidney Rigdon', 'José Smith', 'Oliver Cowdery', 'Brigham Young'], correct: 0 },
                { value: 30, question: '¿Qué es la Ley de Consagración?', answers: ['Sección 42', 'Sección 89', 'Sección 76', 'Sección 88'], correct: 0 },
                { value: 30, question: '¿Qué es el Juramento y Convenio del Sacerdocio?', answers: ['Sección 84', 'Sección 89', 'Sección 76', 'Sección 88'], correct: 0 },
                { value: 40, question: '¿Quién escribió la Carta desde la Cárcel de Liberty?', answers: ['José Smith', 'Hyrum Smith', 'Sidney Rigdon', 'John Taylor'], correct: 0 },
                { value: 40, question: '¿Qué es la Escuela de los Profetas?', answers: ['Sección 88', 'Sección 89', 'Sección 76', 'Sección 84'], correct: 0 },
                { value: 40, question: '¿Qué es la Ley del Diezmo?', answers: ['Sección 119', 'Sección 89', 'Sección 76', 'Sección 88'], correct: 0 },
                { value: 50, question: '¿Quién recibió la visión de la redención de los muertos?', answers: ['Joseph F. Smith', 'José Smith', 'Brigham Young', 'John Taylor'], correct: 0 },
                { value: 50, question: '¿Qué es la Declaración Oficial 2?', answers: ['Sacerdocio para todos', 'Matrimonio plural', 'Diezmo', 'Bautismo'], correct: 0 },
                { value: 50, question: '¿Qué es la Sección 132?', answers: ['Matrimonio eterno', 'Palabra de Sabiduría', 'Diezmo', 'Bautismo'], correct: 0 },
                { value: 60, question: '¿En qué año se recibió la última revelación en D&C?', answers: ['1978', '1890', '1918', '1835'], correct: 0 },
                { value: 60, question: '¿Qué es la Sección 138?', answers: ['Redención de los muertos', 'Matrimonio eterno', 'Palabra de Sabiduría', 'Diezmo'], correct: 0 },
                { value: 60, question: '¿Quién sucedió a José Smith?', answers: ['Brigham Young', 'Sidney Rigdon', 'Oliver Cowdery', 'John Taylor'], correct: 0 }
            ]
        }
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
// Default filter for the app
const defaultConfig =  {
    type: ['checkin'],
    depth: ['light'],
    topic: ['mood'],
    risk: ['safe']
};

let filter = { ...defaultConfig};

window.onload = loadConfig();
window.onload = fetchQuestions();

// Save on change
function saveConfig(newConfig) {
    filter = { ...filter, ...newConfig };
    localStorage.setItem('deeptalk-config', JSON.stringify(filter));
}

function loadConfig() {
    const savedConfig = localStorage.getItem('deeptalk-config');
    if (savedConfig) {
        filter = JSON.parse(savedConfig);
    } else {
        filter = { ...defaultConfig};
        saveConfig(filter);
    }

    applyFilter();
}

function applyFilter() {
    console.log(filter);
    Object.entries(filter).forEach(([category, value]) => {
        console.log(category, value);
        value.forEach((element) => {
            const pill = document.querySelector(`[data-category="${category}"][data-value="${element}"]`);
            if (pill) pill.classList.add('active');
            
        });
    });
}

document.addEventListener('click', function(e) {
    if (e.target.closest('.filter-pill')) {
        const pill = e.target.closest('.filter-pill');
        const category = pill.dataset.category;
        const value = pill.dataset.value;

        toggleFilter(category, value, pill);
    }
})

function toggleFilter(category, value, pillElement) {
    const wasActive = pillElement.classList.contains('active');
    console.log(`Default config: ${defaultConfig.type}`);
    if (wasActive) {
        if (filter[category].length <= 1) {
            console.log(`cannot remove ${value}`);

        }
        pillElement.classList.remove('active');
        console.log(`remove ${value}`);
        removeValue(filter[category], value);
    } else {
        pillElement.classList.add('active');
        console.log(`add ${value}`);
        filter[category].push(value);
    }

    if (filter[category].length < 1) {
        filter[category].push(defaultConfig[category][0]);
        applyFilter();
    }

    saveConfig(filter);
    console.log(filter)
}

function removeValue(array, value) {
    const index = array.indexOf(value);
    if (index > -1) {
        array.splice(index, 1);
    }
}

// Fragen werden gelden und dargestellt
let questions = [];
let filteredQuestions = [];

async function fetchQuestions() {
    try {
        const response = await fetch('data/questions.json');
        questions = await response.json();
        console.log(`${questions.length} Fragen geladen`);
        // Filter einstellen
    } catch (error) {
        console.error('questions.json konnte nicht geladen werden: ', error);
        questions = [{question: 'Fallback-Frage: Wie geht\'s?', type: 'checkin', depth: 'light', topic: 'mood', risk: 'safe'}];
    }
}

function getFilteredQuestions() {
    return questions.filter(question => {
        // return (!filter.type || question.type === filter.type) &&
        //         (!filter.depth || question.depth === filter.depth) &&
        //         (!filter.topic || question.topic === filter.topic) &&
        //         (!filter.risk || question.risk === filter.risk);
        return (!filter.type || filter.type.includes(question.type)) &&
                (!filter.depth || filter.depth.includes(question.depth)) &&
                (!filter.topic || filter.topic.includes(question.topic)) &&
                (!filter.risk || filter.risk.includes(question.risk));
    });
}

function loadFilteredQuestions() {
    filteredQuestions = getFilteredQuestions();
    console.log(filteredQuestions);
}

function getNextQuestion() {
    const filteredQuestions = getFilteredQuestions();
    const randomID = Math.floor(Math.random() * filteredQuestions.length);
    console.log(filteredQuestions[randomID]);
}

document.getElementById('btn-start-talk').onclick = loadFilteredQuestions;

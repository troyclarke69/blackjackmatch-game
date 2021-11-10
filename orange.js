const GOAL = 21;
const NUM_CARDS = 11;
const MAX_MISMATCHES = 7;
const MAX_CARD_VALUE = 11;
const container = document.querySelector('[data-container]');
const header = document.querySelector('[data-header]');
const message = document.querySelector('[data-message]');
const controls = document.querySelector('[data-controls]');
const attempts = document.querySelector('[data-attempts]');
let faceValues = [];
let currentPicks = [];
let currentPicksIdx = [];
let savedPicks = [];
let savedPicksIdx = [];
let discardedPicks = [];
let currentTotal = 0;
let roundPicker = 0;
let mismatches = 0;


const handleRound = (curPicks, curPicksIdx) => {
    currentPicks = [];
    currentPicksIdx = [];
    if (curPicks[0] === curPicks[1]) {
        setTimeout(() => {
            if (currentTotal + curPicks[0] <= GOAL) {
                message.textContent = "A Match!";
                let keep = document.createElement('button');
                keep.textContent = "Keep";
                keep.addEventListener('click', e => {
                    e.preventDefault();
                    // console.log('keep');
                    savedPicks.push(curPicks[0]);

                    savedPicksIdx.push(curPicksIdx[0]);
                    savedPicksIdx.push(curPicksIdx[1]);

                    // console.log('saved', savedPicks);
                    currentTotal = getTotal();
                    showTotals();
                    clearBoard(controls);
                    message.textContent = "Hit or Stay?";

                    let hit = document.createElement('button');
                    hit.textContent = "Hit";
                    hit.addEventListener('click', e => {
                        e.preventDefault();

                        // console.log('hit');
                        clearBoard(container);
                        clearBoard(controls);
                        showCards();
                        roundPicker = 0; 
                        message.textContent = "Choose another pair!";
                    });

                    let stay = document.createElement('button');
                    stay.textContent = "Stay";
                    stay.addEventListener('click', e => {
                        e.preventDefault();
                        roundPicker = 0;
                        computerPlay();
                    
                    });

                        controls.appendChild(hit);
                        controls.appendChild(stay);
                    });
                controls.appendChild(keep);
                
            } else {
                message.textContent = "A Match! But you can't Keep cause you're over!";
                savedPicksIdx.push(curPicks[0]);
                savedPicksIdx.push(curPicks[1]);
                let stay = document.createElement('button');
                stay.textContent = "Stay";
                stay.addEventListener('click', e => {
                    e.preventDefault();

                    // console.log('stay');
                    roundPicker = 0;
                    clearBoard(container);
                    clearBoard(controls);
                    message.textContent = "The Robot will play now"
                    
                    computerPlay();
                
                });
                controls.appendChild(stay);
                checkMismatches();

            };
            
            let discard = document.createElement('button');
            discard.textContent = "Discard"
            discard.addEventListener('click', e => {
                e.preventDefault();

                // console.log('discard');
                discardedPicks.push(curPicks[0]);
                clearBoard(container);
                clearBoard(controls);
                showCards();
                roundPicker = 0;
                message.textContent = "Hit";
            });

            controls.appendChild(discard);
        },500);
      
    } else {
        // console.log('no match');
        setTimeout(() => {
            message.textContent = "No Match!";
            mismatches++;        
            roundPicker = 0;
            currentPicks = [];
            currentPicksIdx = [];
            clearBoard(container);
            clearBoard(controls);
            showCards();
            checkMismatches();
        }, 1000);      
    }
}

const showCards = () => {
    faceValues.forEach( (val, index) => {
        let div = document.createElement('div');
        if (savedPicksIdx.includes(index)) {
            div.classList.add('disabled');
            div.addEventListener('click', e => {
                message.textContent = "Already Picked!";
            });

        } else {
            div.classList.add('card');
            div.addEventListener('click', e => {
                e.preventDefault();

                // can't choose the same card in SAME ROUND>>>
                if (!currentPicksIdx.includes(index)) {
                    div.textContent = val;

                    div.classList.add('selected');
                    roundPicker++;
                    currentPicks.push(val);
                    currentPicksIdx.push(index);
    
                    if (roundPicker === 2) {
                        handleRound(currentPicks, currentPicksIdx);
                    };
                }
               
            });
        }
        // flip on for testing>>
        // div.textContent = val;
        div.dataset.val = val;
        div.dataset.idx = index;      
        container.appendChild(div);
    })
}

const getFaceValues = () => {
    let vals = [];
    for (let i = 1; i < NUM_CARDS; i++) {
        let rand = Math.ceil(Math.random() * MAX_CARD_VALUE);
        vals.push(rand);
    }
    faceValues = shuffle([ ...vals, ...vals]);
    return faceValues;
}

const showTotals = () => {
    header.textContent = `Your Total: ${currentTotal}`
}

const getTotal = () => {
    return savedPicks.reduce((a,b) => a + b);
}

const shuffle = (array) => {
    var currentIndex = array.length,  randomIndex; 
    while (0 !== currentIndex) {
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex--;
      [array[currentIndex], array[randomIndex]] = [
        array[randomIndex], array[currentIndex]];
    }
    return array;
}

const clearBoard = (element) => {
    while (element.firstChild) {
        element.removeChild(element.firstChild);
    }
}

const checkMismatches = () =>  {
    if (mismatches >= MAX_MISMATCHES) {
        computerPlay();       
    } else {
        let remaining = MAX_MISMATCHES - mismatches;
        let msg = `<h2>${remaining} pick`;
        remaining === 1 ? 
            attempts.innerHTML = msg + ` remaining!</h2>` :
            attempts.innerHTML = msg + `s remaining!</h2>`
    }
}

const computerPlay = () => {
    attempts.textContent = "";
    let tot = 0
    while (tot < currentTotal && tot <= GOAL) {
        let rand = Math.ceil(Math.random() * MAX_CARD_VALUE);
        if (faceValues.includes(rand)) {
            tot = tot + rand;
        }   
    }
    if (tot >= currentTotal && tot <= GOAL) {
        tot !== currentTotal ?
        message.innerHTML = `<h2>You LOSE!</h2> You: ${currentTotal}   *   Robo: ${tot}` :
        message.innerHTML = `<h2>You LOSE!</h2> You: ${currentTotal}   *   Robo: ${tot}. <small>Tie goes to the house</small>`;
    } else {
        tot > 21 ? 
        message.innerHTML = `<h2>You WON!</h2> You: ${currentTotal}   *   Robo BUSTED at ${tot}` :
        message.innerHTML = `<h2>You WON!</h2> You: ${currentTotal}   *   Robo: ${tot}`;
    }

    clearBoard(container);
    clearBoard(header);
    clearBoard(controls);

    let newGame = document.createElement('button');
    newGame.textContent = "New Game";
    newGame.classList.add('controls');
    newGame.addEventListener('click', e => {
        e.preventDefault();
        startGame();
    });
    container.appendChild(newGame);
}

const startGame = () => {
    clearBoard(container);
    clearBoard(controls);
    clearBoard(message);
    clearBoard(attempts);
    faceValues = [];
    currentPicks = [];
    currentPicksIdx = [];
    savedPicks = [];
    savedPicksIdx = [];
    discardedPicks = [];
    currentTotal = 0;
    roundPicker = 0;
    mismatches = 0;
    getFaceValues();
    showCards();
    showTotals();
    checkMismatches();
    message.textContent = "Good Luck!";
    // how do we prevent the JUMP in the console - with the buttons?
    // OR is it good thing? (it prompts a user for action???)
    // controls.textContent = "****************";
}

startGame();
const NUM_CARDS = 11;
const MAX_MISMATCHES = 5;
const MAX_CARD_VALUE = 11;
const GOAL = 21;
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

function computerPlay() {
    attempts.textContent = "";
    let tot = 0
    while (tot < currentTotal && tot <= GOAL) {
        let rand = Math.ceil(Math.random() * MAX_CARD_VALUE);
        if (faceValues.includes(rand)) {
            tot = tot + rand;
            // console.log('computer', rand, tot);
        }   
    }
    // console.log(tot);
    if (tot >= currentTotal && tot <= GOAL) {
        tot !== currentTotal ?
        message.textContent = `You LOSE! Robo got ${tot}` :
        message.textContent = `You LOSE! Robo got ${tot}. Tie goes to the house.` ;

    } else {
        tot > 21 ? 
        message.textContent = `You WON! Robo BUSTED at ${tot}` :
        message.textContent = `You WON! Robo got ${tot}`;

    }

    clearBoard(container);
    let newGame = document.createElement('button');
    newGame.textContent = "New Game";
    newGame.addEventListener('click', e => {
        e.preventDefault();
        startGame();
    });

    container.appendChild(newGame);
    
}


function handleRound(curPicks, curPicksIdx) {
    // console.log('curPicks', curPicks);
    // console.log('curPicksIdx', curPicksIdx);
    currentPicks = [];
    currentPicksIdx = [];
    if (curPicks[0] === curPicks[1]) {
        setTimeout(() => {

            if (currentTotal + curPicks[0] <= GOAL) {
                    message.textContent = "A Match!";
                    let keep = document.createElement('button');
                    keep.textContent = "Keep";
                    keep.addEventListener('click', e => {
                        // console.log('keep');
                        savedPicks.push(curPicks[0]);

                        savedPicksIdx.push(curPicksIdx[0]);
                        savedPicksIdx.push(curPicksIdx[1]);

                        // console.log('saved', savedPicks);
                        currentTotal = getTotal();
                        showTotals();
                        clearBoard(controls)
                        message.textContent = "Hit or Stay?";

                        let hit = document.createElement('button');
                        hit.textContent = "Hit";
                        hit.addEventListener('click', e => {
                            // console.log('hit');
                            clearBoard(container);
                            clearBoard(controls);
                            showCards();
                            roundPicker = 0; 
                            message.textContent = "Choose another pair!"
                        });

                        let stay = document.createElement('button');
                        stay.textContent = "Stay";
                        stay.addEventListener('click', e => {
                            // console.log('stay');
                            roundPicker = 0;
                            clearBoard(container);
                            clearBoard(controls);
                            message.textContent = "The Robot will play now"
                            
                            // invoke computerPlay
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
                    // console.log('stay');
                    roundPicker = 0;
                    clearBoard(container);
                    clearBoard(controls);
                    message.textContent = "The Robot will play now"
                    
                    // invoke computerPlay
                    computerPlay();
                
                });
                controls.appendChild(stay);

                checkMismatches();

            }
            
            let discard = document.createElement('button');
            discard.textContent = "Discard"
            discard.addEventListener('click', e => {
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
        setTimeout(() => {
            message.textContent = "No Match!";
            mismatches++;
            checkMismatches();
            roundPicker = 0;
            currentPicks = [];
            currentPicksIdx = [];
            clearBoard(container);
            clearBoard(controls);
            showCards();
        }, 1000);      
    }
}

function showCards() {
    // console.log('savedPicks', savedPicks);
    // console.log('savedPicksIdx', savedPicksIdx);

    faceValues.forEach( (val, index) => {
        // console.log('loop', val, index);
        let div = document.createElement('div');

        // if (savedPicks.includes(val)) {
        if (savedPicksIdx.includes(index)) {

            div.classList.add('disabled');
            div.addEventListener('click', e => {
                message.textContent = "Already Chosen!";
            });
        } else {
            div.classList.add('card');
            div.addEventListener('click', e => {
                div.textContent = val;
                roundPicker++;
                currentPicks.push(val);
                currentPicksIdx.push(index);

                if (roundPicker === 2) {
                    handleRound(currentPicks, currentPicksIdx);
                };
            });
        }
        // flip on for testing>>
        // div.textContent = val;
        div.dataset.val = val;
        div.dataset.idx = index;
       
        container.appendChild(div);
    })
}

function getFaceValues() {
    let vals = [];
    for (let i = 1; i < NUM_CARDS; i++) {
        let rand = Math.ceil(Math.random() * MAX_CARD_VALUE);
        vals.push(rand);
    }
    faceValues = shuffle([ ...vals, ...vals]);
    return faceValues;
}

function clearBoard(element) {
    // console.log('clearBoard');
    while (element.firstChild) {
        console.log('clearBoard');
        element.removeChild(element.firstChild);
    }
}

function checkMismatches() {
    if (mismatches >= MAX_MISMATCHES) {
        attempts.textContent = `You're done! Your total is: ${currentTotal}`;
        message.textContent = "";
        clearBoard(container);
        clearBoard(header);
        clearBoard(controls);

        // console.log('computerPlay');
        computerPlay();
        
    } else {
        let remaining = MAX_MISMATCHES - mismatches;
        // attempts.textContent = `Total Guesses: ${MAX_MISMATCHES}. Remaining: ${remaining}`;
        remaining === 1 ? 
            attempts.textContent = `You have ${remaining} pick left!` :
            attempts.textContent = `You have ${remaining} picks left!`
    }
}

function showTotals() {
    header.textContent = `Your total: ${currentTotal}`
}

function getTotal() {
    return savedPicks.reduce((a,b) => a + b);
}

function shuffle(array) {
    var currentIndex = array.length,  randomIndex;
  
    // While there remain elements to shuffle...
    while (0 !== currentIndex) {
  
      // Pick a remaining element...
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex--;
  
      // And swap it with the current element.
      [array[currentIndex], array[randomIndex]] = [
        array[randomIndex], array[currentIndex]];
    }
  
    return array;
}

function startGame() {
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

}

startGame();
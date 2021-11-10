const NUM_CARDS = 7;
const MAX_MISMATCHES = 5;
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


function checkMismatches() {
    if (mismatches >= MAX_MISMATCHES) {
        // console.log('exceeded tries');
        attempts.textContent = `You're done! Your total is: ${currentTotal}`;
        
    } else {
        let remaining = MAX_MISMATCHES - mismatches;
        attempts.textContent = `Mismatches: ${mismatches}. Remaining: ${remaining}`;

    }
}

function handleRound(curPicks, curPicksIdx) {
    // console.log('curPicks', curPicks);
    // console.log('curPicksIdx', curPicksIdx);
    currentPicks = [];
    currentPicksIdx = [];
    if (curPicks[0] === curPicks[1]) {
        setTimeout(() => {
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
                   
                });

                controls.appendChild(hit);
                controls.appendChild(stay);
            });

            controls.appendChild(keep);
            
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
        // div.textContent = val;
        div.dataset.val = val;
        div.dataset.idx = index;
       
        container.appendChild(div);
    })
}

function getFaceValues() {
    let vals = [];
    for (let i = 1; i < NUM_CARDS; i++) {
        let rand = Math.ceil(Math.random() * 21);
        vals.push(rand);
    }
    faceValues = shuffle([ ...vals, ...vals]);
    return faceValues;
}
// Another function ?? redrawBoard() { clearBoard(container) showCards() }
function clearBoard(element) {
    while (element.firstChild) {
        element.removeChild(element.firstChild);
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

getFaceValues();
showCards();
showTotals();
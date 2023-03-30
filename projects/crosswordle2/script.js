const mainTable = document.getElementById("mainTable");
const wordle = document.getElementById("wordle");
const wordleTable = document.getElementById("wordleTable");
const menu = document.getElementById("menu");
const red = "rgb(255, 75, 75)", green = "rgb(108, 255, 89)", orange = "rgb(255, 195, 74)";
var activeWordle = false;
var dataList = "";

function instantiateTable(size) {
    for (let i = 0; i < size; i++) {
        mainTable.innerHTML += "<tr id='mainTableRow" + i + "'></tr>"
        for (let j = 0; j < size; j++) {
            document.getElementById("mainTableRow" + i).innerHTML += "<td id='" + i + "," + j + "'> </td>"
        }
        mainTable.innerHTML += "<br>"
    }
}

function getPos(id, index) {
    let initialPos = dataList.words[id].location.split(",");
    console.log(initialPos)
    let pos = initialPos;
    if (dataList.words[id].direction == "horizontal")
        pos[1] = initialPos[1] * 1 + index * 1;
    else
        pos[0] = initialPos[0] * 1 + index * 1;
    return pos;
}

function fillTable() {
    for (let i = 0; i < dataList.words.length; i++) {
        for (let j = 0; j < dataList.words[i].word.length; j++) {
            let space = document.getElementById(getPos(i, j)[0] + "," + getPos(i, j)[1]);
            //space.innerHTML = dataList.words[i].word[j]; // Shows all answers if uncommented
            space.className += " " + dataList.words[i].id + " ";
            if (space.className.indexOf("blankTile") < 0)
                space.className += " blankTile ";
            space.addEventListener("mouseover", event => {
                let spaceClasses = event.target.classList;
                let k = 0;
                while (spaceClasses[k] * 1 == NaN)
                    k++
                highlightWord(spaceClasses[0]);
                updateColors();
            });
            space.addEventListener("mouseout", event => {
                let spaceClasses = event.target.classList;
                let k = 0;
                while (spaceClasses[k] * 1 == NaN)
                    k++
                unhighlightWord(spaceClasses[0]);
                updateColors();
            });
            space.addEventListener("click", event => {
                let spaceClasses = event.target.classList;
                let k = 0;
                while (spaceClasses[k] * 1 == NaN)
                    k++
                selectWord(spaceClasses[0]);
                updateColors();
            });
        }
    }
}

function getWordSpaces(id) {
    let arr = []
    for (let i = 0; i < dataList.words[id].word.length; i++) {
        arr.push(document.getElementById(getPos(id, i)[0] + "," + getPos(id, i)[1]));
    }
    return arr;
}

function highlightWord(id) {
    let wordSpaces = getWordSpaces(id);
    for (let i = 0; i < wordSpaces.length; i++)
        wordSpaces[i].style.filter = "brightness(130%)";
}

function unhighlightWord(id) {
    let wordSpaces = getWordSpaces(id);
    for (let i = 0; i < wordSpaces.length; i++)
        wordSpaces[i].style.filter = "brightness(100%)";
}

function updateColors() {
    for (let i = 0; i < dataList.words.length; i++) {
        if (dataList.words[i].attempts.length <= 0) {
            /*for (let j = 0; j < dataList.words[i].word.length; j++) {
                document.getElementById(getPos(i, j)[0] + "," + getPos(i, j)[1]).style.backgroundColor = "aliceblue";
            }*/
            continue;
        }
        let colors = checkGuess(i, dataList.words[i].attempts[dataList.words[i].attempts.length - 1]);
        for (let j = 0; j < dataList.words[i].word.length; j++) {
            document.getElementById(getPos(i, j)[0] + "," + getPos(i, j)[1]).style.backgroundColor = colors[j];
        }
    }
}

function checkGuess(wordId, guess) {
    let arr = [];
    let word = dataList.words[wordId].word;
    let letters = [];
    let lettersFound = [];
    for (let i = 65; i <= 90; i++) {
        letters[i] = 0;
        lettersFound[i] = 0;
    }
    for (let i = 0; i < word.length; i++) {
        letters[word[i].charCodeAt()]++;
    }
    for (let i = 0; i < word.length; i++) {
        if (guess[i] == word[i]) {
            lettersFound[guess[i].charCodeAt()]++;
            arr.push(green);
        }
        else if (word.indexOf(guess[i]) > -1) {
            lettersFound[guess[i].charCodeAt()]++;
            if (lettersFound[guess[i].charCodeAt()] > letters[guess[i].charCodeAt()])
                arr.push(red)
            else
                arr.push(orange);
        }
        else
            arr.push(red);
    }
    return arr;
}

var selectedWordId = null;
var column = 0;

function selectWord(id) {
    if (dataList.words[id].word == dataList.words[id].attempts[dataList.words[id].attempts.length - 1])
        return;
    selectedWordId = id;
    showWordleTable(id);
    column = 0;
}

function showWordleTable(wordId) {
    activeWordle = true;
    mainTable.style.display = "none";
    wordle.style.display = "inline";
    menu.style.display = "none";

    wordleTable.innerHTML = "";
    for (let i = 0; i < dataList.words[wordId].word.length + 1; i++) {
        wordleTable.innerHTML += "<tr id='wordleTableRow" + i + "'></tr>"
        for (let j = 0; j < dataList.words[wordId].word.length; j++) {
            document.getElementById("wordleTableRow" + i).innerHTML += "<td id='wordleTable[" + i + "," + j + "]'></td";
        }
    }

    let topRow = document.getElementById("wordleTopRow");
    topRow.innerHTML = "";
    for (let i = 0; i < dataList.words[wordId].word.length; i++) {
        topRow.innerHTML += "<td id='topRow" + i + "'></td>"
        let currentSpace = document.getElementById(getPos(wordId, i)[0] + "," + getPos(wordId, i)[1]);
        if (currentSpace.innerHTML == dataList.words[selectedWordId].word[i]) {
            document.getElementById("topRow" + i).innerHTML = currentSpace.innerHTML;
            document.getElementById("topRow" + i).style.backgroundColor = green;
        }
        else
            document.getElementById("topRow" + i).innerHTML = " ";
    }

    let tempAttempts = dataList.words[selectedWordId].attempts;
    dataList.words[selectedWordId].attempts = [];
    for (let i = 0; i < tempAttempts.length; i++) {
        for (let j = 0; j < tempAttempts[i].length; j++) {
            document.getElementById("wordleTable[" + i + "," + j + "]").innerHTML = tempAttempts[i][j];
        }
        wordleGuess(tempAttempts[i]);
        dataList.words[selectedWordId].attempts.push(tempAttempts[i]);
    }
}

function closeWordleTable() {
    activeWordle = false;
    mainTable.style.display = "inline";
    wordle.style.display = "none";
    menu.style.display = "inline";

    if (dataList.words[selectedWordId].attempts.length > 0) {
        for (let i = 0; i < dataList.words[selectedWordId].word.length; i++) {
            let space = document.getElementById(getPos(selectedWordId, i)[0] + "," + getPos(selectedWordId, i)[1]);
            let wordleSpace = document.getElementById("wordleTable[" + (dataList.words[selectedWordId].attempts.length - 1) + "," + i + "]");
            space.innerHTML = wordleSpace.innerHTML
        }
    }

    updateColors();
}

const keys = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z", "ENTER", "BACKSPACE"];
document.addEventListener("keydown", function (e) {
    if (!activeWordle)
        return;
    let k = e.key.toUpperCase();
    if (keys.indexOf(k) < 0)
        return;

    if (dataList.words[selectedWordId].attempts.length >= dataList.words[selectedWordId].word.length + 1)
        return;

    processInput(k);
});

function processInput(k) {
    if (k == "BACKSPACE") {
        if (column <= 0)
            return;
        column--;
        document.getElementById("wordleTable[" + dataList.words[selectedWordId].attempts.length + "," + column + "]").innerHTML = "";
        return;
    }
    else if (k == "ENTER") {
        wordleEnter();
        return;
    }

    if (column >= dataList.words[selectedWordId].word.length)
        return;
    document.getElementById("wordleTable[" + dataList.words[selectedWordId].attempts.length + "," + column + "]").innerHTML = k;
    column++;
}

function wordleEnter() {
    let guess = "";
    for (let i = 0; i < dataList.words[selectedWordId].word.length; i++) {
        let space = document.getElementById("wordleTable[" + dataList.words[selectedWordId].attempts.length + "," + i + "]");
        guess += space.innerHTML;
    }
    if (guess.length < dataList.words[selectedWordId].word.length)
        return;
    column = 0;
    wordleGuess(guess);
    dataList.words[selectedWordId].attempts.push(guess);
    if (guess == dataList.words[selectedWordId].word || dataList.words[selectedWordId].attempts.length >= dataList.words[selectedWordId].word.length + 1)
        closeWordleTable();
}

function wordleGuess(guess) {
    let colors = checkGuess(selectedWordId, guess);
    for (let i = 0; i < dataList.words[selectedWordId].word.length; i++) {
        let space = document.getElementById("wordleTable[" + dataList.words[selectedWordId].attempts.length + "," + i + "]");
        space.style.backgroundColor = colors[i];
    }
}

const puzzleName = 'clothing';
function onlineStart() { //For if the site is on a server (or VSCode Live Server)
    fetch('puzzles/' + puzzleName + '.json')
        .then(response => response.text())
        .then(data => {
            dataList = JSON.parse(data);
            instantiateTable(dataList.size);
            fillTable();
            updateColors();
        })
        .catch(err => {
            console.clear();
            console.error("Error: Cannot Access Online Puzzles");
            alert("NOTICE: CrossWordle is meant to be run on an online website. CrossWordle will now run in offline mode")
            offlineStart();
        });
}
function offlineStart() {
    dataList = JSON.parse('{"size": 11,"words": [{"id": 0,"location": "1,3","direction": "horizontal","word": "JACKET","attempts": []},{"id": 1,"location": "1,3","direction": "vertical","word": "JEANS","attempts": []},{"id": 2,"location": "3,1","direction": "horizontal","word": "FLANNEL","attempts": []},{"id": 3,"location": "5,3","direction": "horizontal","word": "SHOES","attempts": []},{"id": 4,"location": "5,7","direction": "vertical","word": "SHIRT","attempts": []},{"id": 5,"location": "6,7","direction": "horizontal","word": "HAT","attempts": []},{"id": 6,"location": "4,9","direction": "vertical","word": "PANTS","attempts": []}]}');
    instantiateTable(dataList.size);
    fillTable();
    updateColors();
}

function togglePopup(popupName) {
    let popup = document.getElementById(popupName);
    if (popup.style.display == 'none')
        popup.style.display = 'inline';
    else
        popup.style.display = 'none';
}

onlineStart();
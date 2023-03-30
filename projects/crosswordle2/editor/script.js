const mainTable = document.getElementById("mainTable");
const menu = document.getElementById("menu");
const red = "rgb(255, 75, 75)", green = "rgb(108, 255, 89)", orange = "rgb(255, 195, 74)";
var dataList = "";

var words = [];

// Menus
const sizeInput = document.getElementById("size");
const locationInput = document.getElementById("location");
const wordInput = document.getElementById("word");
const directionInput = document.getElementById("direction");
const puzzleFile = document.getElementById("puzzleFile");

directionInput.addEventListener("click", function () {
    if (directionInput.innerHTML == "Horizontal")
        directionInput.innerHTML = "Vertical";
    else
        directionInput.innerHTML = "Horizontal";
});

function instantiateTable(size) {
    for (let i = 0; i < size; i++) {
        mainTable.innerHTML += "<tr id='mainTableRow" + i + "'></tr>"
        for (let j = 0; j < size; j++) {
            document.getElementById("mainTableRow" + i).innerHTML += "<td class='space' id='" + i + "," + j + "'> </td>"
        }
        mainTable.innerHTML += "<br>"
    }
    let spaces = document.getElementsByClassName("space");
    for (let i = 0; i < spaces.length; i++) {
        spaces[i].addEventListener("click", event => {
            locationInput.value = event.target.id;
        });
    }
}

instantiateTable(sizeInput.value);

function getPos(index) {
    let initialPos = locationInput.value.split(",");
    let pos = initialPos;
    if (directionInput.innerHTML == "Horizontal")
        pos[1] = initialPos[1] * 1 + index * 1;
    else
        pos[0] = initialPos[0] * 1 + index * 1;
    return pos;
}

function addWord() {
    let word = wordInput.value.toUpperCase();
    for (let i = 0; i < word.length; i++) {
        let space = null;
        space = document.getElementById(getPos(i)[0] + "," + getPos(i)[1]);
        space.innerHTML = word[i];
        space.style.backgroundColor = "aliceblue"
    }
    let wordObj = {
        "id": dataList.words.length,
        "location": locationInput.value,
        "direction": directionInput.innerHTML.toLowerCase(),
        "word": word,
        "attempts": []
    };
    dataList.words.push(wordObj);
    console.log(dataList);
}

function save() {
    data = JSON.stringify(dataList);
    downloadToFile(data, "CrossWordlePuzzle.json", "text/plain")
}

const downloadToFile = (content, filename, contentType) => {
    const a = document.createElement('a');
    const file = new Blob([content], { type: contentType });

    a.href = URL.createObjectURL(file);
    a.download = filename;
    a.click();

    URL.revokeObjectURL(a.href);
};

function togglePopup(popupName) {
    let popup = document.getElementById(popupName);
    if (popup.style.display == 'none')
        popup.style.display = 'inline';
    else
        popup.style.display = 'none';
}

function wordleGetPos(id, index) {
    let initialPos = dataList.words[id].location.split(",");
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
            let space = document.getElementById(wordleGetPos(dataList.words[i].id, j)[0] + "," + wordleGetPos(dataList.words[i].id, j)[1]);
            space.innerHTML = dataList.words[i].word[j];
            space.className += " " + dataList.words[i].id + " ";
            space.style.backgroundColor = "aliceblue";

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
        }
    }
}

puzzleFile.addEventListener("change", function (e) {
    var reader = new FileReader();
    reader.onload = onReaderLoad;
    reader.readAsText(e.target.files[0]);
});
function onReaderLoad(event) {
    try {
        var obj = JSON.parse(event.target.result);
        dataList = obj;
        loadNewPuzzle();
    }
    catch {
        alert("ERROR: The file you have uploaded is not a Cross Wordle Puzzle!");
    }
}
function loadNewPuzzle() {
    try {
        mainTable.innerHTML = "";
        instantiateTable(dataList.size);
        fillTable();
        console.log(dataList)
    }
    catch {
        console.error("Error loading puzzle")
    }
}

function highlightWord(id) {
    let wordSpaces = getWordSpaces(id);
    for (let i = 0; i < wordSpaces.length; i++)
        wordSpaces[i].style.filter = "brightness(200%)";
}

function unhighlightWord(id) {
    let wordSpaces = getWordSpaces(id);
    for (let i = 0; i < wordSpaces.length; i++)
        wordSpaces[i].style.filter = "brightness(100%)";
}

function getWordSpaces(id) {
    let arr = []
    for (let i = 0; i < dataList.words[id].word.length; i++) {
        arr.push(document.getElementById(getPos(id, i)[0] + "," + getPos(id, i)[1]));
    }
    return arr;
}

function onlineStart() { //For if the site is on a server (or VSCode Live Server)
    fetch('template.json')
        .then(response => response.text())
        .then(data => {
            dataList = JSON.parse(data);
        })
        .catch(err => {
            console.clear();
            console.error("Error: Cannot Access Online Puzzles");
            alert("NOTICE: CrossWordle Editor is meant to be run on an online website. CrossWordle Editor will now run in offline mode")
            offlineStart();
        });
}

onlineStart();
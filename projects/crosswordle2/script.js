const mainTable = document.getElementById("mainTable");
const wordle = document.getElementById("wordle");
const wordleTable = document.getElementById("wordleTable");
var dataList = "";

function instantiateTable(size) {
    for (let i = 0; i < size; i++) {
        mainTable.innerHTML += "<tr id='mainTableRow" + i + "'></tr>"
        for (let j = 0; j < size; j++) {
            document.getElementById("mainTableRow" + i).innerHTML += "<td id='" + i + "," + j + "'> </td>"
        }
    }
}

function getPos(id, index) {
    let initialPos = [dataList.words[id].location[0], dataList.words[id].location[2]];
    if (dataList.words[id].direction == "horizontal")
        initialPos[1] = index + 1;
    else
        initialPos[0] = index + 1;
    return initialPos;
}

function fillTable() {
    for (let i = 0; i < dataList.words.length; i++) {
        for (let j = 0; j < dataList.words[i].word.length; j++) {
            let space = document.getElementById(getPos(i, j)[0] + "," + getPos(i, j)[1]);
            space.innerHTML = dataList.words[i].word[j];
            space.className += " " + dataList.words[i].id + " ";
            if (space.className.indexOf("blankTile") < 0)
                space.className += " blankTile ";
            space.addEventListener("mouseover", event => {
                let spaceClasses = event.target.classList;
                let k = 0;
                while (spaceClasses[k] * 1 == NaN)
                    k++
                highlightWord(spaceClasses[0]);
            });
            space.addEventListener("mouseout", event => {
                let spaceClasses = event.target.classList;
                let k = 0;
                while (spaceClasses[k] * 1 == NaN)
                    k++
                unhighlightWord(spaceClasses[0]);
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
        wordSpaces[i].style.backgroundColor = "rgba(200, 255, 255, 0.9)";
}

function unhighlightWord(id) {
    let wordSpaces = getWordSpaces(id);
    for (let i = 0; i < wordSpaces.length; i++)
        wordSpaces[i].style.backgroundColor = "aliceblue";
}

function selectWord(id) {

}

function showWordleTable(wordId) {
    mainTable.style.display = "none";
    wordle.style.display = "inline";

    wordleTable.innerHTML = "";
    for (let i = 0; i < dataList.words[wordId].word.length + 1; i++) {
        wordleTable.innerHTML += "<tr id='wordleTableRow" + i + "'></tr>"
        for (let j = 0; j < dataList.words[wordId].word.length; j++) {
            document.getElementById("wordleTableRow" + i).innerHTML += "<td id='wordleTable[" + i + "," + j + "]'></td";
        }
    }
}

function onlineStart() { //For if the site is on a server (or VSCode Live Server)
    fetch('puzzles/word.json')
        .then(response => response.text())
        .then(data => {
            dataList = JSON.parse(data);
            instantiateTable(dataList.size);
            fillTable();

            //showWordleTable(1);
        })
        .catch(err => {
            //console.clear();
            console.error("Error: Cannot Access Online Puzzles");
            alert("NOTICE: CrossWordle is meant to be run on an online website. CrossWordle will now run in offline mode")
            //offlineStart();
        });
}

onlineStart();
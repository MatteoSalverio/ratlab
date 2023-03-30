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
    words.push(
        [
            ["id", words.length],
            ["location", locationInput.value],
            ["direction", directionInput.innerHTML.toLowerCase()],
            ["word", word],
            ["attempts", []]
        ]
    );
    console.log(words)
}

function save() {
    data = '{"size":' + sizeInput.value + ', "words": [';
    for (let i = 0; i < words.length; i++) {
        data += "{";
        for (let j = 0; j < 4; j++)
            data += '"' + words[i][j][0] + '": ' + '"' + words[i][j][1] + '",';
        data += '"' + words[i][4][0] + '": ' + "[]";
        data += "}";
        if (i < words.length - 1)
            data += ",";
    }
    data += ']}';
    console.log(data)
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
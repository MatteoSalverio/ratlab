var points = 0;
var level = 1;
const pointsDisplay = document.getElementById("pointsDisplay");

function displayPoints() {
    let str = points + '';
    let revStr = [];
    let newStr = "";
    let finalStr = "";
    for (let i = str.length - 1; i >= 0; i--) {
        revStr.push(str[i]);
    }
    for (let i = 0; i < revStr.length; i++) {
        newStr += revStr[i];
        if ((i + 1) % 3 == 0 && i != revStr.length - 1)
            newStr += ",";
    }
    for (let i = newStr.length - 1; i >= 0; i--) {
        finalStr += newStr[i];
    }
    pointsDisplay.innerHTML = finalStr + " Cookies";
}

function addPoints(amount) {
    points += amount;
}

function clicked() {
    addPoints(1);
    displayPoints();
}

setInterval(function() {
    addPoints(level);
    displayPoints();
}, 1000);

displayPoints();
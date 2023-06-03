const desktop = document.getElementById("desktop");
const taskbar = document.getElementById("taskBar");
const date = document.getElementById("date");
const time = document.getElementById("time");
const windows = document.getElementById("windows");

function toggleElement(id) {
    if (document.getElementById(id).style.display == "none")
        document.getElementById(id).style.display = "inline";
    else
        document.getElementById(id).style.display = "none";
}

function updateTime() {
    let newDate = new Date();
    //console.log(newDate.getTime())
    date.innerHTML = (newDate.getMonth() + 1) + "/" + newDate.getDate() + "/" + (newDate.getFullYear() + "").substring(2, 4);
    let min = newDate.getMinutes();
    if ((min + "").length < 2)
        min = "0" + min;
    let h = newDate.getHours();
    let p = "AM";
    if (h > 12) {
        h -= 12;
        p = "PM";
    }
    time.innerHTML = h + ":" + min + " " + p;
}

function updateWindowPosition() {
    if (mousedown) {
        let w = document.getElementById(activeWindow);
        w.style.left = (mousePos.x) + "px";
        w.style.top = (mousePos.y) + "px";
    }
}

setInterval(() => {
    updateTime();
    updateWindowPosition();
}, 1);

var mousedown = false;
var activeWindow = "";
var mousePos = { x: 0, y: 0 };
function openWindow(id) {
    if (document.getElementById(id) != null) {
        toggleElement(id);
        return;
    }
    let temp = "";
    temp += "<div class='window' id='" + id + "' style='display: inline;'>";
    temp += '<div class="controls" id="' + id + '_controls"' + ' onclick="clickControls(' + "'" + id + "'" + ')">';
    temp += '<div class="controlBtns">';
    temp += '<button class="controlsBtn closeBtn" onclick="' + "closeWindow('" + id + "')" + '">X</button>';
    temp += '<button class="controlsBtn minMaxBtn" onclick="' + "maximizeWindow('" + id + "')" + '">~</button>';
    temp += '</div></div>';
    temp += '<iframe class="windowFrame" src="apps/' + id + '.html" width="100%" height="100%"></iframe>'
    windows.innerHTML += temp;
    let controls = document.getElementById(id + "_controls");
    console.log(controls)
    controls.addEventListener("mousedown", function (e) {
        mousedown = true;
        activeWindow = id;
        controls.parentElement.style.transform = "translate(-50%, 0)";
    });
    controls.addEventListener("mouseup", function () {
        mousedown = false;
    });
}

function clickControls(id) {
    //let controls = document.getElementById(id + "_controls");

}

document.addEventListener("mousemove", function (e) {
    mousePos.x = e.clientX;
    mousePos.y = e.clientY;
    console.log(mousePos.x)
});

function minimizeWindow(id) {
    document.getElementById(id).style.display = 'none';
}

function closeWindow(id) {
    windows.removeChild(document.getElementById(id))
}

function maximizeWindow(id) {
    let elem = document.getElementById(id);
    if (elem.style.width != "100%") {
        elem.style.margin = "0px";

        elem.style.width = "100%";
        elem.style.height = (desktop.clientHeight - taskbar.clientHeight - 30) + "px";

        elem.style.transform = "translate(-50%, 0px)";
        elem.style.top = "0px";

        elem.style.borderRadius = "0px";
        elem.firstChild.style.borderRadius = "0px";
        elem.lastChild.style.borderRadius = "0px";
    }
    else {
        elem.style.width = "70%";
        elem.style.height = "70%";

        elem.style.transform = "translate(-50%, -50%)";
        elem.style.top = "45%";

        elem.style.borderRadius = "15px";
        elem.firstChild.style.borderRadius = "15px 15px 0px 0px";
        elem.lastChild.style.borderRadius = "0px 0px 15px 15px";
    }
}

openWindow("notes");
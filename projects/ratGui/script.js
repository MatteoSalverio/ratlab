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
    /*let part = "AM";
    if (newDate.getTime() > 43200000)
        part = "PM";*/
    time.innerHTML = newDate.getHours() + ":" + min// + " " + part;
}

setInterval(() => {
    updateTime();
}, 1);

function openWindow(id) {
    if (document.getElementById(id) != null) {
        toggleElement(id);
        return;
    }
    let temp = "";
    temp += "<div class='window' id='" + id + "' style='display: inline;'>";
    temp += '<div class="controls">';
    temp += '<div class="controlBtns">';
    temp += '<button class="controlsBtn closeBtn" onclick="' + "closeWindow('" + id + "')" + '">X</button>';
    temp += '<button class="controlsBtn minMaxBtn" onclick="' + "maximizeWindow('" + id + "')" + '">~</button>';
    temp += '</div></div>';
    temp += '<iframe class="windowFrame" src="apps/' + id + '.html" width="100%" height="100%"></iframe>'
    windows.innerHTML += temp;
}

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
}

openWindow("browser");
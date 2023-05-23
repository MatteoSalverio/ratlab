const desktop = document.getElementById("desktop");
const date = document.getElementById("date");
const time = document.getElementById("time");

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
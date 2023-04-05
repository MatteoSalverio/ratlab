const userInput = document.getElementById("userInput");
const body = document.getElementById("body");
var mId = 0;

userInput.addEventListener("keydown", function (e) {
    let k = e.key;
    if (k == "Enter") {
        submit(userInput.value);
        userInput.value = "";
    }
});

function submit(text) {
    body.innerHTML += "<p class='userMessage' id='message" + mId + "'>" + text + "</p>";
    mId++;
    body.innerHTML += "<p class='response'>" + getResponse(text) + "</p>";
}

function getResponse(text) {
    return ("Hello!");
}

function resetPage() {
    let messages = document.getElementsByClassName("userMessage");
    let aiMessages = document.getElementsByClassName("response");
    while (messages.length > 0)
        messages[0].parentNode.removeChild(messages[0]);
    while (aiMessages.length > 0)
        aiMessages[0].parentNode.removeChild(aiMessages[0]);
}
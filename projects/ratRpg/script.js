// Using Rat Lab V2 Engine

var testScene = new scene("test");
var testScene2 = new scene("test2");
loadScene(testScene);

// Create background
for (let i = -50; i < 50; i++) {
    for (let j = -50; j < 50; j++) {
        new backgroundTile(testScene, i * 31, j * 31, 32, 32, 'assets/textures/groundTile.png', 16, 16, 0);
    }
}

let player = new spriteObj(testScene, 500, 300, 96, 96, 0, 'assets/textures/RatRight.png', 32, 32, 4, true);
player.hitBoxOffset = 10;

let b = new box(testScene, 100, 330, 40, 40, 0, "lime", true);
let b2 = new box(testScene, 100, 100, 40, 40, 0, "aqua", false);

b.applyForce("horizontal", 5);

function processMovement(delta) {
    let speed = playerSpeed;
    if (getKey("W")) {// W
        player.move('up', speed * delta);
    }
    if (getKey("A")) { // A
        player.move('left', speed * delta);
        player.dir = 'left';
        player.texture.src = "assets/textures/RatLeft.png";
    }
    if (getKey("S")) // S
        player.move('down', speed * delta);
    if (getKey("D")) { // D
        player.move('right', speed * delta);
        player.dir = 'right';
        player.texture.src = "assets/textures/RatRight.png";
    }
    moveCameraToPlayer();
}

// Update Function:
function update(delta) { // Runs every frame
    processMovement(delta);
}

document.addEventListener("keydown", function (e) {
    if (e.key == "q") {
        console.log("Changing Scene...")
        if (currentScene.id == "test") {
            loadScene(testScene2);
            player.moveToScene(testScene2);
        }
        else {
            loadScene(testScene);
            player.moveToScene(testScene);
        }
    }
});
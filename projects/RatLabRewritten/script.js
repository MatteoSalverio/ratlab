// Rat Lab Rewritten - Copyright Rat Lab 2023

const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

function setWindowSize() {
    let w = window.innerWidth,
        h = window.innerHeight;
    canvas.width = w * 0.8;
    canvas.height = h * 0.8;
}
setWindowSize();

window.addEventListener('resize', setWindowSize());

ctx.imageSmoothingEnabled = false;

var clock = 0;
var objs = [];

class obj {
    constructor(texturePath, resolutionX, resolutionY, frameCount, x, y, w, h, collisionType, isStatic = false) {

        this.texturePath = texturePath;
        this.resolutionX = resolutionX;
        this.resolutionY = resolutionY;
        this.texture = new Image(this.resolutionX, this.resolutionY);
        this.texture.src = this.texturePath;
        this.frameCount = frameCount;
        this.dir = 'right';
        this.moving = false;

        this.x = x;
        this.y = y;
        this.w = w;
        this.h = h;

        this.hitBoxOffset = 15;
        this.hitBox = {
            top: this.y + this.hitBoxOffset,
            bottom: this.y + this.h - this.hitBoxOffset * 2,
            left: this.x + this.hitBoxOffset,
            right: this.x + this.w - this.hitBoxOffset * 2
        }

        this.collisionType = collisionType;
        this.isStatic = isStatic;

        this.animation = {
            frame: 1,
            frameCount: this.frameCount,
            rate: 1
        }

        objs.push(this);
    }

    update() {
        this.hitBox = {
            top: this.y + this.hitBoxOffset,
            bottom: this.y + this.h - this.hitBoxOffset * 2,
            left: this.x + this.hitBoxOffset,
            right: this.x + this.w - this.hitBoxOffset * 2
        }
    }

    animate() {
        this.draw();
        if (clock % 2 == 0) {
            if (this.animation.frame >= this.animation.frameCount)
                this.animation.frame = 1;
            else
                this.animation.frame++;
        }
    }

    draw() {
        let srcRect = { x: this.resolutionX * (this.animation.frame - 1), y: 0, width: this.resolutionX, height: this.resolutionY };
        let destRect = { x: this.x, y: this.y, width: this.w, height: this.h };
        ctx.drawImage(this.texture, srcRect.x, srcRect.y, srcRect.width, srcRect.height, this.x, this.y, destRect.width, destRect.height);
        // Draw the hitbox:
        ctx.fillStyle = "rgba(255, 255, 255, 0.2)";
        ctx.fillRect(this.hitBox.left, this.hitBox.top, this.w - this.hitBoxOffset * 2, this.h - this.hitBoxOffset * 2);
    }
}

function redraw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for (let i = 0; i < objs.length; i++)
        objs[i].draw();
}

function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for (let i = 0; i < objs.length; i++)
        objs[i].animate();
}

let player = new obj('assets/textures/RatRight.png', 32, 32, 4, 10, 10, 96, 96, false, false);

let keys = [];
document.addEventListener('keydown', function (e) {
    let k = e.keyCode;
    keys[k] = true;
    player.moving = true;
});
document.addEventListener('keyup', function (e) {
    let k = e.keyCode;
    keys[k] = false;
    player.moving = false;
    for (let i = 0; i < keys.length; i++) {
        if (keys[i]) {
            player.moving = true;
            break;
        }
    }
    if (!player.moving)
        player.animation.frame = 1;
});
function processMovement(delta) {
    let speed = 250;
    if (keys[87]) // W
        player.y -= speed * delta;
    if (keys[65]) { // A
        player.x -= speed * delta;
        player.dir = 'left';
        player.texture.src = "assets/textures/RatLeft.png";
    }
    if (keys[83]) // S
        player.y += speed * delta;
    if (keys[68]) { // D
        player.x += speed * delta;
        player.dir = 'right';
        player.texture.src = "assets/textures/RatRight.png";
    }
}

let lastTime = 0;
function update(currentTime) {
    const deltaTime = (currentTime - lastTime) / 1000;
    lastTime = currentTime;

    // Update animation logic here using delta time
    for (let i = 0; i < objs.length; i++) {
        objs[i].update();
    }
    processMovement(deltaTime);
    redraw();

    requestAnimationFrame(update);
}
requestAnimationFrame(update);

setInterval(function () {
    if (player.moving)
        animate();
}, 100);
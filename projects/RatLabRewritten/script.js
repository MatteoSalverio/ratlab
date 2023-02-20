// Rat Lab Rewritten - Copyright Rat Lab 2023

const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
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

        this.x = x;
        this.y = y;
        this.w = w;
        this.h = h;

        this.collisionType = collisionType;
        this.isStatic = isStatic;

        this.animation = {
            frame: 1,
            frameCount: this.frameCount,
            rate: 1
        }

        objs.push(this);
    }

    animate() {
        let srcRect = { x: this.resolutionX * (this.animation.frame - 1), y: 0, width: this.resolutionX, height: this.resolutionY };
        let destRect = { x: this.x, y: this.y, width: this.w, height: this.h };
        ctx.drawImage(this.texture, srcRect.x, srcRect.y, srcRect.width, srcRect.height, destRect.x, destRect.y, destRect.width, destRect.height);
        if (clock % 2 == 0) {
            if (this.animation.frame >= this.animation.frameCount)
                this.animation.frame = 1;
            else
                this.animation.frame++;
        }
    }

    draw() {
        ctx.drawImage(this.texture, this.x, this.y, this.w, this.h);
    }
}

function redraw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for (let i = 0; i < objs.length; i++)
        objs[i].animate();
}

let test = new obj('assets/textures/rat.png', 32, 32, 4, 10, 10, 256, 256, false, false);

/*let img = new Image(16, 16);
img.src = 'assets/textures/rat.png';
img.onload = function () {
    let srcRect = { x: 0, y: 0, width: 32, height: img.height * 2 };
    let destRect = { x: 0, y: 0, width: 32, height: img.height * 2 };
    ctx.drawImage(img, srcRect.x, srcRect.y, srcRect.width, srcRect.height, destRect.x, destRect.y, destRect.width, destRect.height);
}
let frames = [1, 4];
function animateRat() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    let srcRect = { x: frames[0] * 32 - 32, y: 0, width: 32, height: img.height * 2 };
    let destRect = { x: 0, y: 0, width: 256, height: 256 };
    ctx.drawImage(img, srcRect.x, srcRect.y, srcRect.width, srcRect.height, destRect.x, destRect.y, destRect.width, destRect.height);
    if (frames[0] >= frames[1])
        frames[0] = 1;
    else
        frames[0]++;
}

setInterval(function () {
    animateRat();
}, 100);*/

let lastTime = 0;
function animate(currentTime) {
    const deltaTime = (currentTime - lastTime) / 1000;
    lastTime = currentTime;

    // Update animation logic here using delta time
    redraw();

    requestAnimationFrame(animate);
}
requestAnimationFrame(animate);
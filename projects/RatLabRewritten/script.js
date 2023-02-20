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

let friction = 0.01;

class obj {
    constructor(x, y, w, h, movable = false) {
        this.x = x;
        this.y = y;
        this.w = w;
        this.h = h;

        this.hitBoxOffset = 0;
        this.hitBox = {
            top: this.y + this.hitBoxOffset,
            bottom: this.y + this.h - this.hitBoxOffset * 2,
            left: this.x + this.hitBoxOffset,
            right: this.x + this.w - this.hitBoxOffset * 2
        }

        this.movable = movable;

        this.forces = {
            horizontal: 0,
            vertical: 0
        }

        this.index = objs.length;
        objs.push(this);
    }

    physicsUpdate() {
        if ((!this.colliderCheck('left') && this.forces.horizontal < 0) || (!this.colliderCheck('right') && this.forces.horizontal > 0))
            this.x += this.forces.horizontal;
        if ((!this.colliderCheck('up') && this.forces.vertical < 0) || (!this.colliderCheck('down') && this.forces.vertical > 0))
            this.y += this.forces.vertical;
        if (this.forces.horizontal > 0)
            this.forces.horizontal -= friction;
        else if (this.forces.horizontal < 0)
            this.forces.horizontal += friction;
        if (this.forces.vertical > 0)
            this.forces.vertical -= friction;
        else if (this.forces.vertical < 0)
            this.forces.vertical += friction;
        this.forces.horizontal = Math.round(this.forces.horizontal * 100) / 100
        this.forces.vertical = Math.round(this.forces.vertical * 100) / 100
    }

    update() {
        this.hitBox = {
            top: this.y + this.hitBoxOffset * 3,
            bottom: this.y + this.h - this.hitBoxOffset * 1.25,
            left: this.x + this.hitBoxOffset,
            right: this.x + this.w - this.hitBoxOffset * 2
        }
    }

    draw() { }

    colliderCheck(dir) {
        for (let i = 0; i < objs.length; i++) {
            if (i == this.index)
                continue;
            let o = objs[i];
            let space = 5; // Allows you to slide on surfaces
            if (dir == 'up') {
                if (this.hitBox.top <= o.hitBox.bottom && this.hitBox.bottom >= o.hitBox.top + space) {
                    if (this.hitBox.right >= o.hitBox.left + space && this.hitBox.left <= o.hitBox.right - space)
                        return true;
                }
            }
            else if (dir == 'down') {
                if (this.hitBox.bottom >= o.hitBox.top && this.hitBox.top <= o.hitBox.bottom - space) {
                    if (this.hitBox.right >= o.hitBox.left + space && this.hitBox.left <= o.hitBox.right - space)
                        return true;
                }
            }
            else if (dir == 'left') {
                if (this.hitBox.left <= o.hitBox.right && this.hitBox.right >= o.hitBox.left + space) {
                    if (this.hitBox.bottom >= o.hitBox.top + space && this.hitBox.top <= o.hitBox.bottom - space)
                        return true;
                }
            }
            else if (dir == 'right') {
                if (this.hitBox.right >= o.hitBox.left && this.hitBox.left <= o.hitBox.right - 2) {
                    if (this.hitBox.bottom >= o.hitBox.top + space && this.hitBox.top <= o.hitBox.bottom - space)
                        return true;
                }
            }
        }
        return false;
    }

    move(dir, speed) {
        speed *= 1;
        if (!this.colliderCheck(dir)) {
            if (dir == 'up')
                this.y -= speed;
            else if (dir == 'down')
                this.y += speed;
            else if (dir == 'left')
                this.x -= speed;
            else if (dir == 'right')
                this.x += speed;
            else
                console.error("Error: Unknown direction '" + dir + "'");
        }
    }

    applyForce(axis, magnitude) {
        magnitude *= 1;
        if (!this.movable)
            return;
        if (axis == 'horizontal') {
            this.forces.horizontal += magnitude;
            console.log('e')
        }
        else if (axis == 'vertical')
            this.forces.vertical += magnitude;
        else
            console.error("Error: Unknown axis '" + axis + "'");
    }
}

class box extends obj {
    constructor(x, y, w, h, color, movable = false) {
        super(x, y, w, h, movable);
        this.color = color;
        this.hitBoxOffset = 0;
        this.hitBox = {
            top: this.y + this.hitBoxOffset,
            bottom: this.y + this.h - this.hitBoxOffset * 2,
            left: this.x + this.hitBoxOffset,
            right: this.x + this.w - this.hitBoxOffset * 2
        }
    }

    draw() {
        ctx.fillStyle = this.color;
        ctx.fillRect(this.x, this.y, this.w, this.h);
    }

    animate() {
        this.draw();
    }
}

class spriteObj extends obj {
    constructor(x, y, w, h, texturePath, resolutionX, resolutionY, frameCount, movable = false) {
        super(x, y, w, h, movable);
        this.texturePath = texturePath;
        this.resolutionX = resolutionX;
        this.resolutionY = resolutionY;
        this.texture = new Image(this.resolutionX, this.resolutionY);
        this.texture.src = this.texturePath;
        this.frameCount = frameCount;
        this.dir = 'right';
        this.moving = false;

        this.hitBoxOffset = 10;

        this.animation = {
            frame: 1,
            frameCount: this.frameCount,
            rate: 1
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
    }
}

function redraw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for (let i = 0; i < objs.length; i++)
        objs[i].draw();
    player.draw();
}

function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for (let i = 0; i < objs.length; i++)
        objs[i].animate();
}

let player = new spriteObj(100, 100, 96, 96, 'assets/textures/RatRight.png', 32, 32, 4, false);

let testBox = new box(200, 200, 40, 40, 'rgba(0, 255, 128, 1)', true);
testBox.applyForce('horizontal', 2);
testBox.applyForce('vertical', -1);

let walls = {
    top: new box(0, 0, canvas.width, 20, 'rgb(0, 128, 255)'),
    bottom: new box(0, canvas.height - 20, canvas.width, 20, 'rgb(0, 128, 255)'),
    left: new box(0, 0, 20, canvas.height, 'rgb(0, 128, 255)'),
    right: new box(canvas.width - 20, 0, 20, canvas.height, 'rgb(0, 128, 255)'),
}

let keys = [];
document.addEventListener('keydown', function (e) {
    let k = e.keyCode;
    keys[k] = true;
    if (keys[87] || keys[65] || keys[83] || keys[68])
        player.moving = true;
});
document.addEventListener('keyup', function (e) {
    let k = e.keyCode;
    keys[k] = false;
    player.moving = false;
    if (keys[87] || keys[65] || keys[83] || keys[68])
        player.moving = true;
    else {
        player.moving = false;
        player.animation.frame = 1;
    }
});
function processMovement(delta) {
    let speed = 250;
    if (keys[87]) // W
        player.move('up', speed * delta);
    if (keys[65]) { // A
        player.move('left', speed * delta);
        player.dir = 'left';
        player.texture.src = "assets/textures/RatLeft.png";
    }
    if (keys[83]) // S
        player.move('down', speed * delta);
    if (keys[68]) { // D
        player.move('right', speed * delta);
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
        objs[i].physicsUpdate();
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
// Rat Lab Rewritten - Copyright Rat Lab 2023
// First Version of the Rat Lab Engine

const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

function setWindowSize() {
    let w = window.innerWidth,
        h = window.innerHeight;
    canvas.width = w * 0.9;
    canvas.height = h * 0.8;
}
setWindowSize();

window.addEventListener('resize', setWindowSize());

ctx.imageSmoothingEnabled = false;

var objs = []; // All objects in the scene are contained here
var backgroundObjs = []; // All background objects, always drawn first

let friction = 0.01; // Determines how fast things will lose force
let gravity = 0.25; // Force of Gravity

var playerSpeed = 300;

var camera = {
    x: 0,
    y: 0
}

// Difficulty:
var gap = 350;
var heightGap = 500;
var speed = 4;
var dead = false;

class obj { // General class, mainly for inheritance
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
        // Gravitational Acceleration
        if (this.colliderCheck('down') && this.forces.vertical > 0)
            this.forces.vertical = 0;
        else if (!this.colliderCheck('down') && this.movable)
            this.forces.vertical += gravity;

        // Apply Horizontal Forces
        if (this.forces.horizontal > 0)
            this.move('right', this.forces.horizontal);
        else if (this.forces.horizontal < 0)
            this.move('left', this.forces.horizontal * -1);
        // Apply Vertical Forces
        if (this.forces.vertical > 0)
            this.move('down', this.forces.vertical);
        else if (this.forces.vertical < 0)
            this.move('up', this.forces.vertical * -1);
        // Apply Horizontal Friction
        if (this.forces.horizontal > 0)
            this.forces.horizontal -= friction;
        else if (this.forces.horizontal < 0)
            this.forces.horizontal += friction;
        // Apply Vertical Friction
        if (this.forces.vertical > 0)
            this.forces.vertical -= friction;
        else if (this.forces.vertical < 0)
            this.forces.vertical += friction;
        // Round the forces
        this.forces.horizontal = Math.round(this.forces.horizontal * 100) / 100
        this.forces.vertical = Math.round(this.forces.vertical * 100) / 100
    }

    update() {
        // Updates hitbox position:
        this.hitBox = {
            top: this.y + this.hitBoxOffset * 3 - camera.y,
            bottom: this.y + this.h - this.hitBoxOffset * 2 - camera.y,
            left: this.x + this.hitBoxOffset - camera.x,
            right: this.x + this.w - this.hitBoxOffset * 2 - camera.x
        }
    }

    draw() { }

    colliderCheck(dir) {
        for (let i = 0; i < objs.length; i++) {
            if (i == this.index) // Makes sure objects won't collide with themselves
                continue;
            let o = objs[i];
            let space = 5; // Allows you to slide on surfaces
            if (dir == 'up') {
                if (this.hitBox.top <= o.hitBox.bottom && this.hitBox.bottom >= o.hitBox.top + space) {
                    if (this.hitBox.right >= o.hitBox.left + space && this.hitBox.left <= o.hitBox.right - space)
                        return o.index;
                }
            }
            else if (dir == 'down') {
                if (this.hitBox.bottom >= o.hitBox.top && this.hitBox.top <= o.hitBox.bottom - space) {
                    if (this.hitBox.right >= o.hitBox.left + space && this.hitBox.left <= o.hitBox.right - space)
                        return o.index;
                }
            }
            else if (dir == 'left') {
                if (this.hitBox.left <= o.hitBox.right && this.hitBox.right >= o.hitBox.left + space) {
                    if (this.hitBox.bottom >= o.hitBox.top + space && this.hitBox.top <= o.hitBox.bottom - space)
                        return o.index;
                }
            }
            else if (dir == 'right') {
                if (this.hitBox.right >= o.hitBox.left && this.hitBox.left <= o.hitBox.right - space) {
                    if (this.hitBox.bottom >= o.hitBox.top + space && this.hitBox.top <= o.hitBox.bottom - space)
                        return o.index;
                }
            }
        }
        return false;
    }

    move(dir, speed) {
        speed *= 1;
        let strength = 0.05; // Strength of push force
        if (dir == 'up') {
            if (!this.colliderCheck('up')) {
                this.y -= speed;
            }
            else {
                objs[this.colliderCheck('up')].applyForce('vertical', -strength); // Applies a pushing force to the interacting object
                this.applyForce('vertical', strength * 0.8); // Applies a force back on the main object
            }
        }
        else if (dir == 'down') {
            if (!this.colliderCheck('down')) {
                this.y += speed;
            }
            else {
                objs[this.colliderCheck('down')].applyForce('vertical', strength);
                this.applyForce('vertical', -strength * 0.8);
            }
        }
        else if (dir == 'right') {
            if (!this.colliderCheck('right')) {
                this.x += speed;
            }
            else {
                objs[this.colliderCheck('right')].applyForce('horizontal', strength);
                this.applyForce('horizontal', -strength * 0.8);
            }
        }
        else if (dir == 'left') {
            if (!this.colliderCheck('left')) {
                this.x -= speed;
            }
            else {
                objs[this.colliderCheck('left')].applyForce('horizontal', -strength);
                this.applyForce('horizontal', strength * 0.8);
            }
        }
    }

    applyForce(axis, magnitude) {
        magnitude *= 1;
        if (!this.movable)
            return;
        if (axis == 'horizontal')
            this.forces.horizontal += magnitude;
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
        ctx.fillRect(this.x - camera.x, this.y - camera.y, this.w, this.h);
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

        this.hitBoxOffset = 0;

        this.animation = {
            frame: 1,
            frameCount: this.frameCount,
            rate: 1
        }
    }

    animate() {
        this.draw();
        if (this.animation.frame >= this.animation.frameCount)
            this.animation.frame = 1;
        else
            this.animation.frame++;
    }

    draw() {
        //ctx.fillRect(this.hitBox.left, this.hitBox.top, this.hitBox.right - this.hitBox.left, this.hitBox.bottom - this.hitBox.top); // Draw Hitboxes
        let srcRect = { x: this.resolutionX * (this.animation.frame - 1), y: 0, width: this.resolutionX, height: this.resolutionY };
        let destRect = { x: this.x, y: this.y, width: this.w, height: this.h };
        ctx.drawImage(this.texture, srcRect.x, srcRect.y, srcRect.width, srcRect.height, this.x - camera.x, this.y - camera.y, destRect.width, destRect.height);
    }
}

function sortByY(objects) { // Sorts objects in order of their y position
    const sortedObjects = [...objects];
    sortedObjects.sort((a, b) => a.y - b.y);
    return sortedObjects;
}

function redraw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for (let i = 0; i < backgroundObjs.length; i++)
        backgroundObjs[i].draw();
    let sorted = sortByY(objs); // Allows objects to be drawn in order of their y position to create a 3d effect
    for (let i = 0; i < sorted.length; i++)
        sorted[i].draw();
}

function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for (let i = 0; i < objs.length; i++) {
        if (objs[i].index == player.index)
            continue;
        objs[i].animate();
    }
}

function die() {
    speed = 0;
    dead = true;
}

let canJump = true;
let keys = [];
document.addEventListener('keydown', function (e) {
    if (dead)
        return;
    let k = e.keyCode;
    keys[k] = true;

    if (k == 87 || k == 32) {
        if (canJump)
            player.applyForce('vertical', -11);
        canJump = false;
    }
});
document.addEventListener('keyup', function (e) {
    canJump = true;
    let k = e.keyCode;
    keys[k] = false;
});
function processMovement() {
    camera.x = player.x - canvas.width / 2 + player.w / 2;
    //camera.y = player.y - canvas.height / 2 + player.h / 2;
}

let lastTime = 0;
function update() {

    if (player.colliderCheck('right') || player.colliderCheck('up') || player.colliderCheck('down') || player.colliderCheck('left') || player.y < 0 || player.y + player.h > canvas.height)
        die();
    player.x += speed;
    updatePipes();

    // Update animation logic here using delta time
    for (let i = 0; i < objs.length; i++) {
        objs[i].update();
        objs[i].physicsUpdate();
    }
    processMovement();
    redraw();

    requestAnimationFrame(update);
}
requestAnimationFrame(update);

setInterval(function () {
    animate();
}, 100);

// INSTANTIATION:

let player = new spriteObj(500, 300, 96, 96, 'assets/textures/RatRight.png', 32, 32, 4, true);
player.hitBoxOffset = 10;

// PIPES:
var lastPipeHieght = 0;
function getRandomPipeHeight() {
    lastPipeHieght = canvas.height - Math.floor(Math.random() * 300) - 50;
    return lastPipeHieght;
}
let startingPos = 1000;
var pipes = []
let amountOfPipeSets = 1;
for (let i = 0; i < 10; i++) {
    pipes.push(new spriteObj(startingPos + gap * amountOfPipeSets, getRandomPipeHeight(), 64, 1024, 'assets/textures/pipe.png', 32, 512, 0, false));
    pipes.push(new spriteObj(startingPos + gap * amountOfPipeSets, lastPipeHieght - canvas.height - heightGap, 64, 1024, 'assets/textures/pipeFlipped.png', 32, 512, 0, false));
    amountOfPipeSets++;
}
let greatestX = 0;
function updatePipes() {
    for (let i = 0; i < pipes.length; i++) {
        if (pipes[i].x + pipes[i].w - camera.x < 0) {
            if (pipes[i].texturePath == 'assets/textures/pipe.png') {
                pipes[i].y = getRandomPipeHeight();
                for (let j = 0; j < pipes.length; j++) {
                    if (pipes[j].x > greatestX)
                        greatestX = pipes[j].x;
                }
            }
            else
                pipes[i].y = lastPipeHieght - canvas.height - 500;
            pipes[i].x = greatestX + gap;
        }
    }
}
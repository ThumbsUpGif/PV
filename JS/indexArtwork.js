/*
“The structure 'world,' with its double movement of sedimentation and spontaneity, is at the center of consciousness.”
Maurice Merleau-Ponty
*/

let river = [];
let facet = true;
let bouncers = [];
let mouseBouncer;
let distance = 160;
let sensitivity = 80;

function setup() {
    var canvasDiv = document.getElementById('hero-artwork');
    var width = canvasDiv.offsetWidth;
    var height = canvasDiv.offsetHeight;
    var sketchCanvas = createCanvas(width, height);
    console.log(sketchCanvas);
    sketchCanvas.parent("hero-artwork");

    // Create apexes that will form the facets
    for (let i = 0; i < 120; i++) {
        river.push(new Apex());
    }

    // Create three bouncing particles to interact with particles and create facets
    for (let i = 0; i < 3; i++) {
        bouncers.push(new Bouncer());
    }

    // Create a mouse-following bouncer
    mouseBouncer = new MouseBouncer();

}

function draw() {
    background("#eeeeee");

    // Update and display river particles
    for (let pn1 of river) {
        pn1.update();
        pn1.display();
    }

    // Create facets
    createFacets();

    // Display and update the bouncers
    for (let bouncer of bouncers) {
        bouncer.update();
        bouncer.display();
    }

    // Update and display the mouse bouncer
    mouseBouncer.update();
    mouseBouncer.display();
}

function createFacets() {
    for (let i = 0; i < river.length - 2; i++) {
        let pn1 = river[i];
        for (let j = i + 1; j < river.length - 1; j++) {
            let pn2 = river[j];
            if (dist(pn1.x, pn1.y, pn2.x, pn2.y) < distance) {
                for (let k = j + 1; k < river.length; k++) {
                    let pn3 = river[k];
                    if (isValidFacet(pn1, pn2, pn3)) {
                        drawFacet(pn1, pn2, pn3);
                    }
                }
            }
        }
    }
}

function isValidFacet(pn1, pn2, pn3) {
    return (
        dist(pn3.x, pn3.y, pn2.x, pn2.y) < distance &&
        (bouncers.some(bouncer => 
            dist(pn3.x, pn3.y, bouncer.x + sensitivity, bouncer.y) < sensitivity &&
            dist(pn1.x, pn1.y, bouncer.x, bouncer.y) < 100
        ) ||
        dist(pn3.x, pn3.y, mouseBouncer.x + sensitivity, mouseBouncer.y) < sensitivity &&
        dist(pn1.x, pn1.y, mouseBouncer.x, mouseBouncer.y) < 100)
    );
}

function drawFacet(pn1, pn2, pn3) {
    if (facet) {
        stroke(255, 1);
        fill(pn3.c.levels[0], pn3.c.levels[1], pn3.c.levels[2], 97);
    } else {
        noFill();
        strokeWeight(1);
        stroke(0, 20);
    }

    // facets are simple triangles
    beginShape();
    vertex(pn1.x, pn1.y);
    vertex(pn2.x, pn2.y);
    vertex(pn3.x, pn3.y);
    endShape(CLOSE);
}

class Apex {
    constructor() {
        this.x = random(width);
        this.y = random(height);
        this.r = random(1, 3);
        this.speed = random(0.08, 0.6);
        this.c = this.randomColor();
    }

    randomColor() {
        const colors = ["#FF2E82", "#E2E269", "#2AF5F8", "#FF9F75"];
        return color(random(colors));
    }

    display() {
        push();
        noStroke();
        fill(this.c);
        ellipse(this.x, this.y, this.r, this.r);
        pop();
    }

    update() {
        this.x += this.speed;
        this.y += 0.001;

        if (this.x > width) this.x = random(-1, -20);
        if (this.y > height) this.y = -1;
    }
}

class Bouncer {
    constructor() {
        this.x = random(width);
        this.y = random(height);
        this.r = 2;
        this.xspeed = 1.6;
        this.yspeed = 0.8;
    }

    display() {
        push();
        fill(255, 70);
        noStroke();
        circle(this.x, this.y, this.r);
        pop();
    }

    update() {
        this.x += this.xspeed;
        this.y += this.yspeed;

        if (this.x > width - this.r / 2 || this.x < this.r / 2) {
            this.xspeed = -this.xspeed;
        }

        if (this.y > height - this.r / 2 || this.y < this.r / 2) {
            this.yspeed = -this.yspeed;
        }
    }

}

class MouseBouncer {
    constructor() {
        this.x = mouseX;
        this.y = mouseY;
        this.r = 1;
    }

    display() {
        push();
        fill(255, 0, 0, 100);
        noStroke();
        circle(this.x, this.y, this.r);
        pop();
    }

    update() {
        this.x = mouseX;
        this.y = mouseY;
    }
}


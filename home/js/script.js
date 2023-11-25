class Dot {
    constructor(minSpeed = -5, maxSpeed = 11, maxSize = 700, minSize = 300) {
        this.Container = document.getElementById("main");
        this.El = document.createElement("div");
        this.El.className = "dot";

        this.props = {
            minSpeed: minSpeed,
            maxSpeed: maxSpeed,
            maxSize: maxSize,
            minSize: minSize,
            inColor: "#802020",
            outColor: "#b02020"
        };

        this.anim = true;

        this.emmet();
    }

    emmet() {
        this.Dot = this.Container.appendChild(this.El);
        this.initialDx =
            Math.random() * (this.props.maxSpeed - this.props.minSpeed) +
            this.props.minSpeed;
        this.initialDy =
            Math.random() * (this.props.maxSpeed - this.props.minSpeed) +
            this.props.minSpeed;

        this.dx = this.initialDx;
        this.dy = this.initialDy;

        this.size =
            Math.random() * (this.props.maxSize - this.props.minSize) +
            this.props.minSize;

        const startPosX = Math.random() * (80 - 0) + 0;
        const startPosY = Math.random() * (80 - 0) + 0;

        this.Dot.style.width = this.size + "px";
        this.Dot.style.height = this.size + "px";

        this.Dot.style.left = startPosX + "%";
        this.Dot.style.top = startPosY + "%";

        if (this.dx < 0) {
            // this.backgroundColor = this.props.inColor;
        } else {
            // this.backgroundColor = this.props.outColor;
        }
        // this.Dot.style.backgroundColor = this.backgroundColor;
        return this.moveFrame(this, this.anim);
    }

    moveFrame(dot) {
        let frameTime = 800;
        let recursion;
    
        let moveTick = function () {
            if (dot.anim) {
                dot.move();
                dot.removeIfOutside();
            }
            recursion = setTimeout(moveTick, frameTime);
        };
    
        let frame = setTimeout(moveTick, frameTime);
    }
    
    removeIfOutside() {
        const boundingBox = this.Container.getBoundingClientRect();
        const dotBox = this.Dot.getBoundingClientRect();
    
        if (
            dotBox.right < boundingBox.left ||
            dotBox.left > boundingBox.right ||
            dotBox.bottom < boundingBox.top ||
            dotBox.top > boundingBox.bottom
        ) {
            // If the dot is outside the bounding box, remove it
            this.Container.removeChild(this.Dot);
            // Optional: Create a new dot to replace the removed one
            let newDot = new Dot();
            Dots.push(newDot);
        }
    }
    
	

    move() {
        let curPosX = this.Dot.style.left.slice(0, -1);
        let curPosY = this.Dot.style.top.slice(0, -1);

        let nextPosX = parseFloat(curPosX) + this.dx;
        let nextPosY = parseFloat(curPosY) + this.dy;

        this.Dot.style.left = nextPosX + "%";
        this.Dot.style.top = nextPosY + "%";

        this.directionTest(nextPosX, nextPosY);
    }

    directionTest(curPosX, curPosY) {
        if (this.dx > 0 && curPosX > 90) {
            this.dx *= -1;
            // this.backgroundColor = this.props.inColor;
            // this.Dot.style.backgroundColor = this.backgroundColor;
            return;
        } else if (curPosX < -5) {
            this.dx *= -1;
            // this.backgroundColor = this.props.outColor;
            // this.Dot.style.backgroundColor = this.backgroundColor;
            return;
        }
        if (this.dy > 0 && curPosY > 90) {
            this.dy *= -1;
            return;
        } else if (curPosY < -5) {
            this.dy *= -1;
            return;
        }
    }
}

let Dots = [];
for (let i = 0; i < 150; i++) {
    let newDot = new Dot();
    Dots.push(newDot);
}

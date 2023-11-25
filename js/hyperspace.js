var STARCOUNT = 256;
var MAXDEPTH = 64;
var LINELENGTH = 0.05;
var SPEED = 5;
var CYCLE = 40;
var CURRENTSPEED = 10;
var SPEEDCHANGE = 0;
var animationFrameCount = 0;
var animationFrameLimit = 430; // Adjust this value based on your preference
var orbPressed = false;
var isHyperspaceAnimationComplete = false;

var stars = new Array(STARCOUNT);
const canvas = document.getElementById('hyperspaceCanvas');
const ctx = canvas.getContext('2d');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

function randomRange(minVal, maxVal) {
  return Math.floor(Math.random() * (maxVal - minVal)) + minVal;
}

function initStars() {
  for (var i = 0; i < stars.length; i++) {
    stars[i] = {
      x: randomRange(-25, 25),
      y: randomRange(-25, 25),
      z: randomRange(1, MAXDEPTH),
      s: randomRange(0, SPEED / 20),
    };
  }
}

function animate() {
  var halfWidth = canvas.width / 2;
  var halfHeight = canvas.height / 2;

  canvas.width = innerWidth;
  canvas.height = innerHeight;
  ctx.fillStyle = "rgba(0,0,0,1)";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  SPEEDCHANGE++;
  CURRENTSPEED = SPEED + Math.sin(SPEEDCHANGE / CYCLE) * 5;

  for (var i = 0; i < stars.length; i++) {
    var star = stars[i];
    star.z -= CURRENTSPEED / 10 - star.s;

    if (star.z <= 0 || star.z >= MAXDEPTH) {
      star.x = randomRange(-25, 25);
      star.y = randomRange(-25, 25);
      if (star.z <= 0) star.z = MAXDEPTH;
      else star.z = 0;
    }

    var k = 255 / star.z;
    var px = star.x * k + halfWidth;
    var py = star.y * k + halfHeight;

    if (px >= 0 && px <= innerWidth && py >= 0 && py <= innerHeight) {
      var size = 1 - (star.z / MAXDEPTH) * 1.5;
      var shade = parseInt(size * 255);
      var ox = size * (px - halfWidth) * CURRENTSPEED * LINELENGTH;
      var oy = size * (py - halfHeight) * CURRENTSPEED * LINELENGTH;
      ctx.lineWidth = size * 4;
      ctx.strokeStyle = "rgb(" + shade + "," + shade + "," + shade + ")";
      ctx.lineCap = "round";
      ctx.lineJoin = "round";
      ctx.beginPath();
      ctx.moveTo(px, py);
      ctx.lineTo(px + ox, py + oy);
      ctx.stroke();
    }
  }

  // Check if the hyperspace animation is complete
  if (animationFrameCount >= animationFrameLimit) {
    isHyperspaceAnimationComplete = true;
  }

  // Check if the animation should continue
  if (orbPressed && isHyperspaceAnimationComplete) {
    // The orb is pressed, and hyperspace animation is complete, redirect to home.html
    window.location.href = './home/home.html';  // Assuming home.html is in the same directory
  } else {
    animationFrameCount++;
    requestAnimationFrame(animate);
  }
}

document.addEventListener('click', () => {
  // Set the flag to indicate the orb is pressed
  orbPressed = true;
});

// Call initStars here so it only runs once
initStars();

// Start the animation loop
requestAnimationFrame(animate);

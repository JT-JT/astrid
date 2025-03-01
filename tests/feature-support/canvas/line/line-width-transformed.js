var CANVAS_WIDTH = 100;
var CANVAS_HEIGHT = 50;

var gCanvas = null;

window.addEventListener("load", function() {
	setup();

	var ctx = gCanvas.getContext("2d");

	draw(ctx);
});

function draw(ctx) {
	ctx.fillStyle = "#0f0";
	ctx.fillRect(0, 0, 100, 50);

	ctx.lineWidth = 4;
	
	// Draw a green line over a red box, to check the line is not too small
	ctx.fillStyle = "#f00";
	ctx.strokeStyle = "#0f0";
	ctx.fillRect(15, 15, 20, 20);
	ctx.save();
		 ctx.scale(5, 1);
		 ctx.beginPath();
		 ctx.moveTo(5, 15);
		 ctx.lineTo(5, 35);
		 ctx.stroke();
	ctx.restore();

	// Draw a green box over a red line, to check the line is not too large
	ctx.fillStyle = "#0f0";
	ctx.strokeStyle = "#f00";
	ctx.save();
		 ctx.scale(-5, 1);
		 ctx.beginPath();
		 ctx.moveTo(-15, 15);
		 ctx.lineTo(-15, 35);
		 ctx.stroke();
	ctx.restore();
	ctx.fillRect(65, 15, 20, 20);
}

function setup() {
	gCanvas = document.createElement("canvas");
	gCanvas.width = CANVAS_WIDTH;
	gCanvas.height = CANVAS_HEIGHT;

	document.body.appendChild(gCanvas);
	document.body.style.backgroundColor = "#ffffff";

	var ctx = gCanvas.getContext("2d");
	ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
}
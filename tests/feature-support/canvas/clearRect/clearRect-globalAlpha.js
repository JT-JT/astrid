var CANVAS_WIDTH = 300;
var CANVAS_HEIGHT = 300;

var gCanvas = null;

window.addEventListener("load", function() {
	setup();

	var ctx = gCanvas.getContext("2d");

	draw(ctx);
});

function draw(ctx) {
	ctx.fillStyle = "#0f0";
	ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
	ctx.globalAlpha = 0.1;
	ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
}

function setup() {
	gCanvas = document.createElement("canvas");
	gCanvas.width = CANVAS_WIDTH;
	gCanvas.height = CANVAS_HEIGHT;

	document.body.appendChild(gCanvas);
	document.body.style.backgroundColor = "#ffffff";
}
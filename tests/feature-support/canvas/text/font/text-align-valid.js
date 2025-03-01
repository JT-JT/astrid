var CANVAS_WIDTH = 100;
var CANVAS_HEIGHT = 50;

var gCanvas = null;

window.addEventListener("load", function() {
	setup();
	
	var ctx = gCanvas.getContext("2d");

	draw(ctx);
});

function draw(ctx) {
	setTextAlign(ctx, "start");
	setTextAlign(ctx, "end");
	setTextAlign(ctx, "left");
	setTextAlign(ctx, "right");
	setTextAlign(ctx, "center");
}

function setTextAlign(ctx, value) {
	ctx.textAlign = value;
	
	if(ctx.textAlign != value)
		console.log("FAILED: Expected a value of '" + value + "', got: '" + ctx.textAlign + "'.");
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
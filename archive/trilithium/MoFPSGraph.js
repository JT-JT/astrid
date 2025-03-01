MoFPSClock = Class.create(
// @PRIVATE
{
	initialize : function() {
		this.currentTime = 0;
		this.elapsedTime = 0;
		this.totalTime = 0;
		this.lastTime = 0;
		this.bestTime = 0;
		this.worstTime = 0;
		this.frameTime = 0;
		this.frameCount = 0;
		this.suspendStartTime = 0;
		this.suspendElapsedTime = 0;
		this.suspendCount = 0;
		this.lastFPS = 0;
		this.avgFPS = 0;
		this.bestFPS = 0;
		this.worstFPS = 0;
		
		this.reset();
	},

	getElapsedTime : function() {
		return this.elapsedTime;
	},
	
	getTotalTime : function() {
		return this.totalTime;
	},
	
	getBestTime : function() {
		return this.bestTime;
	},
	
	getWorstTime : function() {
		return this.worstTime;
	},
	
	getAverageFPS : function() {
		return this.avgFPS;
	},
	
	getBestFPS : function() {
		return this.bestFPS;
	},
	
	getWorstFPS : function() {
		return this.worstFPS;
	},
	
	reset : function() {
		this.lastTime = MoGetTimer();
		this.totalTime = 0;
		this.elapsedTime = 0;
		this.currentTime = this.lastTime;
		this.frameTime = this.lastTime;
		this.frameCount = 0;
		this.avgFPS = 0;
		this.bestFPS = 0;
		this.lastFPS = 0;
		this.worstFPS = 9999.0;
		this.bestTime = 999999;
		this.worstTime = 0;
		this.suspendCount = 0;
		this.suspendElapsedTime = 0;
		this.suspendStartTime = 0;
	},
	
	resume : function() {
		if(--this.suspendCount <= 0)
		{
			var ts = MoGetTimer();
			
			this.suspendCount = 0;
			this.suspendElapsedTime += ts - this.suspendStartTime;
			this.suspendStartTime = 0;
		}
	},
	
	suspend : function() {
		this.suspendCount++;
		
		if(this.suspendCount == 1)
			this.suspendStartTime = MoGetTimer();
	},
	
	update : function() {
		var ts = MoGetTimer();
		
		this.frameCount++;
		this.lastTime = this.lastTime + this.suspendElapsedTime;
		this.elapsedTime = ts - this.lastTime;
		this.lastTime = ts;
		this.suspendElapsedTime = 0;
		
		this.bestTime = Math.min(this.bestTime, this.elapsedTime);
		this.worstTime = Math.max(this.worstTime, this.elapsedTime);
		
		if((ts - this.frameTime) > 1000)
		{
			var count = this.frameCount;
			var deltaTime = (ts - this.frameTime);
			
			this.lastFPS = count / deltaTime * 1000;
			
			if(this.avgFPS == 0)
				this.avgFPS = this.lastFPS;
			else
				this.avgFPS = (this.avgFPS + this.lastFPS) * 0.5;
			
			this.bestFPS = Math.max(this.bestFPS, this.lastFPS);
			this.worstFPS = Math.min(this.worstFPS, this.lastFPS);
			
			this.frameTime = ts;
			this.frameCount = 0;
		}

		this.totalTime += this.elapsedTime;
	}
});

MoFPSGraph = Class.create(
// @PRIVATE
{
	initialize : function() {
		this.width = 175;
		this.height = 60;
		this.averages = [];
		
		for(var i = 0; i < 100; i++)
			this.averages.push(0);
	},
	
	render : function(gfx, x, y) {
		var app = MoApplication.getInstance();
		var clock = app.fpsClock;
		var graphX = 0.5;
		var graphY = 0.5;
		var graphWidth = this.width-1;
		var graphHeight = (this.height-30)-1;
		var maxBarHeight = graphHeight - 10;
		
		gfx.save();
		gfx.translate(x, y);
		gfx.beginPath();
		gfx.rect(0, 0, this.width, this.height);
		gfx.clip();
		
		// render the background and border
		gfx.fillStyle = "rgba(255,255,255,0.5)";
		gfx.strokeStyle = "white";
		gfx.beginPath();
		gfx.rect(graphX, graphY, graphWidth, graphHeight);
		gfx.stroke();
		gfx.fill();
		
		// draw graph markers
		gfx.lineWidth = 1;
		gfx.strokeStyle = "rgba(0,0,0,0.5)";
		gfx.beginPath();
		gfx.moveTo(1.5, 10.5);
		gfx.lineTo(graphWidth, 10.5);
		gfx.moveTo(1.5, (0.5 * (graphHeight+10)));
		gfx.lineTo(graphWidth, (0.5 * (graphHeight+10)));
		gfx.stroke();
		
		// remove the first element so we can
		// shift everything over by 1
		if(this.averages.length == 100)
			this.averages.shift();
		
		var x = 0;
		var y = 0;
		
		// draw the fps graph
		gfx.beginPath();

		for(var i = 0; i < this.averages.length; ++i)
		{
			var avg = this.averages[i];
			x = (i * (graphWidth / 100)) + 1.5;
			y = MoMath.round(Math.min(1.0, avg / 60.0) * maxBarHeight) + 0.5;

			gfx.lineTo(x, (maxBarHeight - y) + 10);
		}
		
		
		gfx.lineTo(graphWidth, (maxBarHeight - y) + 10);
		gfx.lineTo(graphWidth, graphHeight);
		gfx.lineTo(1.5, graphHeight);
		gfx.closePath();

		// the graph should be rendered a red color if it's below
		// 30fps, otherwise render it green
		if(clock.getAverageFPS() < 30)
			gfx.fillStyle = "rgba(255, 0, 0, 0.5)";
		else
			gfx.fillStyle = "rgba(0, 255, 0, 0.5)";
			
		gfx.fill();
		
		// draw the fps labels
		gfx.font = "10px courier";
		
		var avgStr = "FPS: " + MoMath.toPrecision(clock.getAverageFPS(), 0) + ",";
		var avgWidth = gfx.measureText(avgStr).width;
		var bestStr = "Max: " + MoMath.toPrecision(clock.getBestFPS(), 0) + ",";
		var bestWidth = gfx.measureText(bestStr).width;
		var worstStr = "Min: " + MoMath.toPrecision(clock.getWorstFPS(), 0);
		var worstWidth = gfx.measureText(worstStr).width;
		var textX = 0;
		var textY = graphHeight + 12;
		
		gfx.fillStyle = "white";
		gfx.fillText(avgStr, textX, textY);
		
		textX += avgWidth + 6;
		gfx.fillText(bestStr, textX, textY);
		
		textX += bestWidth + 6;
		gfx.fillText(worstStr, textX, textY);
		
		// draw the time labels
		var timeElapsedStr = "Time: " + MoMath.toPrecision(clock.getElapsedTime(), 0) + ",";
		var timeElapsedWidth = gfx.measureText(timeElapsedStr).width;
		var timeWorstStr = "Max: " + MoMath.toPrecision(clock.getWorstTime(), 0) + ",";
		var timeWorstWidth = gfx.measureText(timeWorstStr).width;
		var timeBestStr = "Min: " + MoMath.toPrecision(clock.getBestTime(), 0);
		var timeBestWidth = gfx.measureText(timeBestStr).width;

		textX = 0;
		textY += 12;
		
		gfx.fillText(timeElapsedStr, textX, textY);
		
		textX += timeElapsedWidth + 6;
		gfx.fillText(timeWorstStr, textX, textY);
		
		textX += timeWorstWidth + 6;
		gfx.fillText(timeBestStr, textX, textY);
		
		gfx.restore();
		
		this.averages.push(clock.getAverageFPS());
	}
});
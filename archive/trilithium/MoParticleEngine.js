// TODO : the following tasks still need to be completed for the particle engine to be 100% complete
//           - allow for 'additiveBlending' in brush sources
//           - allow for other brushes other than radial in the 'brush' parameter
//           - allow for color blending when using an 'imageBrush' as the particle source
//           - allow for color modulation in brush sources, i.e. colorModulate
//           - implement a native version of the particle engine to use when running through the native MoEnjin
//               + should also use hardware acceleration and/or glsl/hlsl shaders
//               + as bonus points it would be nice to have a 3D particle engine that can project it onto an intermediate
//                 bitmap surface which can then be blitted back to the screen, this would allow for much more advanced
//                 effects but rendered into a 2d scene.
//

MoParticle = Class.create(MoEquatable, {
	initialize : function() {
		this.position = MoVector2D.Zero();
		this.startPosition = MoVector2D.Zero();
		this.direction = MoVector2D.Zero();
		this.color = MoColor.black();
		this.colorDelta = MoColor.black();
		this.radialAccel = 0;
		this.tangentAccel = 0;
		this.size = 0;
		this.sizeDelta = 0;
		this.angle = 0;
		this.angleDelta = 0;
		this.lifeSpan = 0;
	}
});

MoParticleEngine = Class.create(MoDrawable, {
	initialize : function($super, name, count) {
		$super(name);

		this.particles = [];
		this.particlePool = [];
		this.particleCount = 0;
		this.particleIndex = 0;
		
		this.inc = 0;
		this.elapsed = 0;
		this.isActive = false;
		
		this.totalParticles = 0;
		this.additiveBlending = false;
		this.colorModulate = false;
		this.removeWhenFinished = false;
		this.duration = 0;
		this.emissionRate = 0;
		this.emissionCounter = 0;
		this.emissionSpeed = 0;
		this.angle = MoVector2D.Zero();
		this.speed = MoVector2D.Zero();
		this.tangentAccel = MoVector2D.Zero();
		this.radialAccel = MoVector2D.Zero();
		this.startSize = MoVector2D.Zero();
		this.endSize = MoVector2D.Zero();
		this.particleLife = MoVector2D.Zero();
		this.startSpin = MoVector2D.Zero();
		this.endSpin = MoVector2D.Zero();
		this.gravity = MoVector2D.Zero();
		this.centerOfGravity = MoVector2D.Zero();
		this.positionVariance = MoVector2D.Zero();
		this.positionType = 1;
		this.startColor = MoColor.black();
		this.startColorVariance = MoColor.black();
		this.endColor = MoColor.black();
		this.endColorVariance = MoColor.black();
		this.imageBrush = null;
		this.brush = MoRadialGradientBrush.fromColors(MoColor.white(), MoColor.fromHexWithAlpha("#FFFFFF", 0));
		this.lastUpdateTime = 0;
		this.lastUpdateTickTime = 0;
		this.updateTotalTime = 0;

		MoApplication.getInstance().addEventHandler(MoFrameEvent.ENTER, this.handleFrameTick.asDelegate(this));
		
		this.initializeParticles(count);
	},
	
	getImageBrush : function() {
		return this.imageBrush;
	},
	
	setImageBrush : function(value) {
		this.imageBrush = value;
	},

	stop : function() {
		this.isActive = false;
		this.elapsed = this.duration;
		this.emissionCounter = 0;
	},

	reset : function() {
		this.isActive = true;
		this.elapsed = 0;
		this.particlePool = [];
		
		for(this.particleIndex = 0; this.particleIndex < this.particleCount; ++this.particleIndex)
		{
			var p = this.particles[this.particleIndex];
			p.lifeSpan = 0;
		}
	},

	isFull : function() {
		return (this.particleCount == this.totalParticles);
	},

	addParticle : function() {
		if(this.isFull())
			return false;

		var p = null;

		if(this.particlePool.length > 0)
		{
			// don't allow the pool to grow very big
			if(this.particlePool.length > 50)
				this.particlePool.splice(49);

			p = this.particlePool.shift();
		}

		if(p == null)
			p = new MoParticle();

		this.particles[this.particleCount] = p;
		this.initializeParticle(p);
		this.particleCount++;

		return true;
	},

	initializeParticles : function(count) {
		this.totalParticles = count;
		this.particles = new Array(this.totalParticles);

		this.inc = 2;
		this.elapsed = 0;
		this.additiveBlending = false;
		this.colorModulate = false;
		this.removeWhenFinished = false;
		this.isActive = true;
		this.duration = 0;
		this.emissionRate = 0;
		this.emissionCounter = 0;
		this.emissionSpeed = 0.01;
		this.angle = MoVector2D.Zero();
		this.speed = MoVector2D.Zero();
		this.tangentAccel = MoVector2D.Zero();
		this.radialAccel = MoVector2D.Zero();
		this.startSize = MoVector2D.UnitX();
		this.endSize = MoVector2D.UnitX();
		this.particleLife = MoVector2D.NegativeUnitX();
		this.startSpin = MoVector2D.Zero();
		this.endSpin = MoVector2D.Zero();
		this.gravity = MoVector2D.Zero();
		this.centerOfGravity = MoVector2D.Zero();
		this.positionVariance = MoVector2D.Zero();
		this.positionType = 1;
		this.startColor = MoColor.white();
		this.startColorVariance = MoColor.white();
		this.endColor = MoColor.white();
		this.endColorVariance = MoColor.white();
		this.particleIndex = 0;
		this.particleCount = 0;
	},

	randomNegPos : function() {
		return ((Math.random()) - 1.0);
	},

	randomZeroPos : function() {
		return (Math.random() / 0x3fffffff);
	},

	degToRad : function(deg) {
		return deg / 180.0 * Math.PI;
	},

	initializeParticle : function(particle) {
		var v = new MoVector2D(0, 0);

		// position
		particle.position.x = (this.centerOfGravity.x + this.positionVariance.x * this.randomNegPos());
		particle.position.y = (this.centerOfGravity.y + this.positionVariance.y * this.randomNegPos());

		// direction
		var a = this.degToRad(this.angle.x + this.angle.y * this.randomNegPos());
		v.x = Math.cos(a);
		v.y = Math.sin(a);
		
		var s = this.speed.x + this.speed.y * this.randomNegPos();
		particle.direction.x = v.x * s;
		particle.direction.y = v.y * s;
		
		// radial acceleration
		particle.radialAccel = this.radialAccel.x + this.radialAccel.y * this.randomNegPos();
		
		// tangential acceleration
		particle.tangentAccel = this.tangentAccel.x + this.tangentAccel.y * this.randomNegPos();
		
		// life span
		particle.lifeSpan = this.particleLife.x + this.particleLife.y * this.randomNegPos();
		particle.lifeSpan = Math.max(0, particle.lifeSpan);
		
		// color
		var start = new MoColor();
		start.r = this.startColor.r + this.startColorVariance.r * this.randomNegPos();
		start.g = this.startColor.g + this.startColorVariance.g * this.randomNegPos();
		start.b = this.startColor.b + this.startColorVariance.b * this.randomNegPos();
		start.a = this.startColor.a + this.startColorVariance.a * this.randomNegPos();
		
		var end = new MoColor();
		end.r = this.endColor.r + this.endColorVariance.r * this.randomNegPos();
		end.g = this.endColor.g + this.endColorVariance.g * this.randomNegPos();
		end.b = this.endColor.b + this.endColorVariance.b * this.randomNegPos();
		end.a = this.endColor.a + this.endColorVariance.a * this.randomNegPos();
		
		particle.color = start;
		particle.colorDelta.r = (end.r - start.r) / particle.lifeSpan;
		particle.colorDelta.g = (end.g - start.g) / particle.lifeSpan;
		particle.colorDelta.b = (end.b - start.b) / particle.lifeSpan;
		particle.colorDelta.a = (end.a - start.a) / particle.lifeSpan;
		
		// size
		var startSize = this.startSize.x + this.startSize.y * this.randomNegPos();
		startSize = Math.max(0, startSize);
		
		particle.size = startSize;

		if(this.endSize.x == -1)
		{
			particle.sizeDelta = 0;
		}
		else
		{
			var endSize = this.endSize.x + this.endSize.y * this.randomNegPos();
			particle.sizeDelta = (endSize - startSize) / particle.lifeSpan;
		}
		
		// angle
		var startAngle = this.startSpin.x + this.startSpin.y * this.randomNegPos();
		var endAngle = this.endSpin.x + this.endSpin.y * this.randomNegPos();

		particle.angle = startAngle;
		particle.angleDelta = (endAngle - startAngle) / particle.lifeSpan;
		
		// position
		particle.startPosition.x = this.getX();
		particle.startPosition.y = this.getY();
		
		return particle;
	},

	handleFrameTick : function(event) {
		
		var delta = event.getDeltaTime() / 1000;

		this.updateTotalTime += delta;//Math.min(delta, 0.05);
		
		var elapsedTime = this.updateTotalTime - this.lastUpdateTime;
		
		this.lastUpdateTime = this.updateTotalTime;
		this.inc = 2;

		if(this.isActive && this.emissionRate != 0)
		{
			var rate = 1.0 / this.emissionRate;
			
			this.emissionCounter += elapsedTime;			
			
			while(this.particleCount < this.totalParticles && this.emissionCounter > rate)
			{
				this.addParticle();
				this.emissionCounter -= rate;
			}
			
			this.elapsed += elapsedTime;

			if(this.duration != -1 && this.duration < this.elapsed)
				this.stop();
		}

		this.particleIndex = 0;

		var gfx = this.getGraphics();
		var viewX = this.getWidth() * 0.5;
		var viewY = this.getHeight();
		var newPos = MoVector2D.Zero();
		var delta = MoVector2D.Zero();
		var radial = MoVector2D.Zero();
		var tangential = MoVector2D.Zero();
		var tmp = MoVector2D.Zero();
		
		gfx.clear();
		
		while(this.particleIndex < this.particleCount)
		{
			var p = this.particles[this.particleIndex];
			
			if(p.lifeSpan > 0)
			{
				tangential.x = tangential.y = 0;
				radial.x = radial.y = 0;
				tmp.x = tmp.y = 0;

				if(p.position.x != 0 || p.position.y != 0)
				{
					radial.x = p.position.x;
					radial.y = p.position.y;
					radial.normalize();
				}

				tangential.x = radial.x;
				tangential.y = radial.y;
				
				radial.x = radial.x * p.radialAccel;
				radial.y = radial.y * p.radialAccel;

				var newy = tangential.x;
				tangential.x = -tangential.y;
				tangential.y = newy;
				tangential.x = tangential.x * p.tangentAccel;
				tangential.y = tangential.y * p.tangentAccel;

				tmp.x = (radial.x + tangential.x + this.gravity.x) * elapsedTime;
				tmp.y = (radial.y + tangential.y + this.gravity.y) * elapsedTime;

				p.direction.x = p.direction.x + tmp.x;
				p.direction.y = p.direction.y + tmp.y;
				
				tmp.x = p.direction.x * elapsedTime;
				tmp.y = p.direction.y * elapsedTime;
				
				p.position.x = p.position.x + tmp.x;
				p.position.y = p.position.y + tmp.y;

				p.color.r += (p.colorDelta.r * elapsedTime);
				p.color.g += (p.colorDelta.g * elapsedTime);
				p.color.b += (p.colorDelta.b * elapsedTime);
				p.color.a += (p.colorDelta.a * elapsedTime);
				
				p.size += (p.sizeDelta * elapsedTime);
				p.size = Math.max(0, p.size);

				p.angle += (p.angleDelta * elapsedTime);
				p.lifeSpan -= elapsedTime;

				newPos.x = p.position.x;
				newPos.y = p.position.y;

				if(this.positionType == 0)
				{
					delta.x = this.getX() - p.startPosition.x;
					delta.y = this.getY() - p.startPosition.y;
					
					newPos.x = p.position.x - delta.x;
					newPos.y = p.position.y - delta.y;
				}

				if(p.size > 0)
				{
					var px = newPos.x + (viewX - p.size * 0.5);
					var py = newPos.y + (viewY - p.size);

					if(MoIsNull(this.imageBrush))
					{
						this.brush.getColorStop(0).setColor(p.color);

						gfx.drawCircle(px, py, p.size * 0.5, false);
						gfx.fill(this.brush);
					}
					else
					{
						this.imageBrush.setOpacity(p.color.a);
						
						gfx.drawRect(px, py, p.size, p.size);
						gfx.fill(this.imageBrush);
					}
				}
				
				this.particleIndex++;
			}
			else
			{
				if(this.particleIndex != this.particleCount-1)
				{
					this.particlePool.unshift(this.particles[this.particleIndex]);
					this.particles[this.particleIndex] = this.particles[this.particleCount-1];
				}

				this.particleCount--;

				if(this.particleCount == 0 && this.removedWhenFinished)
					this.getParent().remove(this);
			}
		}
	}
});

import Equatable from "../Equatable";
import Rectangle from "../Rectangle";
import DirtyRegionTracker from "./DirtyRegionTracker";

class DirtyRegion extends Equatable {
	constructor() {
		super();
		this.x1 = astrid.math.MaxInt;
		this.y1 = astrid.math.MaxInt;
		this.x2 = astrid.math.MinInt;
		this.y2 = astrid.math.MinInt;
	}

	clear() {
		this.x1 = astrid.math.MaxInt;
		this.y1 = astrid.math.MaxInt;
		this.x2 = astrid.math.MinInt;
		this.y2 = astrid.math.MinInt;
	}

	isEmpty() {
		return (this.x1 === astrid.math.MaxInt); // only need to check one
	}

	getRect() {
		return new Rectangle(this.x1, this.y1, this.getWidth(), this.getHeight());
	}

	getWidth() {
		return (this.x2 - this.x1);
	}

	getHeight() {
		return (this.y2 - this.y1);
	}

	grow(x1, y1, x2, y2) {
		this.x1 = Math.min(x1, this.x1);
		this.y1 = Math.min(y1, this.y1);
		this.x2 = Math.max(x2, this.x2);
		this.y2 = Math.max(y2, this.y2);

		DirtyRegionTracker.current().add(this);
	}

	inflate(amount) {
		this.x1 -= amount;
		this.y1 -= amount;
		this.x2 += amount;
		this.y2 += amount;
	}

	combine(other) {
		this.grow(other.x1, other.y1, other.x2, other.y2);
	}

	combineRect(rect) {
		this.grow(rect.x, rect.y, rect.x + rect.width, rect.y + rect.height);
	}

	translate(x, y) {
		if (this.x1 !== astrid.math.MaxInt) {
			this.x1 += x;
			this.x2 += x;

			this.y1 += y;
			this.y2 += y;
		}
	}

	toString() {
		return "DirtyRegion(x1: " + this.x1 + ", y1: " + this.y1 + ", x2: " + this.x2 + ", y2: " + this.y2 + ")";
	}
}

export default DirtyRegion;

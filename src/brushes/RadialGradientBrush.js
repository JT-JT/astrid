import BrushType from "./BrushType"
import GradientBrush from "./GradientBrush"
import GradientStop from "./GradientStop"
import PropertyOptions from "../ui/PropertyOptions"
import Vector2D from "../Vector2D"

class RadialGradientBrush extends GradientBrush {
	constructor() {
		super(BrushType.RadialGradient);

		this.setStartPoint(new Vector2D(0.5, 0.5));
		this.setEndPoint(new Vector2D(0.5, 0.5));
		this.setStartRadius(0);
		this.setEndRadius(1);
	}

	initializeAnimatablePropertiesCore() {
		super.initializeAnimatablePropertiesCore();

		this.enableAnimatableProperty("startPoint", this.getStartPoint, this.setStartPoint, PropertyOptions.AffectsLayout);
		this.enableAnimatableProperty("startRadius", this.getStartRadius, this.setStartRadius, PropertyOptions.AffectsLayout);
		this.enableAnimatableProperty("endPoint", this.getEndPoint, this.setEndPoint, PropertyOptions.AffectsLayout);
		this.enableAnimatableProperty("endRadius", this.getEndRadius, this.setEndRadius, PropertyOptions.AffectsLayout);
	}

	getStartPoint() {
		return this.getPropertyValue("startPoint");
	}

	setStartPoint(value) {
		this.setPropertyValue("startPoint", value);
	}

	getEndPoint() {
		return this.getPropertyValue("endPoint");
	}

	setEndPoint(value) {
		this.setPropertyValue("endPoint", value);
	}

	getStartRadius() {
		return this.getPropertyValue("startRadius");
	}

	setStartRadius(value) {
		this.setPropertyValue("startRadius", value);
	}

	getEndRadius() {
		return this.getPropertyValue("endRadius");
	}

	setEndRadius(value) {
		this.setPropertyValue("endRadius", value);
	}

	isEqualTo(other) {
		return (super.isEqualTo(other) &&
			astrid.areEqual(this.getStartPoint(), other.getStartPoint()) &&
			astrid.areEqual(this.getEndPoint(), other.getEndPoint()) &&
			this.getStartRadius() == other.getStartRadius() &&
			this.getEndRadius() == other.getEndRadius());
	}

	static fromGradientStops(stops) {
		var brush = new RadialGradientBrush();
		brush.setColorStops(stops);

		return brush;
	}

	static fromColors(startColor, endColor) {
		var stops = [
			new GradientStop(startColor, 0),
			new GradientStop(endColor, 1)
		];

		return RadialGradientBrush.fromGradientStops(stops);
	}
}

export default RadialGradientBrush;

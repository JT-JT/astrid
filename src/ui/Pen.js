import EventDispatcher from "../EventDispatcher";
import Animatable from "../animation/Animatable";
import PenLineCap from "./PenLineCap";
import PenLineJoin from "./PenLineJoin";
import DashStyle from "./DashStyle";
import PropertyOptions from "./PropertyOptions";

var Mixed = astrid.mixin(EventDispatcher, Animatable);

class Pen extends Mixed {
	constructor(brush, thickness) {
		super();

		this.setBrush(brush);
		this.setLineCap(PenLineCap.Flat);
		this.setLineJoin(PenLineJoin.Miter);
		this.setMiterLimit(10);
		this.setDashCap(PenLineCap.Square);
		this.setDashStyle(DashStyle.Solid);
		this.setThickness(astrid.valueOrDefault(thickness, 1));

		this.initializeAnimatableProperties();
	}

	initializeAnimatablePropertiesCore() {
		this.enableAnimatableProperty("brush", this.getBrush, this.setBrush, PropertyOptions.AffectsLayout);
		this.enableAnimatableProperty("lineCap", this.getLineCap, this.setLineCap, PropertyOptions.AffectsLayout);
		this.enableAnimatableProperty("lineJoin", this.getLineJoin, this.setLineJoin, PropertyOptions.AffectsLayout);
		this.enableAnimatableProperty("miterLimit", this.getMiterLimit, this.setMiterLimit, PropertyOptions.AffectsLayout);
		this.enableAnimatableProperty("dashCap", this.getDashCap, this.setDashCap, PropertyOptions.AffectsLayout);
		this.enableAnimatableProperty("dashStyle", this.getDashStyle, this.setDashStyle, PropertyOptions.AffectsLayout);
		this.enableAnimatableProperty("thickness", this.getThickness, this.setThickness, PropertyOptions.AffectsLayout |
			PropertyOptions.AffectsMeasure);
	}

	getBrush() {
		return this.getPropertyValue("brush");
	}

	setBrush(value) {
		this.setPropertyValue("brush", value);
	}

	getLineCap() {
		return this.getPropertyValue("lineCap");
	}

	setLineCap(value) {
		this.setPropertyValue("lineCap", value);
	}

	getLineJoin() {
		return this.getPropertyValue("lineJoin");
	}

	setLineJoin(value) {
		this.setPropertyValue("lineJoin", value);
	}

	getMiterLimit() {
		return this.getPropertyValue("miterLimit");
	}

	setMiterLimit(value) {
		this.setPropertyValue("miterLimit", value);
	}

	getDashCap() {
		return this.getPropertyValue("dashCap");
	}

	setDashCap(value) {
		this.setPropertyValue("dashCap", value);
	}

	getDashStyle() {
		return this.getPropertyValue("dashStyle");
	}

	setDashStyle(value) {
		this.setPropertyValue("dashStyle", value);
	}

	getThickness() {
		return this.getPropertyValue("thickness");
	}

	setThickness(value) {
		this.setPropertyValue("thickness", value);
	}

	isEqualTo(other) {
		return (this.getThickness() == other.getThickness() &&
		this.getMiterLimit() == other.getMiterLimit() &&
		this.getDashCap() == other.getDashCap() &&
		this.getDashStyle() == other.getDashStyle() &&
		this.getLineJoin() == other.getLineJoin() &&
		this.getLineCap() == other.getLineCap() &&
		astrid.areEqual(this.getBrush(), other.getBrush()));
	}
}

export default Pen;

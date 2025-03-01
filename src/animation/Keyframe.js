import Equatable from "../Equatable";
import LinearEase from "./LinearEase";

class Keyframe extends Equatable {
	constructor(keyTime, value) {
		super();
	
		/** Number **/
		this.keyTime = astrid.valueOrDefault(keyTime, -1);
		
		/** Object **/
		this.value = value;
		
		/** Number **/
		this.keyTimeFraction = -1;

		/** AnimationEaser **/
		this.easer = Keyframe.DefaultEaser;
	}
	
	getValue() {
		return this.value;
	}
	
	setValue(value) {
		this.value = value;
	}
	
	getKeyTime() {
		return this.keyTime;
	}
	
	setKeyTime(value) {
		this.keyTime = value;
	}
	
	getEaser() {
		return this.easer;
	}

	setEaser(value) {
		this.easer = astrid.valueOrDefault(value, Keyframe.DefaultEaser);
	}

	getTimeFraction() {
		return this.keyTimeFraction;
	}

	getIsValidKeyTime() {
		var t = this.getKeyTime();

		return (!isNaN(t) && t != -1);
	}
}

Keyframe.DefaultEaser = new LinearEase();

export default Keyframe;

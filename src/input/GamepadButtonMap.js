import GamepadButtons from "./GamepadButtons";

class GamepadButtonMap {
	constructor(map, sticks, triggers) {
		this.map = astrid.valueOrDefault(map, []);
		this.sticks = astrid.valueOrDefault(sticks, []);
		this.triggers = astrid.valueOrDefault(triggers, []);

		// just default to 32 available slots
		if (map == null) {
			for (var i = 0; i < 32; ++i) {
				this.map.push(GamepadButtons.None);
			}
		}
	}

	indexOf(button) {
		if (button == GamepadButtons.None) {
			return -1;
		}

		for (var i = 0, len = this.map.length; i < len; ++i) {
			if (this.map[i] === button) {
				return i;
			}
		}

		return -1;
	}

	get(index) {
		if (this.isValidIndex(index)) {
			return this.map[index];
		}

		return GamepadButtons.None;
	}

	add(button, index) {
		button = astrid.valueOrDefault(button, GamepadButtons.None);

		if (this.isValidIndex(index)) {
			this.map[index] = button;
		}
	}

	remove(index) {
		if (this.isValidIndex(index)) {
			this.map[index] = GamepadButtons.None;
		}
	}

	isValidIndex(index) {
		return (index >= 0 && index < this.map.length);
	}
}

GamepadButtonMap.XBOX360 = new GamepadButtonMap([
	GamepadButtons.A, GamepadButtons.B,
	GamepadButtons.X, GamepadButtons.Y,
	GamepadButtons.LeftShoulder, GamepadButtons.RightShoulder,
	GamepadButtons.None, GamepadButtons.None, // triggers are processed independantly
	GamepadButtons.Back, GamepadButtons.Start,
	GamepadButtons.LeftStick, GamepadButtons.RightStick,
	GamepadButtons.DPadUp, GamepadButtons.DPadDown,
	GamepadButtons.DPadLeft, GamepadButtons.DPadRight
]);

GamepadButtonMap.PS4 = new GamepadButtonMap([
	GamepadButtons.X, GamepadButtons.A,
	GamepadButtons.B, GamepadButtons.Y,
	GamepadButtons.LeftShoulder, GamepadButtons.RightShoulder,
	GamepadButtons.None, GamepadButtons.None, // triggers are processed independantly
	GamepadButtons.Back, GamepadButtons.Start,
	GamepadButtons.LeftStick, GamepadButtons.RightStick,
	GamepadButtons.Big, GamepadButtons.TouchPad,
	GamepadButtons.DPadUp, GamepadButtons.DPadDown,
	GamepadButtons.DPadLeft, GamepadButtons.DPadRight,
]);

export default GamepadButtonMap;

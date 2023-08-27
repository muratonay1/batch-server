export default class Pocket {

	put(key, value) {
		var keyList = key.includes('.') ? key.split('.') : [key];
		var target = this;

		for (let i = 0; i < keyList.length - 1; i++) {
			if (!target[keyList[i]]) {
				target[keyList[i]] = {};
			}
			target = target[keyList[i]];
		}

		target[keyList[keyList.length - 1]] = value;
		return this;
	}

	putAs(key, creator) {
		this[key] = creator;
	}

	get(key) {
		var keyList = key.split('.');
		var target = this;

		for (let k of keyList) {
			if (target[k] === undefined) {
				return undefined;
			}
			target = target[k];
		}

		return target;
	}

	merge(pocket) {
		Object.assign(this, pocket);
	}

	exist(key) {
		return this.get(key) !== undefined;
	}

	remove(key) {
		var keyList = key.split('.');
		var target = this;

		for (let i = 0; i < keyList.length - 1; i++) {
			target = target[keyList[i]];
		}

		delete target[keyList[keyList.length - 1]];
	}

	size() {
		return Object.keys(this).length;
	}

	getKeys() {
		return Object.keys(this);
	}

	clone() {
		return JSON.parse(JSON.stringify(this));
	}

	isPocket() {
		return this instanceof Pocket;
	}

	isEmpty() {
		return this.size() === 0;
	}
}
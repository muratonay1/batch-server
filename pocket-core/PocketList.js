/**
 * ArrayList sınıfı benzeri PocketList design
 * @example
 * let pocketList = new PocketList;
 */
 export default class PocketList {
	/**
	 *
	 * @param {Pocket} pocket
	 */
	create() {
		return new PocketList();
	}
	/**
	 * @param {Pocket} callback
	 * @returns {Pocket} callback
	 * @description
	 * PocketList yapısına özgü bir döngü yapısıdır.
	 * @example
	 * pocketList.ForEach(visitor=>{
	 *      console.log(visitor);
	 * })
	 */
	ForEach = function (callback = Pocket) {
		var index = 0;
		var items = new PocketList();
		for (let i = 0; i < Object.keys(this).length; i++) {
			items.add(this[i]);
		}

		function first() {
			return reset();
		}

		function next() {
			return ++index;
		}

		function hasNext() {
			return index <= Object.keys(items).length -3;
		}

		function reset() {
			return (index = 0);
		}
		for (var item = first(); hasNext(); item = next()) {
			/**
			 * @returns {Pocket}
			 */
			callback(items[item]);
		}
	};

	/**
	 *
	 * @param {Pocket} pocket
	 * @returns {this}
	 */
	add(pocket) {
		var _this = this;
		var thisLength = Object.keys(_this).length-1;
		if (thisLength != 0) {
			_this[thisLength] = pocket;
		} else {
			_this[0] = pocket;
		}
		return _this;
	}
	/**
	 *
	 * @param {Integer} index
	 * @returns {Pocket}
	 */
	getPocket(index) {
		return this[index];
	}
	/**
	 *
	 * @returns {Boolean}
	 */
	isPocketList() {
		return this instanceof PocketList == "PocketList" ? true : false;
	}
	/**
	 *
	 * @returns {Integer}
	 */
	size() {
		return Object.keys(this).length-1;
	}
}
/**
 *
 * @access new Pocket()
 */
export default class Pocket {
	/**
	 * private
	 */

	create() {
		return new Pocket();
	}
	/**
	 *
	 * @param {Pocket} t
	 * @param {Boolean} setFlag
	 */

	/**
	 * @param {String} key pocket içine koyulacak anahtar kelimeyi içerir
	 * @param {String} value pocket içindeki anahtarın değerini belirtir.
	 * @returns {Pocket}
	 * @example
	 * var pocket = new Pocket();
	 * pocket.put("name","murat");
	 * pocket.put("surname","onay");
	 * pocket.put("data.school","fırat üniversitesi");
	 *
	 * Pocket{
	 * 	"name":"murat",
	 * 	"surname":"onay",
	 * 	"data":{
	 * 		"school":"fırat universitesi"
	 * 	}
	 * }
	 */
	put(key, value) {
		var keyList=[];
		if(!key.includes('.')){
			keyList.push(key);
		}
		else{
			keyList = key.split(".");
		}

		var snapshot = this;
		var clone = this.clone();
		var _this = this;

		function create() {
			return new Pocket();
		}

		function isExist(isKey, _this) {
			let flag = false;
			if (_this[isKey] != undefined) {
				flag = true;
			}
			return flag;
		}
		if (key.includes(".")) {
			var keyMerge = "";
			var shifting = "";

			function recursion(skeys, _this) {
				if (isExist(skeys[0], _this)) {
					if (skeys.length > 2) {
						snapshot = snapshot[skeys[0]];
						shifting =
							shifting == "" ? skeys.shift() : shifting + "." + skeys.shift();
						recursion(skeys, snapshot);
					}
					if (skeys.length == 2) {
						if (key.split(".").length >= 4) {
							eval("clone." + shifting)[skeys[0]] = value;
						} else {
							shifting = shifting == "" ? skeys[0] : shifting + "." + skeys[0];
							skeys.shift();
							shifting == ""
								? (snapshot[skeys[0]][skeys[1]] = value)
								: (eval("clone." + shifting)[skeys[0]] = value);
						}
					}
				} else {
					for (let i = 0; i < skeys.length - 1; i++) {
						if (i == 0) {
							keyMerge = skeys[i];
						} else {
							keyMerge = keyMerge + "." + skeys[i];
						}
					}
					if (shifting == "") {
						var orgiSnaphot = clone.clone();
						var keyMergeList = keyMerge.split(".");
						for (let i = 0; i < keyMergeList.length; i++) {
							orgiSnaphot[keyMergeList[i]] = create();
							orgiSnaphot = orgiSnaphot[keyMergeList[i]];
						}
						eval("clone." + keyMerge)[skeys[skeys.length - 1]] = value;
					} else {
						var kMergeList = keyMerge.split(".");
						for (let i = 0; i < kMergeList.length; i++) {
							eval("clone." + shifting)[kMergeList[i]] = create();
							shifting = shifting + "." + kMergeList[i];
						}
						eval("clone." + shifting)[skeys[skeys.length - 1]] = value;
					}
				}
				return clone;
			}
			return recursion(keyList, _this);
		} else {
			this[key] = value;
		}
	}
	/**
	 *
	 * @param {String} key
	 * @param {Pocket} creator
	 */
	putAs(key, creator) {
		this[key] = creator;
	}
	/**
	 * @param {String} key pocket içinde ki anahtarı çağırmada kullanılır.
	 * @example
	 * Pocket{
	 * 	"name":"murat",
	 * 	"surname":"onay",
	 * 	"data":{
	 * 		"school":"fırat universitesi"
	 * 	}
	 * }
	 *
	 * pocket.get("name") output: "murat"
	 * pocket.get("data.school") output: "fırat universitesi"
	 */
	get(key) {
		try {
			var snapshot = this;

			function isObject(p) {
				var flag;
				p instanceof Pocket ? (flag = true) : (flag = false);
				return flag;
			}

			function recursion(_obj) {
				for (let i = 0; i < _obj.length; i++) {
					if (isObject(snapshot[_obj[i]])) {
						snapshot = snapshot[_obj[i]];
						recursion(snapshot);
					} else {
						i + 1 == _obj.length
							? (snapshot = snapshot[_obj[i]])
							: (snapshot = null);
					}
				}
				return snapshot;
			}
			return recursion(key.split("."));
		} catch (error) {
			return error;
		}
	}

	/**
	 * @param {Pocket} pocket
	 *
	 * 1- merge edeceğin veri bir Pocket olmalı(#pocket)\
	 * 2- Eğer merge edeceğin pocket içerisinde merge\
	 * ettiğin pocket içinde ki bir key mevcut ise merge ettiğin\
	 * pocket içinde ki key ezilir.\
	 * 3- Eğer #this içinde merge edilecek datanın keyleri yoksa\
	 * datalar #this içine aktarılır.
	 * @example
	 * pocket {"data":"pocket-value"}
	 * pocket2 {"data":"pocket2-value"}
	 *
	 * pocket.merge(pocket2)
	 * return {"data":"pocket2-value"}
	 */
	merge(pocket) {
		try {
			var pocketKey = pocket.isEmpty() ? null : pocket.getKeys();
			if (pocketKey != null) {
				for (let i = 0; i < pocketKey.length; i++) {
					if (this.exist(pocketKey[i])) {
						this.remove(pocketKey[i]);
						this[pocketKey[i]] = pocket[pocketKey[i]];
					} else {
						this[pocketKey[i]] = pocket[pocketKey[i]];
					}
				}
			}
		} catch (error) {
			console.log(error.message);
		}
	}
	/**
	 *
	 * @param {String} key
	 *  @returns Boolean (true or false)
	 * @example
	 * pocket.exist(key)
	 *
	 */
	exist(key) {
		var snapshot = this;
		if (snapshot[key] != undefined) {
			return true;
		} else {
			return false;
		}
	}
	/**
	 *
	 * @param {String} key
	 * @summary
	 * pocket.remove(key)
	 * @example
	 * pocket.remove(key)
	 */
	remove(key) {
		key.includes(".") ? eval("delete this." + key + ";") : delete this[key];
	}
	/**
	 * @returns Integer
	 */
	size() {
		return Object.keys(this).length;
	}
	/**
	 * @returns String
	 */
	getKeys() {
		return Object.keys(this);
	}
	/**
	 * @returns Pocket
	 */
	clone() {
		return this;
	}
	/**
	 *  @returns Boolean
	 */
	isPocket() {
		return this instanceof Pocket ? true : false;
	}
	/**
	 * @returns Boolean
	 */
	isEmpty() {
		return this.size() == 0 ? true : false;
	}
}
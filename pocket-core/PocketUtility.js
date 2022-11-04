import Pocket from './Pocket.js';
import PocketList from './PocketList.js';
/**
 *
 * @author İsmet Murat Onay
 */
const PocketUtility = {
	_keyStr: "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=",
	/**
	 * @example
	 * format : hour:minute AM/PM
	 * 18:57 PM
	 * 09:37 AM
	 */
	GetRealTime() {
		var time = new Date();
		var hour = time.getHours().toString();
		hour = hour.length == 1 ? '0'+hour:hour;
		var minutes = time.getMinutes().toString();
		minutes = minutes.length == 1 ? '0'+minutes:minutes;
		var second = time.getSeconds().toString();
		second = second.length == 1 ? '0'+second:second;
		var result = hour+minutes+second;
		return result;
	},
	/**
	 * @param {String} format "yyyyMMdd" "yyyyDDmm" "ddMMyyyy" "mmDDyyyy" Default('yyyyMMdd')
	 * @param {String} seperate {'-', '/', '.'}
	 *
	 */
	GetRealDate(format, seperate) {
		function isSeperate() {
			return seperate != undefined ? true : false;
		}
		var date = new Date();
		var fullDate = "";
		var day =
			date.getDay().toString().length == 1
				? "0" + date.getDay()
				: date.getDay();
		var month =
			date.getMonth().toString().length == 1
				? "0" + date.getMonth()
				: date.getMonth();
		var year = date.getFullYear();

		var DEFAULT = year.toString() + month.toString() + day.toString();
		var SEPETARED =
			year.toString() + seperate + month.toString() + seperate + day.toString();
		if (format == undefined) fullDate = DEFAULT;
		if (format == "yyyyMMdd") fullDate = !isSeperated() ? DEFAULT : SEPETARED;
		if (format == "yyyyDDmm")
			fullDate = !isSeperate()
				? year.toString() + day.toString() + month.toString()
				: year.toString() +
				  seperate +
				  day.toString() +
				  seperate +
				  month.toString();
		if (format == "ddMMyyyy")
			fullDate = !isSeperate()
				? day.toString() + month.toString() + year.toString()
				: day.toString() +
				  seperate +
				  month.toString() +
				  seperate +
				  year.toString();
		if (format == "mmDDyyyy")
			fullDate = !isSeperate()
				? month.toString() + day.toString() + year.toString()
				: month.toString() +
				  seperate +
				  day.toString() +
				  seperate +
				  year.toString();
		return fullDate;
	},
	/**
	 * @return
	 * return generateId format 'aaaaaaaa'-'aaaa'-'aaaa'-'aaaa'-'aaaaaaaa'
	 */
	GenerateOID() {
		let s4 = () => {
			return Math.floor((1 + Math.random()) * 0x10000)
				.toString()
				.substring(1);
		};
		//return id format 'aaaaaaaa'-'aaaa'-'aaaa'-'aaaa'-'aaaaaaaa'
		return (
			s4() + s4() + "-" + s4() + "-" + s4() + "-" + s4() + "-" + s4() + s4()
		);
	},
	/**
	 * @param {String} input Metni şifreleyen method
	 * @using PocketUtility.Encode("şifrelenecek metin")
	 */
	Encode(input) {
		var output = "";
		var chr1, chr2, chr3, enc1, enc2, enc3, enc4;
		var i = 0;
		input = this._utf8_encode(input);
		while (i < input.length) {
			chr1 = input.charCodeAt(i++);
			chr2 = input.charCodeAt(i++);
			chr3 = input.charCodeAt(i++);
			enc1 = chr1 >> 2;
			enc2 = ((chr1 & 3) << 4) | (chr2 >> 4);
			enc3 = ((chr2 & 15) << 2) | (chr3 >> 6);
			enc4 = chr3 & 63;
			if (isNaN(chr2)) {
				enc3 = enc4 = 64;
			} else if (isNaN(chr3)) {
				enc4 = 64;
			}
			output =
				output +
				this._keyStr.charAt(enc1) +
				this._keyStr.charAt(enc2) +
				this._keyStr.charAt(enc3) +
				this._keyStr.charAt(enc4);
		}
		return output;
	},
	/**
	 * @param {String} input Şifrelenmiş metni çözen method
	 * @using PocketUtility.Decode("şifreli metin")
	 */
	Decode(input) {
		var output = "";
		var chr1, chr2, chr3;
		var enc1, enc2, enc3, enc4;
		var i = 0;
		input = input.replace(/[^A-Za-z0-9\+\/\=]/g, "");
		while (i < input.length) {
			enc1 = this._keyStr.indexOf(input.charAt(i++));
			enc2 = this._keyStr.indexOf(input.charAt(i++));
			enc3 = this._keyStr.indexOf(input.charAt(i++));
			enc4 = this._keyStr.indexOf(input.charAt(i++));
			chr1 = (enc1 << 2) | (enc2 >> 4);
			chr2 = ((enc2 & 15) << 4) | (enc3 >> 2);
			chr3 = ((enc3 & 3) << 6) | enc4;
			output = output + String.fromCharCode(chr1);
			if (enc3 != 64) {
				output = output + String.fromCharCode(chr2);
			}
			if (enc4 != 64) {
				output = output + String.fromCharCode(chr3);
			}
		}
		output = this._utf8_decode(output);
		return output;
	},

	/**
	 * @private
	 * @param {String} string
	 */
	_utf8_encode(string) {
		string = string.replace(/\r\n/g, "\n");
		var utftext = "";
		for (var n = 0; n < string.length; n++) {
			var c = string.charCodeAt(n);
			if (c < 128) {
				utftext += String.fromCharCode(c);
			} else if (c > 127 && c < 2048) {
				utftext += String.fromCharCode((c >> 6) | 192);
				utftext += String.fromCharCode((c & 63) | 128);
			} else {
				utftext += String.fromCharCode((c >> 12) | 224);
				utftext += String.fromCharCode(((c >> 6) & 63) | 128);
				utftext += String.fromCharCode((c & 63) | 128);
			}
		}
		return utftext;
	},
	/**
	 * @private
	 * @param {String} utftext
	 */
	_utf8_decode(utftext) {
		var string = "";
		var i = 0;
		var c = (c1 = c2 = 0);
		while (i < utftext.length) {
			c = utftext.charCodeAt(i);
			if (c < 128) {
				string += String.fromCharCode(c);
				i++;
			} else if (c > 191 && c < 224) {
				c2 = utftext.charCodeAt(i + 1);
				string += String.fromCharCode(((c & 31) << 6) | (c2 & 63));
				i += 2;
			} else {
				c2 = utftext.charCodeAt(i + 1);
				c3 = utftext.charCodeAt(i + 2);
				string += String.fromCharCode(
					((c & 15) << 12) | ((c2 & 63) << 6) | (c3 & 63)
				);
				i += 3;
			}
		}
		return string;
	},
	/**
	 *
	 * @param {Object} json
	 * @returns {Pocket}
	 */
	ConvertToPocket(json) {
		var snapshot = json;
		var pocket = new Pocket();
		var pocketList = new PocketList();
		var memory = new String();
		function traverse(obj, callback, trail) {
			trail = trail || [];
			Object.keys(obj).forEach(function (key) {
				var value = obj[key];
				if (Object.getPrototypeOf(value) === Object.prototype) {
					traverse(value, callback, trail.concat(key));
				} else {
					callback.call(obj, key, value, trail);
				}
			});
		}

		traverse(snapshot, function (key, value, trail) {
			if (trail == "") {
				pocket.put(key, value);
			} else {
				if (trail.length == 1) {
					memory = memory + trail[0] + "." + key;
				} else if (trail.length >= 2) {
					for (let i = 0; i < trail.length; i++) {
						if (i == 0) {
							memory = trail[0];
						} else {
							memory = memory + "." + trail[i];
						}
					}
				}
				pocket.put(memory, value);
				memory = "";
			}
		});
		return pocket;
	},
	TimeStamp(){
		return Date.now();
	},
	/**
	 *
	 * @param {String} str
	 */
	ReverseString(str){
		return str.split("").reverse().join("");
	},
};
export default PocketUtility;

import Pocket from './Pocket.js';
import PocketList from './PocketList.js';
import { Console } from 'console';
import { Transform } from 'stream';
/**
 *
 * @author İsmet Murat Onay
 */
let PocketUtility = (
	function() {
		const _keyStr= "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";
		/**
		 * @example
		 * format : hour:minute AM/PM
		 * 18:57 PM
		 * 09:37 AM
		 */
		function GetRealTime() {
			let time = new Date();
			let hour = time.getHours().toString();
			hour = hour.length == 1 ? '0'+hour:hour;
			let minutes = time.getMinutes().toString();
			minutes = minutes.length == 1 ? '0'+minutes:minutes;
			let second = time.getSeconds().toString();
			second = second.length == 1 ? '0'+second:second;
			let result = hour+minutes+second;
			return result;
		}

		/**
		 * @param {String} format "yyyyMMdd" "yyyyDDmm" "ddMMyyyy" "mmDDyyyy" Default('yyyyMMdd')
		 * @param {String} seperate {'-', '/', '.'}
		 *
		 */
		function GetRealDate(format, seperate) {
			function isSeperate() {
				return seperate != undefined ? true : false;
			}
			let date = new Date();
			let fullDate = "";
			let day =
				date.getDay().toString().length == 1
					? "0" + date.getDay()
					: date.getDay();
			let month =
				date.getMonth().toString().length == 1
					? "0" + date.getMonth()
					: date.getMonth();
			let year = date.getFullYear();

			let DEFAULT = year.toString() + month.toString() + day.toString();
			let SEPETARED =
				year.toString() + seperate + month.toString() + seperate + day.toString();
			if (format == undefined) fullDate = DEFAULT;
			if (format == "yyyyMMdd") fullDate = !isSeperated() ? DEFAULT : SEPETARED;
			return fullDate;
		}
		/**
		 * @return
		 * return generateId format 'aaaaaaaa'-'aaaa'-'aaaa'-'aaaa'-'aaaaaaaa'
		 */
		function GenerateOID() {
			let s4 = () => {
				return Math.floor((1 + Math.random()) * 0x10000)
					.toString()
					.substring(1);
			};
			//return id format 'aaaaaaaa'-'aaaa'-'aaaa'-'aaaa'-'aaaaaaaa'
			return (
				s4() + s4() + "-" + s4() + "-" + s4() + "-" + s4() + "-" + s4() + s4()
			);
		}
		/**
		 * @param {String} input Metni şifreleyen method
		 * @using PocketUtility.Encode("şifrelenecek metin")
		 */
		function Encode(input) {
			let output = "";
			let chr1, chr2, chr3, enc1, enc2, enc3, enc4;
			let i = 0;
			input = _utf8_encode(input);
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
					_keyStr.charAt(enc1) +
					_keyStr.charAt(enc2) +
					_keyStr.charAt(enc3) +
					_keyStr.charAt(enc4);
			}
			return output;
		}
		/**
		 * @param {String} input Şifrelenmiş metni çözen method
		 * @using PocketUtility.Decode("şifreli metin")
		 */
		function Decode(input) {
			let output = "";
			let chr1, chr2, chr3;
			let enc1, enc2, enc3, enc4;
			let i = 0;
			input = input.replace(/[^A-Za-z0-9\+\/\=]/g, "");
			while (i < input.length) {
				enc1 = _keyStr.indexOf(input.charAt(i++));
				enc2 = _keyStr.indexOf(input.charAt(i++));
				enc3 = _keyStr.indexOf(input.charAt(i++));
				enc4 = _keyStr.indexOf(input.charAt(i++));
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
			output = _utf8_decode(output);
			return output;
		}

		function _utf8_encode(string) {
			string = string.replace(/\r\n/g, "\n");
			let utftext = "";
			for (let n = 0; n < string.length; n++) {
				let c = string.charCodeAt(n);
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
		}

		function _utf8_decode(utftext) {
			let string = "";
			let i = 0;
			let c = (c1 = c2 = 0);
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
		}
		/**
		 *
		 * @param {Object} json
		 * @returns {Pocket}
		 */
		function ConvertToPocket(json) {
			let snapshot = json;
			let pocket = new Pocket();
			let pocketList = new PocketList();
			let memory = "";
			function traverse(obj, callback, trail) {
				trail = trail || [];
				Object.keys(obj).forEach(function (key) {
					let value = obj[key];
					if (isObject(value)) {
						traverse(value, callback, trail.concat(key));
					}
					else if(isArray(value)){
						value.forEach(arrVal=>{
							traverse(value, callback, trail.concat(key));
						});
					}
					else {
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
						if(isArray(trail)){
							pocketList.add(new Pocket().put(key,value));
						}
						else{
							for (let i = 0; i < trail.length; i++) {

								if (i == 0) {
									memory = trail[0];
								} else {
									memory = memory + "." + trail[i];
								}

							}
						}
					}
					pocket.put(memory, value);
					memory = "";
				}
			});
			return pocket;
		}
		function TimeStamp(){
			return Date.now();
		}

		function table(input) {
			const ts = new Transform({ transform(chunk, enc, cb) { cb(null, chunk) } })
			const logger = new Console({ stdout: ts })
			logger.table(input)
			const table = (ts.read() || '').toString()
			let result = '';
			for (let row of table.split(/[\r\n]+/)) {
			  let r = row.replace(/[^┬]*┬/, '┌');
			  r = r.replace(/^├─*┼/, '├');
			  r = r.replace(/│[^│]*/, '');
			  r = r.replace(/^└─*┴/, '└');
			  r = r.replace(/'/g, ' ');
			  result += `${r}\n`;
			}
			console.log(result);
		}
		/**
		 *
		 * @param {any} obj
		 * @returns {Boolean}
		 */
		function isEmptyObject(object){
			for(let checker in object){
				return !1;
			}
			return !0;
		}
		/**
		 *
		 * @param {String} str
		 */
		function ReverseString(str){
			return str.split("").reverse().join("");
		}

		function isObject(value) {
			return Object.prototype.toString.call(value) == "[object Object]"
		}
		function isArray(value) {
			return Object.prototype.toString.call(value) == "[object Array]"
		}
		function isString(value) {
			return Object.prototype.toString.call(value) == "[object String]"
		}

		return {
			GetRealTime 	:  GetRealTime,
			GetRealDate 	:  GetRealDate,
			GenerateOID 	:  GenerateOID,
			ReverseString	:  ReverseString,
			isEmptyObject	:  isEmptyObject,
			table			:  table,
			TimeStamp		:  TimeStamp,
			ConvertToPocket	:  ConvertToPocket,
			Encode			:  Encode,
			Decode			:  Decode,
			isObject		:  isObject,
			isArray			:  isArray,
			isString		:  isString
		}
	}
)();
export default PocketUtility;

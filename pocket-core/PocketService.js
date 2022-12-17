import { fork } from 'child_process';
import Pocket from './Pocket.js'
import PocketUtility from './PocketUtility.js';
import { ServiceParameter,ServiceError } from "../util/constant.js";
const { default: pocketConfig } = await import("../pocket-config.json",
	{
		assert:
		{
			type: "json",
		}
	});
const PocketService = {
	/**
	 * @private
	 * @returns {Promise}
	 */
	ServiceRunner(handler, parameter, callback) {
		/**
		 *
		 * @param {NodeRequire} handler
		 * @param {Pocket} callback
		 */
		function run(handler, callback) {
			let servicePath = pocketConfig.settings.servicePath + "/" + handler + ".js";
			var process = fork(servicePath);

			process.on("message", function (argv) {
				callback(argv);
			});
			process.on("exit", function (argv) {
				process.kill();
			});
			if (parameter != undefined) process.send(parameter);
		}
		/**
		 * @private
		 */
		run(handler, function (argv) {
			callback(argv);
		});
	},
	/**
	 * @param {String} script Script'in folder pathini yazıyoruz.
	 * @param {String} cron Cron time formatını yazıyoruz.
	 *
	 */
	execute(handler, parameter, callback) {
		this.ServiceRunner(handler, parameter, callback);
	},
	/**
	 * @private
	 * @param {String} url
	 * @returns
	 */
	getServiceName(url) {
		let reversed = url.match(".js").input.split("").reverse().join("");
		return reversed
			.substring(3, this.findFirstSlash(reversed))
			.split("")
			.reverse()
			.join("");
	},
	/**
	 * @private
	 * @param {String} param
	 * @returns
	 */
	findFirstSlash(param) {
		let temp = "";
		let i = 0;
		while (true) {
			if (param[i] === "/") {
				break;
			}
			temp = temp + param[i];
			i = i + 1;
		}
		return temp.substring(3, temp.length).length + 3;
	},
	parameter(field, mandatory) {
		if (mandatory == ServiceParameter['MUST | FILL'])
		{
			if (!PocketUtility.isEmptyObject(field))
			{
				return true;
			}
			else
			{

				throw new Error(ServiceError.MISSING_PARAMETER).stack;
			}
		}
		else return true;
	}
}
export default PocketService;
import { fork } from 'child_process';
import Pocket from './Pocket.js'
import PocketUtility from './PocketUtility.js';
import { ServiceParameter,ServiceError } from "../util/constant.js";
import { privateEncrypt } from 'crypto';
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
	 * @returns {callback}
	 * this property is hidden
	 */
	ServiceRunner(handler, parameter, callback)
	{
		/**
		 *
		 * @param {NodeRequire} handler
		 * @param {Pocket} callback
		 */
		function run(handler, callback)
		{
			let servicePath = pocketConfig.settings.servicePath + "/" + handler + ".js";
			var process = fork(servicePath);

			process.on("message", function (argv)
			{
				callback(argv);
			});
			process.on("exit", function (argv)
			{
				process.kill();
			});
			if (parameter != undefined) process.send(parameter);
		}
		/**
		 * @private
		 */
		run(handler, function (argv)
		{
			callback(argv);
		});
	},
	/**
	 * @param {String} handler Script name.
	 * @param {String} parameter Service parameter.
	 * @param {callback} callback return callback
	 */
	execute(handler, parameter, callback)
	{

		this.ServiceRunner(handler, parameter, callback);
	},
	/**
	 * @private
	 * @param {String} url
	 * @returns
	 */
	getServiceName(url)
	{
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
	findFirstSlash(param)
	{
		let temp = "";
		let i = 0;
		while (true)
		{
			if (param[i] === "/") break;
			temp = temp + param[i];
			i = i + 1;
		}
		return temp.substring(3, temp.length).length + 3;
	},
	/**
	 * @private
	 * @param {String} field input service parameter
	 * @param {String} mandatory service input mandatory
	 * @returns {Boolean | throw}
	 */
	parameter(field, mandatory)
	{
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

/*
var descriptor =
{
	enumerable	: false,
	configurable: false,
	writable	: false,
	value		: new Error("this property is .")
}
Object.defineProperty(PocketService, 'ServiceRunner' , descriptor);
Object.defineProperty(PocketService, 'getServiceName', descriptor);
Object.defineProperty(PocketService, 'findFirstSlash', descriptor);*/
export default PocketService;
import PocketUtility from './PocketUtility.js';
import PocketMongo from './PocketMongo.js';
import { schedule } from 'node-cron';
import { fork } from 'child_process';
import { MongoQueryFrom } from '../util/constant.js';
import Pocket from './Pocket.js';
export default class PocketBatchManager {
	/**
	 * @private
	 */
	RunnableBatch(batchPath) {
		function runScript(batchPath, callback) {
			let invoked = false;
			let process = fork(batchPath);
			process.on("error", function (err) {
				if (invoked) return;
				invoked = true;
				callback(err);
			});
			process.on("exit", function (code) {
				if (invoked) return;
				invoked = true;
				var err = code === 0 ? null : new Error("exit code " + code);
				callback(err);
			});
		}
		/**
		 * @private
		 */
		runScript(batchPath, function (err) {
			if (err) throw err;
			var log = new Pocket();
			log.put("insertTime",PocketUtility.GetRealTime());
			log.put("insertDate",PocketUtility.GetRealDate());
			log.put("service",batchPath);
			try
			{
				new PocketMongo().executeInsert(
					{
						from : MongoQueryFrom.LOGS,
						params: log
					},
					(response)=>
					{
						if(response)
						{
							console.log("[ "+PocketUtility.GetRealDate()+" - "+PocketUtility.GetRealTime()+" ] "+ batchPath + " run and terminated successfull.");
						}
					}
				)
			}
			catch (error)
			{
				throw new Error("Logging Error.").stack
			}

		});
	}
	/**
	 * @param {String} script Script'in folder pathini yazıyoruz.
	 * @param {String} cron Cron time formatını yazıyoruz.
	 * @example
	 * new PocketBatchManager().execute('./batch/testBatch.js',"* * * * *") -> Every Minutes Run
	 */
	execute(script, cron) {
		console.log("[" + this.getBatchName(script) + "]" + " is included in the job queue.");
		schedule(cron, () => {
			this.RunnableBatch(script);
		});
	}
	/**
	 *
	 * @param {Array} bulkArray
	 */
	executeBulk(bulkArray) {
		var infoBatch = [];
		bulkArray.forEach(bulkBatchs=>{
			infoBatch.push({
				"Batch Name":this.getBatchName(bulkBatchs.script),
				"Cron":bulkBatchs.cron,
				"Process PID":process.pid
			});
		});
		PocketUtility.table(infoBatch);
		bulkArray.forEach(singleBulkBatch=>{
			schedule(singleBulkBatch.cron, () => {
				this.RunnableBatch(singleBulkBatch.script);
			});
		})
	}
	/**
	 * @private
	 * @param {String} url
	 * @returns
	 */
	getBatchName(url) {
		let reversed = url.match(".js").input.split("").reverse().join("");
		return reversed
			.substring(3, this.findFirstSlash(reversed))
			.split("")
			.reverse()
			.join("");
	}
	/**
	 * @private
	 * @param {String} param
	 * @returns
	 */
	findFirstSlash(param) {
		var temp = "";
		var i = 0;
		while (true) {
			if (param[i] === "/") {
				break;
			}
			temp = temp + param[i];
			i = i + 1;
		}
		return temp.substring(3, temp.length).length + 3;
	}
}
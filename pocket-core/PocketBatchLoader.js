import Pocket from './Pocket.js';
import  PocketBatchManager  from './PocketBatchManager.js';
import PocketMongo from './PocketMongo.js';
import PocketUtility from './PocketUtility.js';
import fs from 'fs';
import path from 'path';
import {MongoQueryFrom,Status} from '../util/constant.js';
const { default: batchConfigFiles } = await import("../pocket-config.json",
{
    assert:
	{
      type: "json",
    }
});
export default class PocketBatchLoader
{
	/**
	 *
	 * @param {Array} dbBatchs
	 * @param {callback} callback
	 * @param {Array} configBatchs
	 * @returns {Boolean}
	 */
	synchronize(dbBatchs,configBatchs, callback)
	{
		/**
		 * @param {*} local
		 * @returns {Pocket}
		 */
		let dbClient = new PocketMongo();
		let callbackCount=0;
		configBatchs.forEach(confBatch=>{
			let find = false;
			for(const element of dbBatchs)
			{
				if(confBatch.name == element.name)
				{
					find = true;
				}
			}
			if(find)
			{
				let filter = new Pocket();
				filter.put("name",confBatch.name)
				dbClient.executeUpdate(
					{
						from:MongoQueryFrom.BATCH,
						where:filter,
						params:PocketUtility.ConvertToPocket(confBatch),
						done:(response)=>{

						},
						fail:(error)=>{
							throw new Error(error);
						}
					}
				)
			}
			else
			{
				dbClient.executeInsert(
					{
						from:MongoQueryFrom.BATCH,
						params:PocketUtility.ConvertToPocket(confBatch),
						done:(response)=>{

						},
						fail:(error)=>{
							throw new Error(error);
						}
					}
				)
			}
			callbackCount++;
		})
		if(callbackCount == configBatchs.length)
		{
			callback(true)
		}
		else
		{
			callback(false)
		}
	}
	/**
	 * @private
	 * @param {Array} localFolder
	 * @param {Array} localConfig
	 * @returns {Boolean}
	 */
	compareLocal(localFolder,localConfig)
	{
		if(localConfig.length != localFolder.length)
		{
			return false;
		}
		else
		{
			let flag = false;
			localConfig.forEach(localConfigBatch=>{
				for(const element of localFolder)
				{
					if(localConfigBatch.name == element.split('.')[0])
					{
						flag = true;
						break;
					}
				}
			})
			return flag;
		}
	}
	/**
	 * Güncel Batchler ile kayıtlı batchleri senkronize eder.
	 */
	load(callback)
	{
		let batchFolderPath = "./batchs";
		let _batchConfigFiles = batchConfigFiles.batchs;
		fs.readdir(batchFolderPath, function (err, batchFolderFiles)
		{
			let dbClient = new PocketMongo();
			let filterPocket = new Pocket();
			filterPocket.put("type","batch");
			filterPocket.put("status",Status.ACTIVE);
			dbClient.executeGet({
				from:MongoQueryFrom.BATCH,
				where:filterPocket,
				done: (responseDbBatch) =>{
					if(new PocketBatchLoader().compareLocal(batchFolderFiles,_batchConfigFiles))
					{
						new PocketBatchLoader().synchronize(responseDbBatch,_batchConfigFiles,
							(sync)=>
							{
								var syncResponse = new Pocket();
								syncResponse.put("state",sync)
								syncResponse.put("batchs",_batchConfigFiles);
								callback(syncResponse);
							})
					}
					else
					{
						throw new Error("Local batch dosya dizini ve local batch config uyumsuzluğu mevcut. \nBatch tanimlarinizi gözden gecirin.")
					}
				},
				fail:(error)=>{
					throw new Error(error);
				}
			})
		});
	}
}
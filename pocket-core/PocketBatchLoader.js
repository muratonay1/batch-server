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
		var dbClient = new PocketMongo();
		var callbackCount=0;
		configBatchs.forEach(confBatch=>{
			var find = false;
			for(let i=0;i<dbBatchs.length;i++)
			{
				if(confBatch.name == dbBatchs[i].name)
				{
					find = true;
				}
			}
			if(find)
			{
				var filter = new Pocket();
				filter.put("name",confBatch.name)
				dbClient.executeUpdate(
					{
						from:MongoQueryFrom.BATCH,
						filter:filter,
						params:PocketUtility.ConvertToPocket(confBatch)
					},
					(response)=>{

					}
				)
			}
			else
			{
				dbClient.executeInsert(
					{
						from:MongoQueryFrom.BATCH,
						params:PocketUtility.ConvertToPocket(confBatch)
					},
					(response)=>
					{

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
			var flag = false;
			for(let i = 0 ; i < localConfig.length ; i++)
			{
				if(localFolder[i].split('.')[0] != localConfig[i].name)
				{
					flag = false;
					break;
				}
				else
				{
					flag=true;
				}
			}
			return flag;
		}
	}
	/**
	 * Güncel Batchler ile kayıtlı batchleri senkronize eder.
	 */
	load(callback)
	{
		var batchFolderPath = "./batchs";
		var _batchConfigFiles = batchConfigFiles.batchs;
		fs.readdir(batchFolderPath, function (err, batchFolderFiles)
		{
			var dbClient = new PocketMongo();
			var filterPocket = new Pocket();
			filterPocket.put("type","batch");
			filterPocket.put("status",Status.ACTIVE);
			dbClient.executeGet(
				{
					from:MongoQueryFrom.BATCH,
					filter:filterPocket
				},
				(responseDbBatch)=>
				{
					if(new PocketBatchLoader().compareLocal(batchFolderFiles,_batchConfigFiles))
					{
						new PocketBatchLoader().synchronize(responseDbBatch,_batchConfigFiles,
							(sync)=>
							{
								var syncResponse = new Pocket();
								syncResponse.put("state",sync)
								syncResponse.put("batchs",responseDbBatch);
								callback(syncResponse);
							})
					}
					else
					{
						throw new Error("Local batch dosya dizini ve local batch config uyumsuzluğu mevcut. \nBatch tanimlarinizi gözden gecirin.")
					}
				}
			)
		});
	}
}
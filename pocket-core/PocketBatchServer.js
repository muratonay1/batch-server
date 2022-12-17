import PocketMongo from "./PocketMongo.js";
import Pocket from './Pocket.js';
import PocketBatchLoader from "./PocketBatchLoader.js";
import PocketBatchManager from "./PocketBatchManager.js";
import { ExecuteBatchType } from "../util/constant.js";
import PocketConfigManager from "./PocketConfigManager.js";
import PocketUtility from "./PocketUtility.js";
const { default: batchBulk } = await import("../pocket-config.json",
{
    assert:
	{
      type: "json",
    }
});
export default class BatchServer{
    run()
    {
        try {
            console.clear();
            new PocketConfigManager().startApplicationInfo().then((serverInfo)=>{
                PocketUtility.table(serverInfo);
                new PocketBatchLoader().load(load=>{
                    if(load.state){
                        if(batchBulk.settings.executeBatchType == ExecuteBatchType.BULK){
                            var bulk = [];
                            load.batchs.forEach(batch=>{
                                bulk.push({script:batch.path,cron:batch.cron})
                            });
                            new PocketBatchManager().executeBulk(bulk);
                        }
                        else if(batchBulk.settings.executeBatchType == ExecuteBatchType.SINGLE){
                            load.batchs.forEach(batch=>{
                                new PocketBatchManager().execute(batch.path,batch.cron);
                            });
                        }
                    }
                    else{
                        throw new Error("Batch load failed.\nBatch loaded status: ")
                    }
                });
            }).catch((error)=>{
                throw new Error("(error) server Info loading").stack
            })

        } catch (error) {
            throw new Error("Batch server is not running.\n FAILED RUN. \nDetail: "+error);
        }
    }
}
import PocketMongo from "./PocketMongo.js";
import Pocket from './Pocket.js';
import PocketBatchLoader from "./PocketBatchLoader.js";
import PocketBatchManager from "./PocketBatchManager.js";
export default class BatchServer{
    run()
    {
        try {
            console.clear();
            new PocketBatchLoader().load(load=>{
                if(load.state){
                    load.batchs.forEach(batch=>{
                        new PocketBatchManager().execute(batch.path,batch.cron);
                    })
                }
                else{
                    throw new Error("Batch load failed.\nBatch loaded status: ")
                }
            });
        } catch (error) {
            throw new Error("Batch server is not running.\n FAILED RUN. \nDetail: "+error);
        }
    }
}
import Pocket from "../pocket-core/Pocket.js";
import PocketResponse from "../pocket-core/PocketResponse.js";
import PocketMongo from '../pocket-core/PocketMongo.js';
import PocketService from "../pocket-core/PocketService.js";
import {ServiceParameter} from "../util/constant.js";



process.on("message",(criteria)=>{
    PocketService.parameter(criteria,ServiceParameter["MUST | FILL"]);
    let dbClient = new PocketMongo();


    dbClient.executeGet(
        {
            from : "test.testCollection",
            filter: createFilter(criteria)
        },
        (responsePersonal)=>
        {
            PocketService.execute("GetMongoLogs",{"service":"./batchs/addDataBatch.js"},(repsonseLogs)=>{
                let senderArgs = new Pocket();
                senderArgs.put("logs",repsonseLogs);
                senderArgs.put("personalInfo",responsePersonal);
                process.send(senderArgs);
                process.exit();
                process.kill();
            })
        }
    )
})

function createFilter(criteria)
{
    let filter = new Pocket();
    Object.keys(criteria).forEach(crit=>{
        filter.put(crit,criteria[crit]);
    })
    return filter;
}
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
            PocketService.execute({
                handler:"GetMongoLogs",
                params:{"service":"./batchs/addDataBatch.js"},
                done:(response)=>{
                    let senderArgs = new Pocket();
                    senderArgs.put("logs",response);
                    senderArgs.put("personalInfo",responsePersonal);
                    process.send(senderArgs);
                    process.exit();
                    process.kill();
                },
                fail:(error)=>{
                    throw new Error(error);
                }
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
import Pocket from "../pocket-core/Pocket.js";
import PocketResponse from "../pocket-core/PocketResponse.js";
import PocketMongo from '../pocket-core/PocketMongo.js';
import PocketUtility from '../pocket-core/PocketUtility.js';
import PocketService from "../pocket-core/PocketService.js";
import {ServiceParameter} from "../util/constant.js";
let dbClient
 = new PocketMongo();

process.on("message",(criteria)=>{

    PocketService.parameter(criteria,ServiceParameter["MUST | FILL"]);
    dbClient.executeGet(
        {
            from: "admin.logs",
            filter: criteria
        },
        (responseDbBatch) => {
            process.send(responseDbBatch);
            process.exit();
            process.kill();
        }
    )
});

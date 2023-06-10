import fetch from 'node-fetch';
import Pocket from './pocket-core/Pocket.js';
import PocketMongo from "./pocket-core/PocketMongo.js";
import PocketUtility from './pocket-core/PocketUtility.js';
import PocketService from './pocket-core/PocketService.js';

// sample service call
PocketService.execute({
    handler:"GetMongoLogs",
    params:{"service":"./batchs/endOfDayProcessBatch.js"},
    done:(response)=>{
        console.log(response);
    },
    fail:(error)=>{
        throw new Error("error");
    }
})

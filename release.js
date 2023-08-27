import fetch from 'node-fetch';
import Pocket from './pocket-core/Pocket.js';
import PocketMongo from "./pocket-core/PocketMongo.js";
import PocketUtility from './pocket-core/PocketUtility.js';
import PocketService from './pocket-core/PocketService.js';
import { MongoQueryFrom } from './util/constant.js';
let dbClient = new PocketMongo();
/*
PocketService.execute({
    handler:"GetCurrentServerInfo",
    params:{"":""},
    done:(response)=>{
        console.log(response);
    },
    fail:(error)=>{
        console.log(error);
    }
})
*/


// sample db actions
console.log("running now...");
dbClient.executeGet({
    from: MongoQueryFrom.TEST_COLLECTION,
    where:{"email":"murat.onay@gmail.com"},
    done:(response)=>{
        console.log("response expected...");
        console.log(response);
    },
    fail:(error)=>{
        console.log(error);
    }
})



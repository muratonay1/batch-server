import Pocket from "./pocket-core/Pocket.js";
import PocketService from "./pocket-core/PocketService.js";
import PocketUtility from "./pocket-core/PocketUtility.js";

PocketService.execute("GetMongoLogs",{"name":"test"},(response)=>{
    console.log("response = ");
    console.log(response)
})
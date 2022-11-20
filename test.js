import PocketConfigManager from './pocket-core/PocketConfigManager.js';
import PocketUtility from './pocket-core/PocketUtility.js';

let configManager = new PocketConfigManager();

configManager.startApplicationInfo().then((response)=>{


}).catch((error)=>{
    console.log(error);
})
/*

This snippets is using for only new create micro service template...

Author: www.github.com/muratonay1

*/

import Pocket from '../pocket-core/Pocket.js';
import PocketMongo from '../pocket-core/PocketMongo.js';
import PocketUtility from '../pocket-core/PocketUtility.js';
import PocketService from '../pocket-core/PocketService.js';
import {ServiceParameter} from '../util/constant.js';


process.on('message', (inParameter)=>{

    PocketService.parameter(inParameter,ServiceParameter['MUST | FILL']);

    process.send(returnParameter);
    process.exit();
    process.kill();
});
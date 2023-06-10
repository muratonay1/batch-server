/*

This snippets is using for only new create micro service template...

Author: www.github.com/muratonay1

*/

import Pocket from '../pocket-core/Pocket.js';
import PocketMongo from '../pocket-core/PocketMongo.js';
import PocketUtility from '../pocket-core/PocketUtility.js';
import PocketService from '../pocket-core/PocketService.js';
import {ServiceParameter,Status} from '../util/constant.js';

process.on('message', (seher)=>{
    PocketService.parameter(seher,ServiceParameter['MUST | FILL'])
    var filterPocket = Pocket.prototype.create();

    filterPocket.put("status",Status.ACTIVE);

    new PocketMongo().executeGet(
        {
            from:'admin.server',
            filter:filterPocket
        },
        (serverInfoResponse)=>
        {
            process.send(serverInfoResponse);
            process.exit();
            process.kill();
        }
    )
});
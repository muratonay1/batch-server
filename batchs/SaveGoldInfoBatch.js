import fetch from 'node-fetch';
import Pocket from '../pocket-core/Pocket.js';
import PocketMongo from "../pocket-core/PocketMongo.js";
import PocketUtility from '../pocket-core/PocketUtility.js';
await fetch('https://finans.truncgil.com/today.json')
    .then(response => response.json())
    .then(data => {
        let insertExchange = new Pocket();
        let out = new Pocket();
        let dbClient = new PocketMongo();
        let gr_gold = data["gram-altin"]["Alış"]
        out.put("type","Gram-Altın")
        .put("currency",gr_gold);
        dbClient.executeInsert({
            from:"test.exchangeInformation",
            params:out,
            done:(insertResponse)=>{
                if(insertResponse){
                    return true;
                }
            },
            fail:(error)=>{
                throw new Error(error);
            }
        })
    });
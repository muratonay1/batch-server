import fetch from 'node-fetch';
import Pocket from '../pocket-core/Pocket.js';
import PocketMongo from "../pocket-core/PocketMongo.js";
import PocketUtility from '../pocket-core/PocketUtility.js';
await fetch('http://hasanadiguzel.com.tr/api/kurgetir')
    .then(response => response.json())
    .then(data => {
        let insertExchange = new Pocket();
        let out = new Pocket();
        let dbClient = new PocketMongo();
        data.TCMB_AnlikKurBilgileri.forEach(exchange=>{
            insertExchange.merge(PocketUtility.ConvertToPocket(exchange));
            out.put("exchanges."+insertExchange.get("CurrencyName"),insertExchange);
            out.put("insertDate",PocketUtility.GetRealDate());
            out.put("insertTime",PocketUtility.GetRealTime());
            insertExchange = new Pocket();
        })
        dbClient.executeInsert({
            from:"test.exchangeInformatio",
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
import fetch from 'node-fetch';
import Pocket from '../pocket-core/Pocket.js';
import PocketList from '../pocket-core/PocketList.js';
import PocketMongo from "../pocket-core/PocketMongo.js";
import PocketUtility from '../pocket-core/PocketUtility.js';
fetch('http://hasanadiguzel.com.tr/api/kurgetir')
    .then(response => response.json())
    .then(data => {
        console.log("req,res successfull.");
        var exhangeList = new PocketList();
        var insertExchange = new Pocket();
        var out = new Pocket();
        data.TCMB_AnlikKurBilgileri.forEach(exchange=>{
            insertExchange.merge(PocketUtility.ConvertToPocket(exchange));
            out.put("exchanges."+insertExchange.get("CurrencyName"),insertExchange);
            out.put("insertDate",PocketUtility.GetRealDate());
            out.put("insertTime",PocketUtility.GetRealTime());
            insertExchange = new Pocket();
        })
        new PocketMongo().executeInsert(
            {
                from:"test.exchangeInformation",
                params:out
            },
            (insertResponse)=>
            {
                if(insertResponse){
                    console.log("inserted successfull.");
                }
            }
        )
    });
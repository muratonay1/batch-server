import PocketUtility from './PocketUtility.js';
import Pocket from './Pocket.js';
import {ConfigError} from '../util/constant.js';
import PocketList from './PocketList.js';
const { default: config } = await import("../pocket-config.json",
{
    assert:
	{
      type: "json",
    }
});

export default class PocketConfigManager{

    /**
     * String first char uppercase
     * @param {String} string
     * @private
     */
    capitalizeFirstLetter(string){
        return string.charAt(0).toUpperCase() + string.slice(1);
    }
    /**
     * get batch server info batch
     * @returns
     *
     */
    startApplicationInfo(parameter)
    {
        try
        {
            return new Promise(function(resolve,reject) {
                var application;
                if(config.application != undefined) application = config.application;
                else throw new Error(ConfigError.INVALID).stack
                var globArr = [];
                var applicationPocket = new Pocket();
                for(let i=0;i<Object.keys(application).length;i++)
                {
                    applicationPocket.put(new PocketConfigManager().capitalizeFirstLetter(Object.keys(application)[i]),application[Object.keys(application)[i]])
                }
                globArr.push(applicationPocket);
                resolve(globArr);
                reject(new Error("(error) startAppInfo").stack)
            })

        } catch (error)
        {
            throw "(error)  "+PocketConfigManager.name+" "+error;
        }
    }
    /**
     *
     * @param {String} connection {"mongo","sql","oracle","firebase"} connection get uri info
     * @returns {Object}
     */
    connectionStat(connection)
    {
        if(config.connection[connection] != undefined) return config.connection[connection]
        else throw new Error("Invalid connection name").stack
    }
    /**
     * get all batch information
     * @returns {Array}
     */
    batchs()
    {
        try
        {
            var batchs = config.batchs != undefined ? config.batchs : new Array();
            if(batchs.length != 0) return batchs;
            else throw new Error("Not found available batch information.").stack

        } catch (error) {throw "(error)  "+PocketConfigManager.name+" "+error;}
    }
}
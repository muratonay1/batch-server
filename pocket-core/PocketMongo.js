import {MongoClient} from 'mongodb';
import Pocket from './Pocket.js';
import {DbError} from '../util/constant.js'
const { default: serviceAccountKey } = await import("../pocket-config.json", {
    assert: {
      type: "json",
    },
  });
export default class PocketMongo{

    constructor(){
        this.uri=serviceAccountKey.connection.mongo.uri;
        this.client=new MongoClient(this.uri);
    }
	/**
	 *
	 * @param {callback} callback //all databases names
	 * @return {Array}
	 */
    async getDatabases(callback){
        var databasesList = await this.client.db().admin().listDatabases();
        const databaseNames = [];
        databasesList.databases.forEach(database => {
            databaseNames.push(database.name);
        });
        callback(databaseNames);
    }


	throwErr(mssg){
		throw new Error(mssg);
	}
    /**
     *
     * @param {Object} args,
	 * @param {callback} callback,
	 * @return {Array}
     *
     */
    async executeGet(args,callback){
        try {
			var from 			= args.from 	== undefined ? this.throwErr(DbError.PATH_NOT_FOUND)	:	args.from;
			var whereOptions 	= args.filter 	== undefined ? this.throwErr(DbError.FILTER_NOT_FOUND)	:	args.filter;
			var serializeOptions = new Pocket();
            MongoClient.connect(this.uri, function(err, database) {
				if (err) new PocketMongo().throwErr(err);
				var databaseObject = database.db(from.split('.')[0]);
				databaseObject.collection(from.split('.')[1]).find(whereOptions,serializeOptions).toArray(function(err, result) {
				  if (err) throw err;
				  callback(result);
				  database.close();
				});
			});
		}
		catch(e){
			console.error(e);
		}
	}
	/**
	 *
	 * @param {Object} args
	 * @param {callback} callback
	 * @return {Boolean}
	 */
	async executeUpdate(args,callback){
        try {
			var from 			= args.from 	== undefined ? this.throwErr(DbError.PATH_NOT_FOUND)	:	args.from;
			var whereOptions 	= args.filter 	== undefined ? this.throwErr(DbError.FILTER_NOT_FOUND)	:	args.filter;
			var params 			= args.params 	== undefined ? this.throwErr(DbError.POCKET_NOT_FOUND)	:	args.params;
            MongoClient.connect(this.uri, async function(err, database) {
				if (err) throw err;
				var databaseObject = database.db(from.split('.')[0]);
				var updatePocket = new Pocket();
				updatePocket.put("$set",params);
				await databaseObject.collection(from.split('.')[1]).updateOne(whereOptions,updatePocket,{ upsert: true }).then(()=>{
					database.close().then(function(){
						callback(true);
					}).catch(function(err) {
						throw err;
					})
				});
			});
		}
		catch(e){
			console.error(e);
		}
	}
	/**
	 *
	 * @param {Object} args,
	 * @param {callback} callback,
	 * @return {Boolean}
	 */

	async executeInsert(args,callback){
		try {
			var from 			= args.from 	== undefined ? this.throwErr(DbError.PATH_NOT_FOUND)	:	args.from;
			var params 			= args.params 	== undefined ? this.throwErr(DbError.POCKET_NOT_FOUND)	:	args.params;
			MongoClient.connect(this.uri, async function(err, database) {
				if (err) throw err;
				var databaseObject = database.db(from.split('.')[0]);
				await databaseObject.collection(from.split('.')[1]).insertOne(params,(err,res)=>{
					if (err) throw err;
					database.close().then(()=>{
						callback(true);
					}).catch((e)=>{
						console.error(e)
					});
				});
			});
		} catch (error) {
			console.error(error);
		}
	}
}
import { MongoClient } from 'mongodb';
import Pocket from './Pocket.js';
import { DbError } from '../util/constant.js';
import PocketUtility from './PocketUtility.js';

const { default: serviceAccountKey } = await import("../pocket-config.json", {
	assert: {
		type: "json",
	},
});
export default class PocketMongo {
	constructor () {
		this.uri = serviceAccountKey.connection.mongo.uri;
		this.client = new MongoClient(this.uri);
	}

	async connect() {
		if (!this.client && !this.client.topology && !this.client.topology.isConnected()) {
			await this.client.connect();
		}
	}

	async getDatabases() {
		await this.connect();
		const databasesList = await this.client.db().admin().listDatabases();
		return databasesList.databases.map(database => database.name);
	}

	async executeGet(args) {
		await this.connect();
		let done = args.done;
		let fail = args.fail;
		const from = args.from?.split('.') || [];
		if (from.length !== 2) throw new Error(DbError.PATH_NOT_FOUND);

		const [dbName, collectionName] = from;
		const whereOptions = args.where || {};

		try {
			const result = await this.client.db(dbName).collection(collectionName).find(whereOptions).toArray();
			done(result);
		} catch (error) {
			const functionName = new Error().stack.match(/at\s+(.*?\s+|\S+)/)[1].replace('async ', '').split(' ')[0];
			PocketUtility.createExceptionLog(this.client,error, functionName).then((res) => {
				fail(error);
			});
		}
	}

	async executeUpdate(args) {
		await this.connect();
		let done = args.done;
		let fail = args.fail;
		const from = args.from?.split('.') || [];
		if (from.length !== 2) throw new Error(DbError.PATH_NOT_FOUND);

		const [dbName, collectionName] = from;
		const whereOptions = args.where || {};
		const updatePocket = new Pocket().put("$set", args.params);

		try {
			await this.client.db(dbName).collection(collectionName).updateOne(whereOptions, updatePocket, { upsert: true });
			done(true);
		} catch (error) {
			const functionName = new Error().stack.match(/at\s+(.*?\s+|\S+)/)[1].replace('async ', '').split(' ')[0];
			PocketUtility.createExceptionLog(this.client,error, functionName).then((res) => {
				fail(error);
			});
		}
	}

	async executeInsert(args) {
		await this.connect();
		let done = args.done;
		let fail = args.fail;
		const from = args.from?.split('.') || [];
		if (from.length !== 2) throw new Error(DbError.PATH_NOT_FOUND);

		const [dbName, collectionName] = from;

		try {
			const db = this.client.db(dbName);
			const collections = await db.listCollections().toArray();
			const collectionExists = collections.some(col => col.name === collectionName);

			if (!collectionExists) {
				throw new Error(`Collection "${collectionName}" does not exist.`);
			}
			await this.client.db(dbName).collection(collectionName).insertOne(args.params);
			done(true);
		} catch (error) {
			const functionName = new Error().stack.match(/at\s+(.*?\s+|\S+)/)[1].replace('async ', '').split(' ')[0];
			PocketUtility.createExceptionLog(this.client,error, functionName).then((res) => {
				fail(error);
			});
		}
	}
}
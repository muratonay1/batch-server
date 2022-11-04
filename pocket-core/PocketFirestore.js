import { initializeApp, applicationDefault, cert } from 'firebase-admin/app';
import { getFirestore, Timestamp, FieldValue } from 'firebase-admin/firestore';
const { default: serviceAccountKey } = await import("../serviceAccountKey.json", {
    assert: {
      type: "json",
    },
  });
initializeApp({ credential: cert(serviceAccountKey) });
const firestore = getFirestore();
export default class PocketFirestore {
	/**
	 * @method
	 * @param {String} collection
	 * @param {callback} callback
	 * @returns {Pocket}
	 * @example
	 * var dbClient = new Firestore();
	 * dbClient.getStorage("users", (idx, content) => {
	 *		console.log(idx, content);
	 * });
	 *
	 */
	get(database, collection, callback) {
		async function call() {
			if (collection == "*") {
				const snapshot = await firestore.collection(database).get();
				snapshot.forEach((req) => {
					callback(req.data());
				});
			} else {
				const snapshot = await firestore
					.collection(database)
					.doc(collection)
					.get();
				callback(snapshot.data());
			}
		}
		call();
	}
	/**
	 * @method
	 * @param {String} collection
	 * @param {callback} callback
	 */
	getAll(collection, callback) {
		async function call(collection, callback) {
			const events = await firestore.collection(collection);
			events.get().then((querySnapshot) => {
				const tempDoc = querySnapshot.docs.map((doc) => {
					return { id: doc.id, ...doc.data() };
				});
				callback(tempDoc);
			});
		}
		call(collection, (collection) => {
			callback(collection);
		});
	}
	/**
	 *
	 * @param {String} collection
	 * @param {any} data
	 * @param {any} key
	 * @param {callback} callback
	 */
	put(database, collection, data, callback) {
		async function call() {
			const response = await firestore
				.collection(database)
				.doc(collection)
				.set(data);
			callback(response);
		}
		call();
	}

	/**
	 *
	 * @param {String} database
	 * @param {String} collection
	 * @param {Object} data
	 * @param {any} callback
	 * @example
	 * var data = { cron: "8 * * * *",name: "murat" };
	 *	dbClient.update("Batchs", "murat", data, (resp) => {
	 *		console.log("update successfully");
});
	 */
	update(database, collection, data, callback) {
		async function call() {
			const response = await firestore
				.collection(database)
				.doc(collection)
				.update(data);
			callback(response);
		}
		call();
	}
	/**
	 *
	 * @param {String} database  Root Collection ismini girin
	 * @param {String} collection root'a bağlı sub collection ismi
	 * @param {callback} callback callback repsonse
	 */
	delete(database, collection, callback) {
		async function call() {
			const response = await firestore
				.collection(database)
				.doc(collection)
				.delete();
			callback(response + "\n" + "deleted successfully");
		}
		call();
	}
}
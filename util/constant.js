export const DbError = {
    "PATH_NOT_FOUND"    :"Path bulunamadi",
    "FILTER_NOT_FOUND"  :"Filter bulunamadi",
    "POCKET_NOT_FOUND"  :"Pocket bulunamadi"
}
export const Database ={
    "TEST"  :"test",
    "ADMIN" :"admin"
}

export const Collection = {
    "TEST_COLLECTION"   :"testCollection",
    "BATCH"             :"batch"
}

export const MongoQueryFrom = {
    "TEST_COLLECTION"   :    Database.TEST + "." + Collection.TEST_COLLECTION,
    "BATCH"             :   Database.ADMIN + "." + Collection.BATCH
}
export const Status = {
    "ACTIVE"    :"1",
    "PASSIVE"   :"0"
}



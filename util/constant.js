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
    "BATCH"             :"batch",
    "LOGS"              :"logs"
}

export const MongoQueryFrom = {
    "TEST_COLLECTION"   :       Database.TEST + "." + Collection.TEST_COLLECTION,
    "BATCH"             :       Database.ADMIN + "." + Collection.BATCH,
    "LOGS"              :       Database.ADMIN + "." + Collection.LOGS
}
export const Status = {
    "ACTIVE"    :"1",
    "PASSIVE"   :"0"
}
export const ExecuteBatchType = {
    "SINGLE":"1",
    "BULK":"0"
}

export const ConfigError = {
    "INVALID" : "Invalid config property"
}

export const ServiceError = {
    "MISSING_PARAMETER" : "Parameter must be fill"
}
export const ServiceParameter = {
    "MUST | FILL":"1"
}



 import Pocket from "./pocket-core/Pocket.js";
 import PocketService from "./pocket-core/PocketService.js";
// import PocketUtility from "./pocket-core/PocketUtility.js";
// /*
// PocketService.execute("GetMongoLogs",{"name":"test"},(response)=>{
//     response.forEach(log => {
//         console.log(PocketUtility.Encode(log.service))
//     });
// })*/

// console.log(Object.getOwnPropertyNames(Pocket.prototype))

//requiring path and fs modules
// import * as path from 'path';
// import * as fs from 'fs';
// import PocketUtility from "./pocket-core/PocketUtility.js";
// //joining path of directory
// const directoryPath = "./";
// //passsing directoryPath and callback function
// var list = [];
// let projectFolderInclude = new Pocket();
// fs.readdir(directoryPath, function (err, files) {
//     //handling error
//     if (err) {
//         return console.log('Unable to scan directory: ' + err);
//     }
//     //listing all files using forEach
//     files.filter(f=>{
//         if(f.startsWith('.') || f.endsWith('.json') || f.endsWith('.js') || f.endsWith('.md')){
//             return false;
//         }
//         return true;
//     }).forEach(function (file) {
//         fs.readdir(directoryPath+"/"+file,function(err,inFiles) {

//             if(err) throw new Error("Unable to scan directory").stack;
//             inFiles.forEach(inFile=>{
//                 console.info(PocketUtility.GetRealDate()+" - "+PocketUtility.GetRealTime()+"-> " + inFile + " is loaded successfully.");
//             })
//         })
//         list.push(file);
//     });
// });

PocketService.execute("GetUserInfo",{"email":"murat.onay@gmail.com"},(response)=>{
    console.log(response)
})
const {password} =require('../config/config')
const CryptoJS=require('crypto-js')

const encryptObject = (object)=>{
var encrptedObject = CryptoJS.AES.encrypt(JSON.stringify(object), password).toString();
return encrptedObject
}
const decrptObject = (object)=>{
    var bytes  = CryptoJS.AES.decrypt(object,password);
var decryptedData = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
return decryptedData
}
module.exports={encryptObject,decrptObject}
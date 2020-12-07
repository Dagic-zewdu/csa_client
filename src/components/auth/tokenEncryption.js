const {tokenPassword:password} =require('../config/config')
const CryptoJS=require('crypto-js')

const encryptToken = (object)=>{
var encrptedObject = CryptoJS.AES.encrypt(object, password).toString();
return encrptedObject
}
const decryptToken = (object)=>{
    var bytes  = CryptoJS.AES.decrypt(object,password);
var decryptedData = bytes.toString(CryptoJS.enc.Utf8);
return decryptedData
}
module.exports={encryptToken,decryptToken}
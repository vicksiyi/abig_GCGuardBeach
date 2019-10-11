var CryptoJS = require("crypto-js");

function usersDecrypt(strDecrypt,msg) {
    let str = CryptoJS.AES.decrypt(strDecrypt, msg);
    let strEn = str.toString(CryptoJS.enc.Utf8);
    return strEn
}

module.exports = {
    usersDecrypt : usersDecrypt
}
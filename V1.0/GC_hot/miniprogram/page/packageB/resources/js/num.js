const app = getApp()
const request = require('../../../../utils/requests');
function Num() { }
// 缓存Token
Num.prototype.userNum = async (id, token, back) => {
    let result = {}
    let Item = {
        url: `http://${app.ip}:5001/mini/msgs/showMsgUser/${id}`,
        method: "GET",
        header: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Authorization': token
        }
    };
    request.requestUtils(Item, result => {
        back(result)
    })
}

Num.prototype.userStatus = async (id, token, back) => {
    let result = {}
    let Item = {
        url: `http://${app.ip}:5001/mini/msgs/userStatus/${id}`,
        method: "GET",
        header: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Authorization': token
        }
    };
    request.requestUtils(Item, result => {
        back(result)
    })
}

module.exports = Num

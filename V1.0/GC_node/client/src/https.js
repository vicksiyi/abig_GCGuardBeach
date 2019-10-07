import axios from 'axios'
import qs from 'qs'
var CryptoJS = require("crypto-js");

axios.defaults.timeout = 5000;                        //响应时间
axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded';        //配置请求头
axios.defaults.baseURL = '';   //配置接口地址

//POST传参序列化(添加请求拦截器)
axios.interceptors.request.use((config) => {
    //在发送请求之前做某件事
    if (config.method === 'post') {
        // 防止明文发送

        let keyTemp = []
        for (const key in config.data) {
            keyTemp.push(key)
        }
        if (keyTemp.length == 2) {
            if (keyTemp.indexOf("email") != -1 && keyTemp.indexOf("password") != -1) {
                // 字段加密
                let email = CryptoJS.AES.encrypt('emailSct', 'email').toString();
                let password = CryptoJS.AES.encrypt('passwordSct', 'password').toString();
                // 值加密
                let secretEmail = CryptoJS.AES.encrypt(config.data.email, 'secret key emailAbc').toString();
                let secretPsw = CryptoJS.AES.encrypt(config.data.password, 'secret key passwordAbc').toString();


                let item = {}
                item[email] = secretEmail
                item[password] = secretPsw
                config.data = item
            }
        }

        config.data = qs.stringify(config.data);
    }
    return config;
}, (error) => {
    console.log('错误的传参')
    return Promise.reject(error);
});

//返回状态判断(添加响应拦截器)
axios.interceptors.response.use((res) => {
    //对响应数据做些事
    if (!res.data.success) {
        return Promise.resolve(res);
    }
    return res;
}, (error) => {
    console.log('网络异常')
    return Promise.reject(error);
});

//返回一个Promise(发送post请求)
export function fetchPost(url, param, header) {
    return new Promise((resolve, reject) => {
        axios.post(url, param, {
            headers: header
        })
            .then(response => {
                resolve(response);
            }, err => {
                reject(err);
            })
            .catch((error) => {
                reject(error)
            })
    })
}
////返回一个Promise(发送get请求)
export function fetchGet(url, param, header) {
    return new Promise((resolve, reject) => {
        axios.get(url, {
            params: param,
            headers: header
        })
            .then(response => {
                resolve(response);
            }
                // 用户登录失败导致
                , () => {
                    resolve('oauthError');
                    // reject(err)
                })
            .catch((error) => {
                reject(error)
            })
    })
}
export default {
    fetchPost,
    fetchGet,
}
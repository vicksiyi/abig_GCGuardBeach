const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const app = express();
const miniApp = express();
const passport = require('passport');

// 引入ws
const ws = require("nodejs-websocket")

//引入users
const profiles = require('./routes/api/profiles');
const finds = require('./routes/api/finds');
const admins = require('./routes/api/admins');
const news = require('./routes/api/news');

// 小程序端数据获取接口
const miniUsers = require('./routes/miniapi/users');
const miniNews = require('./routes/miniapi/news');
const miniFinds = require('./routes/miniapi/finds');
const miniEmails = require('./routes/miniapi/emails');
const miniChats = require('./routes/miniapi/chats');

// DB config
const db = require('./config/keys').mongoURI;

// 使用body-parser
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

miniApp.use(bodyParser.urlencoded({ extended: false }));
miniApp.use(bodyParser.json());

// connect
mongoose.connect(db)
    .then(() => {
        console.log('成功');
    })
    .catch((err) => {
        console.log(err);
    })

// passport初始化
app.use(passport.initialize());
require('./config/adminPassport')(passport);

miniApp.use(passport.initialize());
require('./config/userPassport')(passport);


//使用routes
app.use('/api/profiles', profiles);
app.use('/api/finds', finds);
app.use('/api/admins', admins);
app.use('/api/news', news);

// 小程序端
miniApp.use('/mini/users', miniUsers);
miniApp.use('/mini/news', miniNews);
miniApp.use('/mini/finds', miniFinds);
miniApp.use('/mini/emails', miniEmails);
miniApp.use('/mini/chats', miniChats);

app.listen(5000, () => {
    console.log('the port running');
})

miniApp.listen(5001, () => {
    console.log('the mini port running');
})

// 聊天
var server = ws.createServer(function (conn) {
    console.log("connected！！！")
    console.log(conn)
    conn.protocols = ['protocols']
    conn.on("text", function (str) {
        console.log("Received " + str)
        broadcast(str)
        // let data = JSON.parse(str)
        // switch (data.type) {
        //     case value:

        //         break;

        //     default:
        //         break;
        // }
    })
    conn.on("error", function (err) {
        console.log(err)
    })
    conn.on("close", function (code, reason) {
        console.log("Connection closed")
    })
}).listen(5002, function () {
    console.log('the ws port running');
});

function broadcast(msg) {
    server.connections.forEach(function (conn) {
        console.log(conn)
        conn.sendText(msg)
    })
}
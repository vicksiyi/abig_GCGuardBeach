const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const app = express();
const miniApp = express();
const passport = require('passport');

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


app.listen(5000, () => {
    console.log('the port running');
})

miniApp.listen(5001, () => {
    console.log('the mini port running');
})
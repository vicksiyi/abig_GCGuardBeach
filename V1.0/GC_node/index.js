const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const app = express();
const passport = require('passport');

//引入users
const users = require('./routes/api/users');
const profiles = require('./routes/api/profiles');
const finds = require('./routes/api/finds');
// const oauthUsers = require('./routes/api/oauthUsers');
const admins = require('./routes/api/admins');

// DB config
const db = require('./config/keys').mongoURI;

// 使用body-parser
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
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
require('./config/passport')(passport);


//使用routes
app.use('/api/users', users);
app.use('/api/profiles', profiles);
app.use('/api/finds', finds);
// app.use('/api/oauthUsers', oauthUsers);
app.use('/api/admins', admins);

app.listen(5000, () => {
    console.log('the port running');
})
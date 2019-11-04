const express = require('express');
const router = express.Router();
const passport = require('passport');
const Profile = require('../../models/Profile');

// $routes /api/profiles/ceshi
// @desc 返回请求的json数据
// @access public
router.get('/ceshi',(req,res)=>{
    res.json({msg:"成功"})
})


// $routes /api/profiles/add
// @desc 添加信息
// @access private
router.post('/add',passport.authenticate('jwt',{session:false}),(req,res)=>{
    // const profileFileds = {};
    new Profile({
        type :req.body.type,
        desc:req.body.desc,
        income :req.body.income,
        expend:req.body.expend,
        cash:req.body.cash,
        remark:req.body.remark
    }).save().then(profile=>{
        res.json(profile);
    })
})


// $routes /api/profiles
// @desc 获取所有信息
// @access private

router.get('/',passport.authenticate('jwt',{session:false}),(req,res)=>{
    Profile.find().then(profile=>{
        if(!profile){
            return res.status(404).json('没有内容');
        }
        res.json(profile);
    })
    .catch(err=>{
        return res.status(404).json(err);
    })
})


// $routes /api/profiles/:id
// @desc 获取单个信息
// @access private

router.get('/:id',passport.authenticate('jwt',{session:false}),(req,res)=>{
    Profile.findOne({_id:req.params.id}).then(profile=>{
        if(!profile){
            return res.status(404).json('没有内容');
        }
        res.json(profile);
    })
    .catch(err=>{
        return res.status(404).json(err);
    })
})

// $routes /api/profiles/edit
// @desc 编辑信息
// @access private

router.get('/edit/:id',passport.authenticate('jwt',{session:false}),(req,res)=>{
    const profileFileds = {};
    if(req.body.type) profileFileds.type = req.body.type;
    if(req.body.desc) profileFileds.desc = req.body.desc;
    if(req.body.income) profileFileds.income = req.body.income;
    if(req.body.expend) profileFileds.expend = req.body.expend;
    if(req.body.cash) profileFileds.cash = req.body.cash;
    if(req.body.remark) profileFileds.remark = req.body.remark;

    Profile.findOneAndUpdate({_id:req.params.id},{$set:profileFileds},{new:true}).then(profile=>{
        res.json(profile);
    })
    .catch(err=>{
        return res.status(404).json(err);
    })
})


// $routes /api/profiles/delete/:id
// @desc 删除
// @access private

router.delete('/delete/:id',passport.authenticate('jwt',{session:false}),(req,res)=>{
    Profile.findOneAndRemove({_id:req.params.id}).then(profile=>{
        profile.save().then(profile=>{
            res.json(profile);
        })
    })
    .catch(err=>{
        res.json(err);
    })
})

module.exports = router;
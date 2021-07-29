const express = require('express')
const router  = express.Router();
const mongoose = require('mongoose');
const User = require("../models/user")
const crypto = require("crypto")
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const requireLogin = require('../middleware/requireLogin')
const nodemailer = require('nodemailer')
const sendgridTransport = require('nodemailer-sendgrid-transport')
require('dotenv').config()

const transporter = nodemailer.createTransport(sendgridTransport({
    auth: {
      api_key: process.env.SENDGRID_API_KEY
    }
}))

router.get('/protected',requireLogin,(req,res)=>{
    res.send('hello user');
})

router.post('/signup',(req,res)=>{
const {name,email,password,pic} = req.body;
if(!email||!password||!name){
    return res.status(422).json({error:"please add all fields"});
}
User.findOne({email:email})
.then((savedUser)=>{
    if(savedUser){
        return res.status(422).json({error:"user already exusts with that email"})
    }
    bcrypt.hash(password,12)
    .then(hashedpassword=>{
        const user = new User({
            email,
            password:hashedpassword,
            name,
            photo:pic
        })
        user.save()
        .then(user=>{
            // const io = req.app.get('io');
            // console.log(io, user)
            // io.emit('newUserAdded', user)
            // transporter.sendMail({  
            //     to: email,
            //     from: process.env.EMAIL_SENDER,
            //     subject: "Signup",
            //     html: "<h1>Welcome to instagram </h1>"
            // })
            res.json({message:"saved successfully"})
        })
        .catch(err=>{
            console.log(err)
        })
    })
})
.catch(err=>{
    console.log(err)
})

})

router.post('/signin', (req,res)=>{
    const {email,password,pic}= req.body;
    if(!email || !password){
    return res.status(422).json({error:"please add email or password"})
    }
    User.findOne({email:email})
    .then(savedUser=>{
        if(!savedUser){
            return res.status(422).json({error:"Invalid Email or password"})     
        }
        bcrypt.compare(password,savedUser.password)
        .then(doMatch=>{
            if(doMatch){
            const token = jwt.sign({_id:savedUser._id},process.env.JWT_SECRET);
            const {_id,name,email,followers,following,photo} = savedUser
       return res.json({token,user:{_id,name,email,followers,following,photo},message:"successfully signed in"})
            }
        else{
        return res.status(422).json({error:"Invalid Email or password"})
        }   
    })
    .catch(err=>{
        console.log(err);
})
    
    })
})

router.post('/reset-password',(req,res)=>{
    crypto.randomBytes(32, (err,buffer)=> {
        if(err) console.log(err)
        const token = buffer.toString("hex")
        User.findOne({email: req.body.email})
        .then(user => {
            if(!user)
            return res.status(422).json({error: "User with that email does not exist"})
            user.resetToken = token
            user.expireToken = Date.now() + 3600000
            user.save().then(result => {
                transporter.sendMail({
                    to: user.email,
                    from: process.env.EMAIL_SENDER,
                    subject: "Signup",
                    html: `
                    <p>You requested for password reset</p>
                    <h5>click in this <a href="${process.env.FRONT_END_URL}/reset/${token}">link</a> to reset password</h5>
                    `
                })
                res.json({message: "check your email"})
            })
        })
    })
})

router.post("/new-password", (req,res)=>{
    const newPassword = req.body.password
    const sentToken = req.body.token
    User.findOne({resetToken:sentToken, expireToken:{$gt:Date.now()}})
    .then(user =>{
        if(!user)
            return res.status(422).json({error: "Try again session expired"})
        bcrypt.hash(newPassword,12).then(hashedpassword => {
            user.password= hashedpassword
            user.resetToken = undefined
            user.expireToken = undefined
            user.save().then(savedUser=> {
                res.json({message: "password updated success"})
            })
        })
    }).catch(err=> {
        console.log(err)
    })
})
module.exports= router

const express=require('express');
const route=express.Router();
const signupandlogincontroller=require('../Controllers/signupandlogincontroller');
route.post('/signup',signupandlogincontroller.signup);
route.post('/login',signupandlogincontroller.login);
route.get('/get',signupandlogincontroller.getdata);
route.get('/savetoken',signupandlogincontroller.savetoken);
module.exports=route;
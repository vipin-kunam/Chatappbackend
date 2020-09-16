const express=require('express');
const route=express.Router();
const contactcontroller =require('../Controllers/Contactscontroller');
route.post('/check',contactcontroller.checkcontactsindb);
route.get('/getanddelete',contactcontroller.getmessagesanddeletethose);
route.get('/getall',contactcontroller.getallreceivedmessages);
route.get('/bgget',contactcontroller.getallreceived);
module.exports=route;
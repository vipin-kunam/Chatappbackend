const express= require('express');
const Firestore = require('@google-cloud/firestore');

//const initialisedb=require('./Middleware/dbinitiation');
const signupandloginroute=require('./routes/signupandlogin');
const cmsroute=require('./routes/cmsroutes');
var bodyParser = require('body-parser')
const app=express();
 global.db = new Firestore({
  projectId: 'database-287006',
  keyFilename: './Database-a678e26aadca.json',
});
//initialisedb.initialisedb();
app.use(bodyParser.json())
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader(
      'Access-Control-Allow-Methods',
      'OPTIONS, GET, POST, PUT, PATCH, DELETE'
    );
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, userid');
    
    next();
  });

app.use('/',signupandloginroute);
app.use('/cms',cmsroute);
  app.use((error, req, res, next) => {
    console.log(error);
    const status = error.statusCode || 500;
    const message = error.message;
    const data = error.data;
    res.status(status).json({ message: message, data: data });
  });
  
  
  
app.listen(process.env.PORT || 5000);
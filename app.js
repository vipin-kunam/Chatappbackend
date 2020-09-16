var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var bodyParser = require('body-parser')
const Firestore = require('@google-cloud/firestore');
const signupandloginroute=require('./routes/signupandlogin');
const contactroute=require('./routes/contacts');
const contactcontroller=require('./Controllers/Contactscontroller');
global.db = new Firestore({
   projectId: 'vipin-287009',
   keyFilename: './Vipin-b732a8dc8a29.json',
 });
 app.use(bodyParser.json({limit: '50mb'}));
// app.use(bodyParser({limit: '50mb'}));
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
 app.use('/contacts',contactroute);
io.on('connection', function(socket) {
   console.log('A user connected');
  
   socket.on('fromclient', function(data) {
 contactcontroller.insertintodb(data).then((res)=>{
  io.emit(data.listening,{...data,id:res.id});
  io.emit(data.to,{...data,id:res.id});
 })
    
     
     
   })
socket.on('ack',function(data){
  contactcontroller.deletemessage(data.id);
})
   
});

http.listen(process.env.PORT ||3000, function() {
   console.log('listening on localhost:3000');
});
var jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const sendgridTransport = require('nodemailer-sendgrid-transport');
const transporter = nodemailer.createTransport({


  service: 'gmail',
  auth: {
    user: 'vipin.kunam123@gmail.com',
    pass: 'Saras96!'
  }
}
);
const bcrypt = require('bcrypt');
let checkuser = async (email) => {
  const usersRef = global.db.collection('users');
  let snapshot = await usersRef.where('email', '==', email).get();
  return snapshot;
}
let checkuserbyno = async (phoneno) => {
  const usersRef = global.db.collection('users');
  let snapshot = await usersRef.where('phoneno', '==', phoneno).get();
  return snapshot;
}
exports.signup = async (req, res, next) => {
  console.log('psted output', req.body);
  const user = req.body;
  //check wherther user exist already
  
  let snapshot = await checkuser(user.email)
  if (!snapshot.empty) {
    console.log('user exist');
    res.status(409).json({ message: 'user already exist' });
    return;
  }
 
      let userdoc = {
        uname: user.uname,
        phoneno: user.phoneno,
        email: user.email
      }
      global.db.collection('users').add(userdoc).then((success) => {
        console.log('sucess');
        transporter.sendMail({
          to: user.email,
          from: 'donotreply@node-complete.com',
          subject: 'Signup succeeded!',
          html: `<h1>Welcome to chatapp ${user.email}</h1>`
        });      
        res.status(201).json({ message: 'user created' });
      }, (err) => {
        next(err);
      });

   


  //next() 
}
sendsms=(no,otp)=>{
var http = require('http');
var urlencode = require('urlencode');
var msg = urlencode(`Your ChatApp Otp is ${otp}`);
var toNumber =no;
var username = 'vipin.kunam123@gmail.com';
var hash = '73362eb9acc56bc25e18ab1eae1ef6989c4da6aa9d0701af95c3654fa556d0f6'; // The hash key could be found under Help->All Documentation->Your hash key. Alternatively you can use your Textlocal password in plain text.
var sender = 'txtlcl';
var data = 'username=' + username + '&hash=' + hash + '&sender=' + sender + '&numbers=' + toNumber + '&message=' + msg;
var options = {
  host: 'api.textlocal.in', path: '/send?' + data
};
callback = function (response) {
  var str = '';//another chunk of data has been recieved, so append it to `str`
  response.on('data', function (chunk) {
    str += chunk;
  });//the whole response has been recieved, so we just print it out here
  response.on('end', function () {
    console.log(str);
  });
}//console.log('hello js'))
http.request(options, callback).end();
}
exports.login = async (req, res, next) => {

  let userfromdb = [];
  const user = req.body;
  console.log('login', user);
  //check user
  let snapshot = await checkuserbyno(user.phoneno);
  if (snapshot.empty) {
    //res.send('please signup')
    res.status(401).json({ message: 'Please signup' });
    return;
  }
  snapshot.forEach(doc => {
    console.log(doc.id, '=>', doc.data());
    userfromdb.push(doc.data());
  }); 
 let otp=Math.floor(Math.random()*90000) + 10000;

//  transporter.sendMail({
//   to: userfromdb[0].email,
//   from: 'donotreply@node-complete.com',
//   subject: 'Logging to ChatApp',
//   html: `<h1>Your otp is ${otp}</h1>`
// });
sendsms(user.phoneno,otp);
      res.status(200).json({otp:otp});
      return;
    }
exports.getdata = (req, res, next) => {
  let arr = [];
  global.db.collection('users').get().then((snapshot) => {
    snapshot.forEach((doc) => {
      arr.push(doc.data());
      console.log(doc.id, '=>', doc.data());

    });
    res.send(arr)
  },(err)=>{
    next(err);
  });

}

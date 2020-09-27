var jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const { google } = require("googleapis");
const OAuth2 = google.auth.OAuth2;
const myOAuth2Client = new OAuth2(
  "936272359596-mnsmsk4dllo7h520863he1cg23npi4sa.apps.googleusercontent.com",
  "OSewxTHq0koqnnIeAyWOPeCY",
  "https://developers.google.com/oauthplayground"
)
myOAuth2Client.setCredentials({
  refresh_token: "1//0f-Y_loEh-9vfCgYIARAAGA8SNwF-L9IrwU7LUQl7C9ePpt3xW3U4oayrcEW9zOq61gS-OC0Vvz1C--cv23nE5gxTUop-tTTnoQU"
});
const myAccessToken = myOAuth2Client.getAccessToken();
const transport = nodemailer.createTransport({
  service: "gmail",
  auth: {
      type: "OAuth2",
      user: "vipin.kunam123@gmail.com", //your gmail account you used to set the project up in google cloud console"
      clientId: "936272359596-mnsmsk4dllo7h520863he1cg23npi4sa.apps.googleusercontent.com",
      clientSecret: "OSewxTHq0koqnnIeAyWOPeCY",
      refreshToken: "1//0f-Y_loEh-9vfCgYIARAAGA8SNwF-L9IrwU7LUQl7C9ePpt3xW3U4oayrcEW9zOq61gS-OC0Vvz1C--cv23nE5gxTUop-tTTnoQU",
      accessToken: myAccessToken //access token variable we defined earlier
  }
});
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
exports.savetoken=async(req,res,next)=>{
  console.log('in token')
  let token=req.query.token;
  let phoneno=req.query.phoneno;
  console.log('pno',phoneno);
  console.log('token',token);
  let user=[];
  let id=[];
  let snapshot = await global.db.collection('users').where('phoneno', '==', phoneno.toString()).get();
  snapshot.forEach(doc => {
    id.push(doc.id);
    console.log(doc.id, '=>', doc.data());
    user.push(doc.data());
  }); 
  await db.collection('users').doc(id[0]).update({token: token});
  res.status(201).json({ message: 'user updated' });

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
        email: user.email,
        token:''
      }
      global.db.collection('users').add(userdoc).then((success) => {
        console.log('sucess');
        const mailOptions = {
          from: 'vipin.kunam123@gmail.com', // sender
          to: user.email, // receiver
          subject: 'Welcome to Chatapp', // Subject
          html: `<p>Thank you for joining  ${user.uname}</p>`// html body
      }
      transport.sendMail(mailOptions, function (err, result) {
          if (err) {
              // res.send({
              //     message: err
              // })
              console.log('error sending email');
          } else {
              transport.close();
              // res.send({
              //     message: 'Email has been sent: check your inbox!'
              // })
          }
      })  
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

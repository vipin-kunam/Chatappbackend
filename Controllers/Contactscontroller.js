// var forEach = require('async-foreach').forEach;
const Firestore = require('@google-cloud/firestore');
exports.getmessagesanddeletethose=async(req,res,next)=>{
  let arr=[];
  let from=req.query.from;
  let to=req.query.to;
  console.log('from and to',from,to);
  const snapshot =await global.db.collection('messages').where('from', '==', from).where('to', '==', to).orderBy("timestamp", "asc").get();
  const batch = global.db.batch();
  snapshot.forEach((doc) => {
    let temp={...doc.data()}
    arr.push(temp);
    batch.delete(doc.ref);
    });
  res.send(arr);
  
  await batch.commit();
 }
 exports.getallreceived=async()=>{
  let arr=[];
  let obj;
  let to=req.query.to;
  const snapshot =await global.db.collection('messages').where('to', '==', to).get();
  snapshot.forEach((doc) => {
    let temp={...doc.data()}
    arr.push(temp);
    });
    return res.send(arr);
 }
 exports.getallreceivedmessages=async(req,res,next)=>{
  let arr=[];
  let obj;
  let to=req.query.to;
  const snapshot =await global.db.collection('messages').where('to', '==', to).get();
  snapshot.forEach((doc) => {
    let temp={...doc.data()}
    arr.push(temp);
    });
   obj= getCount(arr);
   console.log('obj',obj);
  return res.send(obj);
 }
 getCount=(arr)=>{
let count =new Map();
let c=1;
for(let i in arr){
  if(count.get(arr[i].from)==null){
    count.set(arr[i].from,c);
  }
  else{
    let a=count.get(arr[i].from);
    count.set(arr[i].from,a+1);
  }
}
console.log('count',count);
let obj = Array.from(count).reduce((obj, [key, value]) => (
  Object.assign(obj, { [key]: value }) 
), {});
return obj;
 }
exports.insertintodb=async(data)=>{
  const snapshot = await global.db.collection('messages').add({...data,timestamp:Firestore.FieldValue.serverTimestamp()});
  return snapshot;
}
exports.deletemessage=async(id)=>{
  const docid=await global.db.collection('messages').doc(id).delete();
  return docid;
}

exports.checkcontactsindb = async (req, res, next) => {
  let returnedusers = [];
  let usersfromdb = [];
  let users = req.body;
  let snapshot = await getalldatafromdb();
  snapshot.forEach(doc => {
    
    usersfromdb.push(doc.data());
  });
  checkformatch(users, req, res, next, returnedusers, usersfromdb);
}
getalldatafromdb = async () => {
  const snapshot = await global.db.collection('users').get();
  return snapshot;

}
removedupicates=(returnedusers)=>{
let removedupicatesarray=[];
let map=new Map();
for(x in returnedusers){
  map.set(returnedusers[x].phoneno.slice(returnedusers[x].phoneno.length-10),returnedusers[x]);
}
map.forEach((value)=>{
  removedupicatesarray.push(value);
})
return removedupicatesarray;
}
checkformatch = (users, req, res, next, returnedusers, usersfromdb) => {
 
  users.forEach((user) => {
    user.phones.forEach((phoneno) => {
      phoneno.value=phoneno.value.split(" ").join("");
      usersfromdb.forEach((userdb) => {

        if (phoneno.value.includes(userdb.phoneno)) {
          returnedusers.push({
            givenName: user.givenName ? user.givenName : "", familyName: user.familyName ? user.familyName : "",
            displayName: user.displayName ? user.displayName : "",
            phoneno: phoneno.value
          });
        }
      })
    })
  })
  returnedusers=removedupicates(returnedusers);
  return res.send(returnedusers);
}
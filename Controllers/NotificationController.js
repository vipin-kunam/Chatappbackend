var FCM = require('fcm-node');
    var serverKey = 'AAAA7YchI5U:APA91bHStFJ-9Zq57sbjFAAQDbmpgWONskjIFqUaQAEQ2vl94NCc9ZYjlxB2_1p5minKkXK8jwq_ScgJqgyT6_och9z4pvmSxpnGsdHTqrZ3_02MPn4RTNdaU_6vFG7bURA-0Ndep-X1'; // put your server key here
    var fcm = new FCM(serverKey);
exports.pushnotify=async(phno,to)=>{
   var usersfromdb=[];
   var usersfromdb1=[];
   const snapshot1 =await global.db.collection('users').where('phoneno', '==', to).get();
   snapshot1.forEach(doc => {
    
    usersfromdb1.push(doc.data());
  });
    const snapshot =await global.db.collection('users').where('phoneno', '==', phno).get();
    snapshot.forEach(doc => {
    
        usersfromdb.push(doc.data());
      });
      var sender=usersfromdb[0]['uname']
      var message = { //this may vary according to the message type (single recipient, multicast, topic, et cetera)
        to: usersfromdb1[0]['token'], 
        collapse_key: 'your_collapse_key',
        
        notification: {
            title: 'ChatApp', 
            body: `A message received from ${sender}` ,
            sound: "default"
        },
        
        data: {  //you can send only notification or only data(or include both)
            my_key: 'my value',
            my_another_key: 'my another value'
        }
    };

    fcm.send(message, function(err, response){
        if (err) {
            console.log("Something has gone wrong!");
        } else {
            console.log("Successfully sent with response: ", response);
        }
    });
}
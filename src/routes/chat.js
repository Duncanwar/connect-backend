const express = require('express')
const router  = express.Router();
const Chat = require('../models/privateChat')
const passport = require('passport');

router.post('/sendMessage/:idChat', passport.authenticate('Bearer ',{session:false}),(req, res)=>{
Chat.findById(req.params.idChat, (err,chat)=>{
   if(err){
       res.send(err);
}    const io = req.app.get("io")
    chat.messages.push(req.body)
    chat.findByIdAndUpdate(chat._id, {$set: {messages:chat.messages}},
        (err2, chat2)=>{
            io.emit('newMessageSended', chat2)
        })
})
});

router.get("/getPrivateMessage/:idUser1/:idUser2", passport.authenticate('Bearer ',{session:false}),(req, res)=>{
   Chat.findOne({user1:req.params.user1, user2:req.params.idUser2}, (err,chat1)=>{
   if(err){
       res.send(err)
   }
   if(!chat1){
    Chat.findOne({user1: req.params.idUser1, user2: req.params.idUser2}, (err, chat2) => {
        if(err2){res.send(err2)}
        if(!chat2){
            let chat = new Chat({user1:req.params.user1, user2:req.params.idUser2, messages:[]});
            chat.save((err3,chat)=>{
                if(err3){
                    res.send(err3)
                }
                res.send(chat)
            });
        }else{
            res.send(chat2)
        }
    })

}else{
    res.send(chat1)
}
});
});

module.exports = router
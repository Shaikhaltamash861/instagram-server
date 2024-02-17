const Message=require('../model/msgModel/message')
const newMessage=async(req,res)=>{
    const {conversationId,senderId,message}=req.body
    console.log(req.body)
    try {
        const response=await Message(req.body)
        const result=await response.save()
        res.status(200).json({message:result,success:true})
    } catch (error) {
        res.status(201).json({message:'something wrong'})
    }
}
const getMessages=async(req,res)=>{
    try {
         const response=await Message.find({conversationId:req.query.conversationId})
         res.status(200).send(response)
    } catch (error) {
        res.send('something wrong')
    }
}
const lastMsg=async(req,res)=>{
    const con_Id=req.query.id;
    const response=await Message.find({conversationId:con_Id}).sort({createdAt:-1}).select('message')
    res.send(response[0])
}
exports.newMessage=newMessage
exports.getMessages=getMessages
exports.lastMsg=lastMsg

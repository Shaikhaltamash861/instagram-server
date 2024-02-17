const mongoose=require('mongoose')
const schema=new mongoose.Schema({
    conversationId:
    {
     type:String   
    },
    senderId:{
        type:String
    },
    message:{
        type:String
    },
}
   , {
        timestamps:true
    }
)
const model=mongoose.model('messages',schema)
module.exports=model
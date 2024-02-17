const mongoose=require('mongoose')
const schema=new mongoose.Schema({
    senderId:{
        type:String,
    },
    receiverId:{
        type:String
    }
},
    {
        timestamps:true
    }
)
const model=mongoose.model('conversation',schema)
module.exports=model
const Conversation=require('../model/msgModel/conversation')
const newConverstion=async(req,res)=>{
    const {senderId,receiverId}=req.body;
    console.log(req.body)
    try {
        const hasAlready=await Conversation.find({
            $or:[
                {

                    senderId:senderId,
                    receiverId:receiverId
                },
                {
                  senderId:receiverId,
                  receiverId:senderId
                }
            ]
        })
        
        if(hasAlready.length===0){
            
            
            const create=await Conversation({senderId,receiverId})
            if(create){
                const response= await create.save();
                res.status(200).json({message:response,success:true})
                
            }else{
                res.status(201).json({success:false})
            }
        }else{
            
            res.status(201).json({message:hasAlready,success:true})
        }
  
    } catch (error) {
        console.log(error)
        res.status(201).json({success:false}) 
    }
}
const getConversation=async(req,res)=>{

   try {
      const response=await Conversation.find({
        $or:[
            {
            senderId:  {
                 
                 $in:req.query.id,
            }   
            },
            {

               receiverId:{

                   $in:req.query.id
               } 
            }
        ]
    })
    
      res.status(200).json(response)
   } catch (error) {
    
   }
}
exports.newConverstion=newConverstion;
exports.getConversation=getConversation
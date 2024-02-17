
const User =require('../model/userModel')
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const saltRounds = 10;
require('dotenv').config()
const signup= async(req,res)=>{
    const {name,email,password,username}=req.body;
    const isAlready=await User.findOne({
        $or: [{ email }, { username },{name}]})
    if(isAlready)
    {
    
      return res.status(200).json({message:"User is already registered",status:false})
    }
       const hashPass=bcrypt.hashSync(password, saltRounds)
        const upload=await User({name,username,email,password:hashPass});
    try {
        const save=await upload.save();

        if(!save){
       return res.status(200).json({message:"user unable to save",status:false})
        }
        const token = jwt.sign(
            { user_id: upload._id, email },
            process.env.TOKEN_KEY,
            {
              expiresIn: "2h",
            }
          );
          
          upload.token = token;
       return res.status(200).json({message:"user registerd successfully",status:true,user:upload})

    } catch (error) {
        
       return res.status(210).json({message:error._message,status:false})
    }
  
}


const signin=async(req,res)=>{
    const {email,password}=req.body;
    const user = await User.findOne({
        $or: [{ email:email }, { username:email }]
    });
    
    try {
    
    if(user){
        
        const match =  bcrypt.compareSync(password,user?.password)
        
        if(match){
            const token = jwt.sign(
                { user_id: user._id, email },
                process.env.TOKEN_KEY,
                {
                    expiresIn: "2h",
                }
              );
              
              user.token = token;
           return res.status(200).json({data:user,status:true,message:"successfuly loggIn"});
        }
        else{
           return res.status(200).json({message:"wrong password",status:false})
        }
        
    }
    return res.status(200).json({message:"username/email not found",status:false})
} catch (error) {
        console.log(error)

       return res.status(210).json({error:"something went wrong",status:false})
        
    }    

}
const followUser = async (req, res) => {
    const userToFollow = await User.findById(req.body.yourId);
    const loggedInUser = await User.findById(req.body.myId);

    if (!userToFollow) {
        res.status(200).json({message:'NOT FOUND'});
    }

    if (loggedInUser.following.includes(userToFollow._id)) {

        const followingIndex = loggedInUser.following.indexOf(userToFollow._id);
        const followerIndex = userToFollow.followers.indexOf(loggedInUser._id);

        loggedInUser.following.splice(followingIndex, 1);
        userToFollow.followers.splice(followerIndex, 1);

        await loggedInUser.save();
        await userToFollow.save();

        return res.status(200).json({
            success: true,
            message: "User Unfollowed"
        });
    } else {
        loggedInUser.following.push(userToFollow._id);
        userToFollow.followers.push(loggedInUser._id);
        await loggedInUser.save();
        await userToFollow.save();

        res.status(200).json({
            success: true,
            message: "User Followed",
        });
    }
};

const getFollowers=async(req,res)=>{
    try {
        const following=await User.find({
            following: req.body.id
        })
        if(following){
            res.status(200).json({message:following,status:true})
        }
           
    } catch (error) {
     res.status(201).json({message:error._message,status:false})
    }

   

}
const getFollowing=async(req,res)=>{
    try {
        const followers=await User.find({
            followers: req.body.id
        })
        if(followers){
         res.status(200).json({message:followers,status:true})
        }
           
    } catch (error) {
         res.status(201).json({message:error._message,status:false})
    }
}

const getUserById=async(req,res)=>{
    
    const _id=req.query._id
    
    try {
        if(!_id){
            res.status(201).json({message:'id is empty'})
        }
        const user = await User.findById({_id:_id});
        res.status(200).json(user)
    } catch (error) {
        console.log(error)
        // res.status(201).json(error._message)
    }
    
}
const getUserByUserName=async(req,res)=>{
    
    // const users=await User.findOne({
    //     $or: [{ email:req.body.query }, { username:req.body.query },{
    //         name:req.body.query
    //     }]
    // });
    if (req.body.query) {
        const userss = await User.find({
            $or: [
                {
                    name:  {
                        $regex:  req.body.query,
                        $options: "i",
                    },
                },
                {
                    username: {
                        $regex: req.body.query,
                        $options: "i",
                    }
                }
            ]
        });
        
        const users=userss.filter((user)=>user._id.toString()!==req.query.user) 
        
        res.status(200).json({
            success: true,
            users,
        });
    }
}
 const changeProfile=async(req,res)=>{
    const _id=req.body.id
    
    try {
        const upload=await User.findByIdAndUpdate({_id},{
            $set:{
                avatar:req.body.image
            }

        })
        
        res.status(200).json({message:upload,status:true})
    } catch (error) {
        res.status(201).json({message:error._message,status:false})
    }
 }
exports.signup=signup;
exports.signin=signin;
exports.getUserById=getUserById
exports.getUserByUserName=getUserByUserName
exports.followUser=followUser
exports.getFollowers=getFollowers;
exports.getFollowing=getFollowing
exports.changeProfile=changeProfile
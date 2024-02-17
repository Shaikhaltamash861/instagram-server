const Post=require('../model/postModel');
const User=require('../model/userModel')
const express=require('express')
const router=express.Router();
const post=async(req,res)=>{
    
    const data={
        caption:req.body.caption,
        image:req.body.image,
        postedBy:req.body.id
    }
    try {
        
        const post = await Post(data);
                const p=await post.save()
        
        const user = await User.findById(req.body.id);
        user.posts.push(post._id);
        await user.save();
        res.status(201).json({
            success: true,
            post,
        });
    } catch (error) {
        console.log(error)
        res.status(200).json({success:false,
        error})
        
    }


    
    
}

const getPost=async(req,res)=>{
    
    try {
        
        const response=await Post.find({
            postedBy:req.query.id
        }).sort({createdAt:-1});
        res.send(response)
    } catch (error) {
        res.status(201).json({message:error._message})
    }
}
// get all posts who followed by me
 const getPostMyFollowing=async(req,res)=>{

        
     
     try {
         const user=await User.findById({_id:req.body.id})
         const totalPosts = await Post.find({
            postedBy: {
                $in: user.following
            }
        }).select('_id')
const postId=totalPosts.map((post)=>post._id)
const result = await Post.aggregate([
    {
              $match: { _id: { $in:postId} }
            },
            {
                $lookup: {
                    from: 'users',
                    localField:'postedBy',
                    foreignField:'_id',
                    as: 'bucket'
                }
            }
        ]).sort({createdAt:-1});
        return res.status(200).json({
            success: true,
            posts: result,
            totalPosts:postId.length
        });
      
        
    } catch (error) {
        console.log(error)
    }
}
const deletePost=async(req,res)=>{
    const postId=req.query.postId
    const userId=req.body.userId;
   
    try {
         const post=await Post.findById({_id:postId})
         console.log(post.postedBy)
         console.log(userId)
         if(post){
               if(post.postedBy.toString()!==userId){
                return res.status(201).json({message:'unauthorized user',success:false})
               }
               await post.deleteOne()
               const user=await User.findById({_id:userId})
                const index=user.posts.indexOf(postId)
                user.posts.splice(index,1);
              const save=  await user.save()
             res.status(200).json({message:'post deleted',success:true})
            }
            else{

                res.status(201).json({message:'post not found',success:false})
            }

    } catch (error) {
        console.log(error)
        res.status(201).json({message:'Cannot delete',success:false})
    }
}
 const whoCommented=async(req,res)=>{
     console.log(req.body)
     const response=await Post.findById({_id:req.body.postId}).select('comments.user')
     const commentUser=response.comments.map((id)=>id.user)
    //  const user=await User.findById({_})
    console.log(commentUser)
     try {
         
         const result = await Post.aggregate([
             {
                  $match: { 'comments.user': { $in:commentUser} }
                },
                {
                    $lookup: {
                        from: 'users',
                        localField:'comments.user',
                        foreignField:'_id',
                        as: 'bucket'
                    },
                },
               
                 
                        
                    
                
            ])
           res.send(result)
        } catch (error) {
            res.status(201).json({message:error,success:false})
           
        }
    }

 // add comment to corresponds to post id
const addComment=async(req,res)=>{
    console.log(req.body)
    const post=await Post.findById({_id:req.body.postId})
    try {
        
        const setComment=post.comments.push({
            user:req.body.user,
              comment:req.body.comment
            })
            
           if(setComment){

               const respnse= await post.save();
               if(respnse){

                res.status(200).json({message:'comment added'})
               }
               
           } 
           res.status(201).json({message:'unable comment '})
        
    } catch (error) {
       console.log(error)   
       res.status(201).json({message:error._message})
    }
}
const likePost=async(req,res)=>{
    try {
        
        const post=await Post.findById({_id:req.body.postId});
        if(!post){
        res.status(201).json({message:'post not found',success:false})
    }
    if (post.likes.includes(req.body.userId)) {
        const index = post.likes.indexOf(req.body.userId);

        post.likes.splice(index, 1);
        await post.save();

        return res.status(200).json({
            success: true,
            message: "Post Unliked"
        });
    } else {
        post.likes.push(req.body.userId)

        await post.save();

        return res.status(200).json({
            success: true,
            message: "Post Liked"
        });
    } 
}
    catch (error) {
        console.log(error)
        //  res.status(201).json({message:'jhbh',success:false})
    }
    }
exports.post=post
exports.getPost=getPost
exports.addComment=addComment;
exports.deletePost=deletePost
exports.getPostMyFollowing=getPostMyFollowing
exports.whoCommented=whoCommented
exports.likePost=likePost

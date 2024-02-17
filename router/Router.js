const express=require('express')
const router=express.Router();
const {signup,signin, getUserById, getUserByUserName, followUser, getFollowers, getFollowing, changeProfile}=require('../controller/userContriller');
const { post,getPost, addComment, getPostMyFollowing, whoCommented, likePost, deletePost } = require('../controller/postController');
const { newConverstion, getConversation } = require('../controller/conversationController');
const { newMessage, getMessages, lastMsg } = require('../controller/messagesController');

router.post('/signup',signup);
router.post('/signin',signin)
router.post('/post',post)
router.get('/posts',getPost)
router.post('/follow/user',followUser);
router.get('/user',getUserById);
router.post('/retrive/user',getUserByUserName);
router.post('/get/followers',getFollowers)
router.post('/get/following',getFollowing)
router.post('/change/profile',changeProfile)
router.post('/add/comment',addComment);
router.post('/get/posts/following',getPostMyFollowing)
router.post('/get/commented/user',whoCommented)
router.post('/like',likePost)
router.post('/delete/post',deletePost)
router.post('/new/conversation',newConverstion)
router.get('/get/conversations',getConversation)
router.post('/new/message',newMessage)
router.get('/retrive/messages',getMessages)
router.get('/last/message',lastMsg);
module.exports=router
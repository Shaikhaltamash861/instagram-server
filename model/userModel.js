const mongoose=require('mongoose')
const schema=new mongoose.Schema({
    token:{
     type:String
    },
    name: {
    type: String,
    required: [true, "Please enter name"]
},
email: {
    type: String,
    required: [true, "Please enter email"],
    unique: [true, "Email already exists"],
},
username: {
    type: String,
    required: [true, "Please enter username"],
    // minlength: [6, "Username must be of minimum 6 characters"],
    unique: [true, "Username already exists"],
},
password: {
    type: String,
    required: [true, "Please enter password"],
    minlength: [6, "Password must be of minimum 6 characters"],
    // select: false,
},
avatar: {
    type: String,
    default:'i am image'
},
bio: {
    type: String,
    default: "Hi👋 Welcome To My Profile"
},
website: {
    type: String,
    trim: true,
},
posts: [
    {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Post",
    }
],
saved: [
    {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Post",
    }
],
followers: [
    {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
    }
],
following: [
    {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
    }
],

resetPasswordToken: String,
resetPasswordExpiry: Date,
});
const model=mongoose.model('USER',schema);
module.exports=model;
const mongoose =require('mongoose')
require('dotenv').config()

mongoose.connect(process.env.MONGOURI)
.then(()=>{
    console.log('database is connected')
})
.catch((err)=>{
    console.log(err)
})
const express=require('express')
const app=express()
const PORT=process.env.PORT  || 8000;
const cors=require('cors')
const bodyParser=require('body-parser')
const router=require('./router/Router')
require('./connection/connection')
app.use(express.json())
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(cors())
app.use('/api',router);

app.get('/',(req,res)=>{
    res.send('hii this is api');

})

app.listen(PORT,console.log(`server is running on ${PORT}`))

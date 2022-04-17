const express = require('express');
const mongoose = require('mongoose')
const userRouter  = require('./Routers/userRouters')
const shopRouter  = require('./Routers/shopRoutes')

//db connection
require('dotenv/config')
mongoose.connect(process.env.MONGODB_URL_LOCAL,{
    useNewUrlParser:true,
    useUnifiedTopology:true,
    // useCreateIndex:true
})
.then (()=>console.log("Conneted to Mongo db"))
.catch((err)=> console.log("Connection Failed",err))


const app = express();
// parse
app.use(express.json());

app.use('/api/user',userRouter)
app.use('/api/shop',shopRouter)

const port  = process.env.PORT || 8080;
app.listen(port,()=>{
    console.log(`App running on port ${port} `)
})

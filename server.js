const express = require('express');
const mongoose = require('mongoose')
const userRouter  = require('./Routers/userRouters')
const shopRouter  = require('./Routers/shopRoutes')
const morgan = require('morgan');
const helmet = require("helmet");
const colors = require('colors');

//db connection
require('dotenv/config')
mongoose.connect(process.env.MONGODB_URL_LOCAL,{
    useNewUrlParser:true,
    useUnifiedTopology:true,
    // useCreateIndex:true
})
.then (()=>console.log(colors.bgGreen(" 💯👍 Conneted to Mongo db ")))
.catch((err)=> console.log("Connection Failed",err))


const app = express();
// parse
app.use(express.json());
app.use(helmet());

app.use('/api/user',userRouter)
app.use('/api/shop',shopRouter)
// Dev logging middleware
if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'));
  }

const port  = process.env.PORT || 8080;
app.listen(port,()=>{
    console.log(colors.green(`😁App running on port ${port} `))
})

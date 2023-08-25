//Dotenv
const dotenv = require("dotenv");
dotenv.config({path:'./config.env'});
//Express
const express = require('express')
const app = express();

const cookieParser = require('cookie-parser');
app.use(cookieParser());

const PORT = process.env.PORT;
//DB File
require("./db/conn");

//For reading post call data jsons
app.use(express.json());


//Importing Models
//const User = require("./models/userSchema");


//Router Files
app.use(require("./routes/auth"));

//Middleware
const middleware = (req,res,next)=>{
    console.log("Hello My Middleware");
    next();
}



app.listen(PORT, ()=>{
    console.log("Server is running");
})
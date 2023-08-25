const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const authenticate = require('../middleware/authenticate');

require("../db/conn");
const User = require("../models/userSchema");

router.get('/', (request, response) => {
    response.send("Hellooooo World From The Server");
})

router.post('/login', async (request, response) => {
    try {
        const {email,password} = request.body;
        if(!email || !password){
            return response.status(400).json({ error: "Please Fill The Field Properly" });
        }
        const user = await User.findOne({email:email});
        if(user){
           isMatch = await bcrypt.compare(password, user.password);

            const token = await user.generateAuthToken();

            console.log(token);

            response.cookie("jwtoken",token, {
                expires : new Date(Date.now() + 25892000000 ),
                httpOnly : true
            }); 

            if(isMatch){
                response.status(200).json({success:"You are successfully logged in"});
            }else{
                response.status(400).json({success:"You are not successfully logged in"});
            }
        }  
        
      } catch (error) {
        response.status(400).json({success:"You are not successfully logged in"});
        console.log(error);
    }
})

router.get('/about', (request, response) => {
    response.send("Hello about Page");
})

router.get('/record', authenticate , (request, response) => {
    console.log(request.rootUser);
    response.send(request.rootUser);
})

router.post('/signup',async (request, response) => {

    const { name, email, phone, password, cpassword } = request.body;
    if (!name || !email || !phone || !password || !cpassword) {
        return response.status(422).json({ error: "Please Fill The Filed Properly" });
    }

    try {
        const userExists = await User.findOne({ email: email });
        if (userExists) {
            return response.status(422).json({ error: "Email Already Exists" });
        }

        const user = new User({ name, email, phone, password, cpassword });
        
        await user.save();
        response.status(201).json({ success: "Saved" });

    } catch (error) {
        console.log(error);
    }


});

// router.get('/aboutme',middleware,(request,response) => {
//     response.send("Hello About Me Page");
// })


module.exports = router;

// Using Promises( then and catch function) for inserting DataTransfer

// router.post('/signup', (request, response) => {
//     const { name, email, phone, password, cpassword } = request.body;
//     if (!name || !email || !phone || !password || !cpassword) {
//         return response.status(422).json({ error: "Please Fill The Filed Properly" });
//     }

//     User.findOne({ email: email }).then((result) => {
//         if (result) {
//             return response.status(422).json({ error: "Email Already Exists" });
//         }
//         const user = new User({ name, email, phone, password, cpassword });

//         user.save().then(() => {
//             response.status(201).json({ success: "Saved" })
//         }).catch(() => {
//             response.status(500).json({ error: "Not Saved" })
//         })
//     }).catch((err)=>{
//         console.log(err);
//     });
// });



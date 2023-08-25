const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require("jsonwebtoken");

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    phone: {
        type: Number,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    cpassword: {
        type: String,
        required: true
    },
    token:{
            type: String,
            required: false
    }
})



// We Are hashing password
userSchema.pre('save', async function (next) {
    if (this.isModified('password')) {
        this.password = await bcrypt.hash(this.password, 12);
        this.cpassword = await bcrypt.hash(this.cpassword, 12);
    }
    next();
});

//generating{ token
userSchema.methods.generateAuthToken = async function () {
    try {
        let mytoken = jwt.sign({_id : this._id}, process.env.SECRET_KEY);
        this.token = mytoken;
        await this.save();
        return mytoken;
    } catch (error) {
        console.log(error);
    }
}
const User = mongoose.model('user', userSchema);
module.exports = User;

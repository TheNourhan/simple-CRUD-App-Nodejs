const mongoose = require('mongoose');
const userSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true,
    },
    email:{
        type:String,
        required:true,
    },
    phone:{
        type:String,
        requird:true,
    },
    image:{
        type:String,
        required:true,
    },
    created:{
        type:Date,
        required:true,
        default:Date.now,
    },
});
module.exports = mongoose.model("User", userSchema);

import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    username:{
        type: String,
        require: true,
        unique:true 
    },
      userpassword:{
        type: String,
        require: true, 
    },
})

const user = mongoose.model('User', userSchema)
export default user;
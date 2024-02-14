const mongoose = require('mongoose');
const userSchema = mongoose.Schema({
    
  name: { type: String, required: true },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    required: true,
  },
  domain: {
    type: String,
    required: true,
    unique: true,
  },
  designation: {
    type: String,
    required: true,
  },
  member: {
    type: String,
    required: true,
  },
  grade: {
    type: String,
    required: true,
    unique: true,
  },
  team: {
    type: String,
  },
  tasks: {
    type: Array,
    required: true,
  },
  // otp:{
  //   type:String,
  //   default : null
  // },
  // isVerified:{
  //   type:Boolean,
  //   default:false
  // }
});
module.exports=mongoose.model('user',userSchema);

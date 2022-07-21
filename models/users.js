const mongoose = require('mongoose')
const Schema = mongoose.Schema

const userSchema = new Schema({
  username:{
    type:String,
    require: true,
  }
})

const user = mongoose.model("User", userSchema)
module.exports = user;

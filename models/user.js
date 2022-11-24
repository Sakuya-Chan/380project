const mongoose  = require("mongoose");
var Schema      = mongoose.Schema({
  
  userid: {type:String,required:true,unique:true},
  password: {type:String,required:true},
  
});
module.exports  = mongoose.model('user',Schema);

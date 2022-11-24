const mongoose  = require("mongoose")
var Schema      = mongoose.Schema({
Publisher           :{type:String,required:true},
Author              :{type:String,required:true},
Title               :{type:String,required:true},
Subject             :{type:String,required:true},
PubYear             :{type:String,required:true},
ISBNs               :{type:String,required:true},
HEBID               :{type:String,required:true,unique:true},
Handle              :{type:String,required:true},
LocationPublished   :{type:String,required:true},
    
  });
  module.exports  = mongoose.model('book',Schema);
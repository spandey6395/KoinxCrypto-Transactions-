const mongoose = require('mongoose');
const transaction=new mongoose.Schema({
userAddress :{type:String},
result:[]
})
module.exports=mongoose.model("transaction",transaction)
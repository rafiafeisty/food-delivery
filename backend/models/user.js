const mongoose=require("mongoose")

const loginSchema=new mongoose.Schema({
    username:{type:String,required:true},
    password:{type:String,required:true},
})

const foodSchema=new mongoose.Schema({
    foodname:{type:String,required:true},
    fooddescription:{type:String,required:true},
    foodpicture:{type:String,required:true},
    category:{type:String,required:true},
    price:{type:Number,required:true}
})

const orderstausSchema=new mongoose.Schema({
    customername:{type:String,required:true},
    customerid:{type:String,required:true},
    totalbill:{type:Number,required:true},
    orderstatus:{type:String,required:true}
})

const adminSchema=new mongoose.Schema({
    username:{type:String,required:true},
    password:{type:String,required:true},
})

const User=mongoose.model("user",loginSchema)
const Food=mongoose.model("food",foodSchema)
const Status=mongoose.model("ordersatus",orderstausSchema)
const Admin=mongoose.model("admin",adminSchema)

module.exports={User,Food,Status,Admin}
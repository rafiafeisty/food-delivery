const mongoose=require("mongoose")
const bcrypt=require("bcrypt")
const jwt=require("jsonwebtoken")
const {User,Food,Status,Admin} = require("../models/user")
const express=require("express")
require("dotenv").config()
const path=require("path")

const router=express.Router()

router.post("/register",async(req,res)=>{
    const {username,password}=req.body
    const userExist=await User.findOne({username})
    if(userExist){
        res.status(400).json("User already exist")
    }
    else{
        const hashedpass=await bcrypt.hash(password,10)
        const user=new User({username,password:hashedpass})
        await user.save()
        res.status(201).json("User created successfully")
    }
})

router.post('/login',async(req,res)=>{
    const {username,password}=req.body
    const userExist=await User.findOne({username})
    if(!userExist){
        res.status(400).json("User does not exist")
    }
    else{
        const isMatch=await bcrypt.compare(password,userExist.password)
        if(!isMatch){
            res.status(400).json("Invalid credentials")
        }
        else{
            const token = jwt.sign({ id: User._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
            res.status(201).json({ token,userid:userExist._id });
            
        }
    }
})
router.post("/food", async (req, res) => {
    try {
        if (Array.isArray(req.body)) {
            const foods = await Food.insertMany(req.body);
            res.status(201).json({ message: "Foods added successfully", count: foods.length });
        } else {
            const newfood = new Food(req.body);
            await newfood.save();
            res.status(201).json({ message: "Food added successfully" });
        }
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

router.get('/getfood', async(req,res)=>{
    const all_data=await Food.find()
    res.status(200).json(all_data)
})

router.post('/ordersaving',async(req,res)=>{
    const {customername,customerid,totalbill,orderstatus}=req.body
    const neworder=new Status({customername,customerid,totalbill,orderstatus})
    await neworder.save()
    res.status(201).json("Order saved successfully")
})

router.get('/order', async (req, res) => {
    const { customerid } = req.query; 
    const all_data = await Status.find({ customerid });
    res.status(200).json(all_data);
});


router.post("/admincheck",async(req,res)=>{
    const {username,password}=req.body
    const adminexist=await Admin.findOne({username})
    if(!adminexist){
        res.status(400).json("Invalid credentials")
    }
    else{
        const ismatch=await bcrypt.compare(password,adminexist.password)
        if(!ismatch){
            res.status(400).json("Invalid credentials")
        }
        else{
            res.status(200).json("Admin logged in successfully")
        }
    }
})

router.delete("/orderdel",async(req,res)=>{
    const {customerid}=req.query
    const delorder=await Status.findOneAndDelete({customerid})
    res.status(200).json("Order deleted successfully")
})

router.get("/orderall",async(req,res)=>{
    const all_order=await Status.find()
    res.status(200).json(all_order)
})

router.put("/statusupdate/:id", async (req, res) => {
  try {
    const { orderstatus } = req.body;
    const { id } = req.params;

    const updatedOrder = await Status.findByIdAndUpdate(
      id,
      { orderstatus },
      { new: true }
    );

    if (!updatedOrder) {
      return res.status(404).json({ error: "Order not found" });
    }

    res.json(updatedOrder);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to update order status" });
  }
});

module.exports=router
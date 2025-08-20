const mongoose=require("mongoose")
const jwt=require("jsonwebtoken")
const express=require("express")
const cors=require("cors")
require("dotenv").config()

const app=express()
app.use(express.json())

app.use(cors())

app.use(cors({
  origin: "http://localhost:3000", 
  credentials: true
}));


console.log("MONGO_URI: ",process.env.MONGO_URI)
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log("MongoDB connected successfully"))
.catch(err => console.error("MongoDB connection error:", err));

const authRoutes=require('../routes/auth')

app.use('/auth',authRoutes)

const PORT=5000

app.listen(PORT,()=>console.log(`Server is listening to PORT ${PORT}`))
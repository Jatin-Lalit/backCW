const express=require("express")
const fs=require("fs")
const app=express();

const cors = require('cors')
const{connection}=require("./connect.js");

const jwt = require('jsonwebtoken');
const {UserModel}=require("./model/user.model.js")
const bcrypt=require("bcrypt");
const {auth}=require("./middleware/auth.js")
app.use(express.json());
app.use(cors())

/////////////
///login  & registration
app.post("/register",async (req,res)=>{
    const name=req.body.name;
    const email=req.body.email;
    const password=req.body.password;
    try{

bcrypt.hash(password, 5, async (err,hash)=> {
   
    const user=new  UserModel({name,email,password:hash});
    await user.save();
    res.send("registration Completed")
    console.log(user)
    // Store hash in your password DB.
        });
}
    catch(err){
        console.log(err)
    }


    })


//login
app.post("/login",async (req,res)=>{
   const email=req.body.email;
   const password=req.body.password;
   try{
    const user=await UserModel.findOne({email})
    if(user){
bcrypt.compare(password,user.password, (err, result)=> {
            if( result){
                res.status(200).send({"msg":"login done","token":jwt.sign({ UserId: user._id }, 'project')})
               
              
            }else{
                res.send("wrong pass")
            }
        });
    
   }else{
    res.send("login fail")
   }
   }catch(err){
    console.log(err)
}
            
})


app.get("/watches",(req,res)=>{
let data=JSON.parse(fs.readFileSync("./db.json","utf-8"))

res.send(data.appleBands)

})
app.get("/ele",(req,res)=>{
    let data=JSON.parse(fs.readFileSync("./db.json","utf-8"))
    
    res.send(data.ele)
    
    })


//////////////////////////////







app.listen(1212, async ()=>{
    try{
        await connection
         console.log("connected");
    }catch(err){
console.log(err)
    }
    console.log("ok")
   
})
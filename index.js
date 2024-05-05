const dotenv = require('dotenv');
dotenv.config();
const express=require('express');
const app=express();
const bcrypt=require('bcrypt');
const jwt=require('jsonwebtoken');
const fs=require('fs')
const path=require('path');
const { config } = require('dotenv');
app.use(express.json())
const checkToken=(req,res,next)=>{
    try {
        const token=req.headers.authorization
    const getToken= token.split(" ")
    const secret=process.env.SECRET
    const getTokenChecked=jwt.verify(getToken[1],secret,(err,decoded)=>{
        if(err) throw err
        next();
    })
    } catch (error) {
        res.status(500).json({msg:"Erro to verifay!"});
        console.log(error);
    }
}
app.post('/regist', async(req,res)=>{
    const {name,email,password}=req.body
    var number=12
    const genSalt = await bcrypt.genSalt(number)
    const passwordHash=await bcrypt.hash(password,genSalt);
    const secret=process.env.SECRET
    const getToken=()=>{
        try {
            const getJwt= jwt.sign(password,secret,(err,token)=>{
                if (err) throw err
                else  res.status(200).json({msg:"saved with seccess",toke:token})
        })
        } catch (error) {
            res.status(500).json({msg:" erro to autentication!"});
            console.log(error);
        }
        
    }
    if (!fs.existsSync(path.join(__dirname,'test.txt'))) {
        console.log(343);
        try {
            fs.appendFile(path.join(__dirname,'test.txt'),`${email} , ${passwordHash}`, (err,data)=>{
                getToken()
            })
            
        } catch (error) {
            res.status(500).json({msg:"Erro do registe in the file did't found!"});
        }
           
    }else{
        console.log(1343);
        try {
            fs.appendFile(path.join(__dirname,'test.txt'),`\n${email} , ${passwordHash}`, (err,data)=>{
                getToken()
            })
            
        } catch (error) {
            res.status(500).json({msg:"Erro to save in the file!"});
        }
        
    }    

    
})
app.get('/check/:email',checkToken,async(req,res)=>{
    try {
        
        fs.readFile(path.join(__dirname,'test.txt'),'utf8', (err,data)=>{
            var getdata=data.split("\n")
            var dataList=[]
            var dataUser=[]
            var verification=false
            getdata.forEach(element => {
                dataList.push(element.split(","))
            });
            dataList.forEach((element,index)=>{
                var getelementEmail=element[0]
                getelementEmail=getelementEmail.replace(/\s+/g, '');
                if (getelementEmail==req.params.email) {
                    dataUser=dataList[index];
                    verification =true
                    dataList.length=0;
                    
                }
            })
            
            res.status(200).json({msg:verification,dataUser});
           
        })
        
    } catch (error) {
        res.status(500).json({msg:"Error to check email!"});
        console.log(error);
    }
    
})

app.listen(308,function(){
    console.log('serve run')
})
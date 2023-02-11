const mongoose = require("mongoose");
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const employeeSchema = new mongoose.Schema({
    Name : {
        type:String,
        required:true
        },

    DOB : {
        type:String,
        required:true
         },

    Email : {
        type:String,
        required:true,
        unique:true
        },

    Password : {
        type:String,
        required:true,
       // unique:true
         },

     Cpassword : {
            type:String,
            required:true,
           // unique:true
       },   
    Gender : {
        type:String,
        required:true
    } ,
    tokens:[{
        token:{
            type:String,
            required:true
        }
    }]
});

//generating tokens
employeeSchema.methods.generateAuthToken = async function(){
     try{
          console.log(this._id);         
          const token = jwt.sign({_id:this._id.toString()}, "mynameisvishalgargfromdelhiindia");
          this.tokens = this.tokens.concat({token:token});
          await this.save();
          return token;

     }catch(error){
          //res.send("The error part" + error);
          console.log(error);   
     }
}

//converting password into hash
employeeSchema.pre("save", async function(next){

    if(this.isModified("Password")){
        this.Password = await bcrypt.hash(this.Password, 10);
        this.Cpassword = await bcrypt.hash(this.Cpassword, 10);
    }
    next()
});


const HostRegister = new mongoose.model("Hostcollection", employeeSchema);

module.exports = HostRegister;
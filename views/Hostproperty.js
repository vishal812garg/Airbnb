const mongoose = require("mongoose");

const employeeSchema = new mongoose.Schema({
    Host_name : {
        type:String,
        required:true
        },

    Home_Apartment_name : {
        type:String,
        required:true
         },

    Night_price : {
        type:Number,
        required:true,
        unique:true
        },
    
    Market_address : {
            type:String,
            required:true
            },
    
    Country_address : {
            type:String,
            required:true
             },
    
    House_image : {
            type:String,
            required:true,
            unique:true
            },    

     House_apartment_summary : {
                type:String,
                required:true
                },
        
        
});


const HostpropertyRegister = new mongoose.model("Hostpropertycollection", employeeSchema);

module.exports = HostpropertyRegister;
const mongoose = require('mongoose');
mongoose.set('strictQuery', true);
mongoose.connect("mongodb+srv://vishal:vishal@mongodbtutorial.eowucbc.mongodb.net/Airbnbproject?retryWrites=true&w=majority",{
  useNewUrlParser : true,
  useUnifiedTopology : true,
 // useCreateIndex : true,
}).then(() => {
       console.log("connection successfull");    
   }).catch((e) => {
       console.log("no connection");
   })

   
module.exports = mongoose;


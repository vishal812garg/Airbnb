//require('dotenv').config();
const express = require('express');
const {MongoClient} = require('mongodb');
const bodyparser = require('body-parser');
const path = require('path');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');


require("./db/conn");

const Register = require("./views/register");
const HostRegister = require("./views/Hostregister");
const HostpropertyRegister = require ("./views/Hostproperty");
const auth = require("./middleware/auth");
const { Resolver } = require('dns');

const app = express();
const PORT = 3000;

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"))

app.use(cookieParser());
app.use(express.json());
app.use(bodyparser.urlencoded({
    extended:true
}));





//Home Page
async function finddata1(){
    //db connection
    const uri = "mongodb+srv://vishal:vishal@mongodbtutorial.eowucbc.mongodb.net/?retryWrites=true&w=majority";
    const client = new MongoClient(uri);
     client.connect();

    //fetch data  
    const result = await client.db("sample_airbnb").collection("listingsAndReviews").find().limit(12).toArray();
    result.forEach(db => {
        console.log(db);
     });
     return result
}


//Details Page
async function finddata2(id){
    //db connection
    const uri = "mongodb+srv://vishal:vishal@mongodbtutorial.eowucbc.mongodb.net/?retryWrites=true&w=majority";
    const client = new MongoClient(uri);
    await client.connect();

    //fetch data
    const result = await client.db("sample_airbnb").collection("listingsAndReviews").findOne({_id:id});
     return result
}



//Host Card Home Page
async function finddata3(){
  //db connection
  const uri = "mongodb+srv://vishal:vishal@mongodbtutorial.eowucbc.mongodb.net/?retryWrites=true&w=majority";
  const client = new MongoClient(uri);
   client.connect();

  //fetch data  
  const result = await client.db("Airbnbproject").collection("hostpropertycollections").find().toArray();
  result.forEach(db => {
      console.log(db);
   });
   return result
}




//Host Card Details Page
async function finddata4(Host_name){
  //db connection
  const uri = "mongodb+srv://vishal:vishal@mongodbtutorial.eowucbc.mongodb.net/?retryWrites=true&w=majority";
  const client = new MongoClient(uri);
  await client.connect();

  //fetch data
  const result = await client.db("Airbnbproject").collection("hostpropertycollections").findOne({Host_name:Host_name});
  console.log(result); 
  return result
}





async function finddata5(){
  //db connection
  const uri = "mongodb+srv://vishal:vishal@mongodbtutorial.eowucbc.mongodb.net/?retryWrites=true&w=majority";
  const client = new MongoClient(uri);
  await client.connect();

  //fetch data
  const result = await client.db("Airbnbproject").collection("hostpropertycollections").find().toArray();
  result.forEach(db => {
    console.log(db); 
  });
  return result
}






//Home Page
app.get('/', async(req, res) =>{
    let data = await finddata1()
    let data1 = await finddata3() 
    //console.log(data);
    res.render('Home', {
      data:data, 
      data1:data1, 
    })
});


//Details Page
app.get('/details/:id', async(req, res) => {
   let data = await finddata2(req.params.id);
   res.render('details', {
     data:data       
    })
  });   




//Host Card Details Page
app.get('/Hostdetails/:Host_name', async(req, res) => {
  let data = await finddata4(req.params.Host_name);
  res.render('Hostdetails', {
    data:data       
   })
 });





// Host total propertList Page
 app.get('/HostpropertyList', async(req, res) => {
  let data = await finddata5();
  res.render('HostpropertyList', {
    data:data       
   })
 });



 //Host property CRUD Action Page
app.get('/HostpropertyList', (req, res) => {
  res.render('HostpropertyList.ejs');
});



//Host property update Page
app.get('/editHostproperty', (req, res) => {
  res.render('editHostproperty.ejs');
});


//Host property update
app.get('/editHostproperty/:id', (req, res) => {
  let id = req.params.id;
  HostpropertyRegister.findById(id, (err, data) => {
    if (err) {
        res.redirect('/');
    } else {
        if (data === null) {
            redirect('/')
        } else {
            res.render('editHostproperty', {
                data: data
            })
        }
    }
})
 });


//Host property update
 app.post('/editHostproperty/:id',async (req, res) => {
  let id = req.params.id;

   await HostpropertyRegister.findByIdAndUpdate({_id:id},{
       Host_name : req.body.Host_name,
       Home_Apartment_name : req.body.Home_Apartment_name,
       Night_price : req.body.Night_price,
       Market_address : req.body.Market_address,
       Country_address : req.body.Country_address,
       House_image : req.body.House_image,
       House_apartment_summary : req.body.House_apartment_summary },

   ), res.redirect('/HostpropertyList')
    
 });




//Host property delete
 app.get('/deleteHostproperty/:id', (req, res) => {
  let id = req.params.id;
  

  HostpropertyRegister.findByIdAndRemove(id, function (err) {
     if (err){
        console.log(err)
    }
    else{
        console.log("Deleted : ");
        res.redirect('/HostpropertyList');
    }
});
 });



 



//Client Login/Signup main Page
app.get('/loginsignup', (req, res) =>{
  res.render('loginsignup')
})



//Client Signup Page
app.get('/signup', (req, res) =>{
  res.render('signup')
});



//Clint singup page
app.post('/register', async(req, res) =>{

  try{
         const Password = req.body.Password;
         const Cpassword = req.body.Cpassword;
         
         console.log(Password,Cpassword);

         if(Password === Cpassword){

          const registerEmployee = new Register({
            Name : req.body.Name,
            DOB : req.body.DOB,
            Email : req.body.Email,
            Gender : req.body.Gender,
            Password : req.body.Password,
            Cpassword : req.body.Cpassword
           })

           const token = await registerEmployee.generateAuthToken();
           console.log("the token part" + token);

           res.cookie("jwt", token, {
              expires:new Date(Date.now() + (20* 60* 1000))
           });

           const registered = await registerEmployee.save();
           console.log("the page part" + registered);

            if(registered != " "){
              res.redirect('/login');
           }

         }else{
          res.send("Password not matching")
        }
    }catch(error){
        console.log(error)
        res.send("invalid Email & Password")
    }
});




//Client Login Page
app.get('/login', (req, res) =>{
  res.render('login')
});

//Clint login page
app.post('/login', async(req, res) => {

  try{
        const Email = req.body.Email;
        const Password = req.body.Password;
        
        const user = await Register.findOne({Email:Email});
        console.log(user);

        const isMatch = await bcrypt.compare(Password, user.Password); 
         
        const token = await user.generateAuthToken();
           console.log("the token part" + token);


           res.cookie("jwt", token, {
            expires:new Date(Date.now() + (20* 60* 1000))
         });


        if(isMatch){
          res.status(201).redirect('/');
        }else{
           res.send("invalid Password")
           console.log("Hello")
        }
        
        
    }catch(error){
         console.log(error)
         res.status(400).send("invalid Email & Password")
     }
  });








//Host Login/Signup main Page
app.get('/Hostloginsignup', (req, res) =>{
  res.render('Hostloginsignup')
})



//Host Signup Page
app.get('/Hostsignup', (req, res) =>{
  res.render('Hostsignup')
});


//Host singup page
app.post('/Hostregister', async(req, res) =>{

  try{
         const Password = req.body.Password;
         const Cpassword = req.body.Cpassword;
         
         console.log(Password,Cpassword);

         if(Password === Cpassword){

          const registerEmployee = new HostRegister({
            Name : req.body.Name,
            DOB : req.body.DOB,
            Email : req.body.Email,
            Gender : req.body.Gender,
            Password : req.body.Password,
            Cpassword : req.body.Cpassword
           })

           const token = await registerEmployee.generateAuthToken();
           console.log("the token part" + token);

           res.cookie("jwt", token, {
              expires:new Date(Date.now() + (20* 60* 1000))
           });

           const registered = await registerEmployee.save();
           console.log("the page part" + registered);

            if(registered != " "){
              res.redirect('/Hostlogin');
           }

         }else{
          res.send("Password not matching")
        }
    }catch(error){
        console.log(error)
        res.send("invalid Email & Password")
    }
});



//Host Login Page
app.get('/Hostlogin', (req, res) =>{
  res.render('Hostlogin')
});


//Host login page
app.post('/Hostlogin', async(req, res) => {

  try{
        const Email = req.body.Email;
        const Password = req.body.Password;
        
        const user = await HostRegister.findOne({Email:Email});
        console.log(user);

        const isMatch = await bcrypt.compare(Password, user.Password); 
         
        const token = await user.generateAuthToken();
           console.log("the token part" + token);


           res.cookie("jwt", token, {
            expires:new Date(Date.now() + (20* 60* 1000))
         });


        if(isMatch){
          res.status(201).redirect('/Host');
        }else{
           res.send("invalid Password")
           console.log("Hello")
        }
        
        
    }catch(error){
         console.log(error)
         res.status(400).send("invalid Email & Password")
     }
  });



//Host Property Page
  app.get('/Host', (req, res) =>{
  res.render('Host')
});


//Host Property List Page
app.post('/Hostproperty', async(req, res) => {

  try{

     const registerEmployee = new HostpropertyRegister({
      Host_name : req.body.Host_name,
      Home_Apartment_name : req.body.Home_Apartment_name,
      Night_price : req.body.Night_price,
      Market_address : req.body.Market_address,
      Country_address : req.body.Country_address,
      House_image : req.body.House_image,
      House_apartment_summary : req.body.House_apartment_summary
      })


      const registered = await registerEmployee.save();
      console.log("the page part" + registered);

       
         res.redirect('/');
      

}catch(error){
   console.log(error)
   res.send("invalid Email & Password")
}
});



//client Authentication 
app.get('/reserve', (req, res) => {
  res.render('reserve');
});


//client Authentication
app.post('/reserve', auth, (req, res) => {
    res.redirect('/reserve');
});



//client logout
app.get('/logout', auth, async (req, res)=> {
   try{
       res.clearCookie("jwt"); 
       console.log("logout successfully")
       await req.user.save();

       res.render("login");
   }catch(error){
       res.send(error);
   }
})




app.listen(PORT, () => console.log("Server is Started"));
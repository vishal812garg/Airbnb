const jwt = require('jsonwebtoken');
const Register = require('../views/register');



const auth = async (req, res, next) => {
    try{
        const token = req.cookies.jwt;
        const verifyUser = jwt.verify(token, "mynameisvishalgargfromdelhiindia");
        console.log(verifyUser);

        const user = await Register.findOne({_id:verifyUser._id})
        console.log(user);

        req.token = token;
        req.user = user;
        
        next();

    }catch(error){
       // res.send(error);
        res.redirect('/loginsignup');
    }
}






module.exports = auth;

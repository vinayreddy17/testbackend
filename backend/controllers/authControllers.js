// authControllers.js
import UserModel from "../models/user.js";
import { hashPassword, comparePassword } from "../helpers/auth.js";
import jwt from "jsonwebtoken";



const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body; //check name entered
    if (!name) {
      return res.json({ error: "name is required" });
    }

    if (!password || password.length < 6) {
      //check password length
      return res.json({
        error: "password is required and atleast 6 charecters long",
      });
    }

    const exist = await UserModel.findOne({ email });

    if (exist) {
      return res.json({
        //check existing email
        error: "Email is taken already",
      });
    }
    const hashedPassword = await hashPassword(password);
    const user = await UserModel.create({
      name,
      email,
      password: hashedPassword,
    });
    return res.json(user);
  } catch (error) {}
};

const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await UserModel.findOne({ email });

    if (!user) {
      return res.json({
        error: "No user found",
      });
    }

    const match = await comparePassword(password, user.password);
    console.log(process.env.JWT_SECRET);
    if (match) {
      
      jwt.sign(
        { email: user.email, id: user._id, name: user.name },
        process.env.JWT_SECRET,
        {},
        (err, token) => {
          if (err) throw err;
        // console.log( res.cookie("token", token).json(user));
          res.cookie("token", token).json(user);
          
        }
      );
    }
  } catch (error) {
    return res.json({
      error: "passwords do not match",
    });
  }
};

const getProfile =(req,res)=>{
const {token}=req.cookies;
if(token){
  jwt.verify(token,process.env.JWT_SECRET,{},(err,user)=>{
    if(err) throw err;
    res.json(user)
  })
}else {
  res.json(null)
}
}

export {  registerUser, loginUser, getProfile };

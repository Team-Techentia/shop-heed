const userModel = require("../../Model/userModel");
const jwt = require("jsonwebtoken");
require("dotenv").config()
const googleAuth = async function (req, res) {
  try {
    const data = req.body;
    let user;

    
    const checkUser = await userModel.findOne({ email: data.email, password: data.uid });

    if (checkUser) {
      const { name, lastName, image, email , role } = checkUser;
      const token = generateToken(checkUser._id);

      return res.status(201).json({
        message: "User successfully authenticated",
        data: { name, lastName, image, email , role },
        token: token,
      });
    }

  
    const existingUser = await userModel.findOne({ uid: data.uid });

    if (existingUser) {
      
      existingUser.name = data.name;
      existingUser.lastName = data.lastName;
      existingUser.image = data.image;
      existingUser.email = data.email;
      existingUser.password = data.uid;

     
      user = await existingUser.save();
    } else {
     
      data.password = data.uid;
      user = await userModel.create(data);
    }

    if (user) {
      const { name, lastName, image, email , role } = user;
      const token = generateToken(user._id);

      return res.status(201).json({
        message: "User successfully authenticated",
        data: { name, lastName, image , email , role },
        token: token,
      });
    }
  } catch (error) {
 
    return res.status(500).send("Internal Server Error");
  }
};


const generateToken = (userId) => {
  return jwt.sign(
    {
      userId: userId.toString(),
      iat: Math.floor(Date.now() / 1000),
    },
   process.env.JWT_SECRET_KEY
  );
};

module.exports = { googleAuth };

const userModel = require("../Models/userModels");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const validator = require("validator");

const createToken = (_id) => {
    const jwtKey = process.env.JWT_SECRET_KEY;
    return jwt.sign({ _id }, jwtKey, { expiresIn: "3d" });
};

const registerUser = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        // Check if the user already exists
        let user = await userModel.findOne({ email });
        if (user) return res.status(400).json("User with the given email already exists");

        // Validate input
        if (!name || !email || !password)
            return res.status(400).json("All fields are required");
        if (!validator.isEmail(email))
            return res.status(400).json("Not a valid Email");
        if (!validator.isStrongPassword(password))
            return res.status(400).json("Not a strong password");

        // Create new user
        user = new userModel({ name, email, password });

        // Hash the password
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(user.password, salt);

        // Save user to the database
        await user.save();

        // Generate token
        const token = createToken(user._id);

        res.status(200).json({ _id: user._id, name, email, token });
    } catch (error) {
        console.log(error);
        res.status(500).json(error);
    }
};

const loginUser = async (req,res) => {
    const {email, password} = req.body;

    try{
        let user = await userModel.findOne({email});

        if(!user)
            return res.status(400).json("Invalid email or password");
        
        const isValidPassword= await bcrypt.compare(password, user.password);

        if(!isValidPassword)
            return res.status(400).json("Invalid email or password");

        const token = createToken(user._id);

        res.status(200).json({ _id: user._id, name : user.name, email, token });
    }
    catch(error){
        console.log(error);
        res.status(500).json(error);
    }
};

const findUser = async (req,res) => {
    const userId = req.params.userId;
    try{
        const user = await userModel.findById(userId);
        
        res.status(200).json(user);
    }
    catch(error){
        console.log(error);
        res.status(500).json(error);
    }
};

const getUsers = async (req,res) => {
    
    try{
        const users = await userModel.find();
        
        res.status(200).json(users);
    }
    catch(error){
        console.log(error);
        res.status(500).json(error);
    }
};

module.exports = { registerUser, loginUser, findUser,getUsers};

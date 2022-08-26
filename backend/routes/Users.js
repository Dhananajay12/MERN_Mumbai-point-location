const router = require("express").Router();
const User = require("../models/User");
const bcrypt = require('bcrypt');

//Register 

router.post("/register", async (req, res) => {

    try {
        //generate new password 
        const salt = await bcrypt.genSalt(10);

        const hashedPassword = await bcrypt.hash(req.body.password, salt);


        //create new user
        const newUser = new User({
            username: req.body.username,
            email: req.body.email,
            password: hashedPassword
        });

        //save user and send response
        const user = await newUser.save();
        res.status(200).json(user._id);

    } catch (err) {
        res.status(500).json("wrong password or username");

    }
});



//login

router.post("/login", async (req, res) => {


    const {username,  password } = req.body;

    try {

        //find user
        const userLogin = await User.findOne({ username: username });
        !userLogin && res.status(400).json("Wrong username or password");

        //validate password
       
        const valid = await bcrypt.compare( password,userLogin.password);

        !valid && res.status(400).json("Wrong username or password");

       res.status(200).json({ _id : userLogin._id, username:username });
    } catch (err) {
        res.status(500).json("wrong password or username");
    }
});




module.exports = router; 
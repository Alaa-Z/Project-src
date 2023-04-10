const router = require('express').Router();
const User = require('../model/User')
const bcrypt= require('bcryptjs')
const jwt = require('jsonwebtoken');

// import validate
const {registerValidation, loginValidation} = require('../validation')



// ROUTE TO REGISTER ACOUNT 
router.post('/register', async (req, res) => {

    // Validate the data 
    const {error} = registerValidation(req.body)
    //   If there is an error 
    if(error) {
        return res.status(400).send(error.details[0].message)
    }
    // Check if the user exist in the database 
    const emailExist = await User.findOne({ email : req.body.email})
    if(emailExist){
        return res.status(400).send("Email already exists")
    }

    // Hash passwords
    const salt = await bcrypt.genSaltSync(10);
    const hashedPassword = await bcrypt.hashSync(req.body.password, salt);

    // Create new user
    const user = new User({
        name : req.body.name,
        email : req.body.email,
        password : hashedPassword
    });
    try {
        const savedUser = await user.save();
        // res.send({ user: user._id })
        res.json({ message: 'User registered successfully.' });

    } catch (error) {
        res.status(400).send(error)
    }
})

// ROUTE TO LOGIN
router.post('/login', async (req, res) => {

    // Validate the data 
    const {error} = loginValidation(req.body)
    //   If there is an error 
    if(error) {
        return res.status(400).send(error.details[0].message)
    }
    // Check if the user exist 
    const user = await User.findOne({ email : req.body.email})
    if(!user){
        return res.status(400).send("Email Not Found ")
    }

    // Check if the password is correct 
    const validPassword = await bcrypt.compare(req.body.password, user.password);
    if(!validPassword){
        return res.status(400).send("Invalid password")
    }

    // Check if the user is an admin
    if(req.body.email === process.env.ADMIN_EMAIL && req.body.password === process.env.ADMIN_PASSWORD){
        // Update the value of isAdmin in the database to true
        user.isAdmin = true;
        await user.save();  
    }   
    // res.send("Logged in")
    
    // Create and assign a token
    const token = jwt.sign({_id: user._id, isAdmin: user.isAdmin}, process.env.TOKEN_SECRET);
    res.header('auth-token', token).send(token);
})
module.exports = router;
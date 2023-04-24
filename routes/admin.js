const router = require('express').Router();
const User = require('../model/User')
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');

dotenv.config();

// ROUTE FOR ADMIN
router.get('/', async (req, res) => {
    console.log('Admin route accessed');

    // Check if the user is authenticated
    const token = req.header('auth-token');
    console.log(token); 

    if (!token) {
        return res.status(401).send('Access denied. No token provided.');
    }

    try {
        const verified = jwt.verify(token, process.env.TOKEN_SECRET);
        console.log(verified); 
        console.log(verified.isAdmin); 

        // Check if the user is an admin
        if (!verified.isAdmin) {
            
            return res.status(403).send('Access denied. Not authorized to access this resource.');
        }
        // Get all users
        const users = await User.find();
        // Find the admin using ID stored in the token 
        const admin = await User.findById(verified._id).select('-password');
        
        // send back admin info and users list 
        const data = { users, admin };
        res.send(data);
        
    } catch (err) {
        res.status(400).send('Invalid token.');
    }
});
module.exports = router;
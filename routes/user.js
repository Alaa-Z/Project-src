const router = require('express').Router();
const User = require('../model/User')
const bcrypt= require('bcryptjs')
const jwt = require('jsonwebtoken');
const Message = require('../model/Message')
const Conversation = require('../model/Conversation')

// import validate
const {registerValidation, loginValidation, msgsValidation} = require('../validation')

// Import authMiddleware 
const authMiddleware = require('../middleware/auth');


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
        password : hashedPassword,
        address: req.body.address,
        latitude: req.body.latitude,
        longitude: req.body.longitude,
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
    res.header('auth-token', token).send({ token });
})

// ROUTE TO GET USER'S PROFILE
router.get('/profile', authMiddleware, async (req, res) => {
    try {
        // Find the user's profile using id in the JWT token
        const user = await User.findById(req.user._id).select('-password').populate('books');;

        // res.json(user);
        res.json({
            id: user._id,
            name: user.name,
            email: user.email,
            isAdmin: user.isAdmin,
            address: user.address,
            books: user.books.map(book => ({
                _id: book._id,
                title: book.title,
                author: book.author,
                ISBN: book.ISBN,
                available: book.available
            })),
        });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// ROUTE TO LOGOUT
router.get('/logout', authMiddleware, (req, res) => {
    // Clear the auth token cookie
    res.clearCookie('auth-token');
    res.send('Logged out successfully');
});



// SEND MESSAGES BETWEEN 2 USERS
router.post('/messages/:recipientId', authMiddleware, async (req, res) => {

    // Validate the data 
    const {error} = msgsValidation(req.body)
    //   If there is an error 
    if(error){
        return res.status(400).send(error.details[0].message)
    }

  try {
    const senderId = req.user._id;
    const recipientId = req.params.recipientId;
    const content = req.body.content;

    // Check if a conversation between already exists between them
    let conversation = await Conversation.findOne({
      users: { $all: [senderId, recipientId] }
    });
    
    // create a new conversation if it is not exisit
    if (!conversation) {
      conversation = new Conversation({
        users: [senderId, recipientId]
      });
      await conversation.save();
    }

    // Create a message then add it to the conversation
    const message = new Message({
      conversation: conversation._id,
      sender: senderId,
      recipient: recipientId,
      content
    });
    await message.save();
    conversation.messages.push(message);
    await conversation.save();

    res.send(message);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
});

// GET ALL CONVERSATIONS FOR A USER
router.get('/messages', authMiddleware, async (req, res) => {
    try {
      const userId = req.user._id;
      // send from conersation the sender's name
      const conversations = await Conversation.find({ users: userId })
        .populate('users', 'name')
        .populate({
          path: 'messages',
          populate: { path: 'sender', select: 'name' }
        })
        .exec();
      res.send(conversations);
    } catch (err) {
      console.error(err);
      res.status(500).send('Server Error');
    }
});


// GET CONVERSATIONS BY ID
router.get('/messages/:conversationId', authMiddleware, async (req, res) => {
    try {
      const userId = req.user._id;
      const conversationId = req.params.conversationId;
  
      // Find the conversation by ID and send from conersation the users sender and recipient 
      const conversation = await Conversation.findOne({
        _id: conversationId,
        users: userId
      })
        .populate('users', 'name')
        .populate({
          path: 'messages',
          populate: [
            { path: 'sender', select: 'name' },
            { path: 'recipient', select: 'name' }
        ],
        });
  
      if (!conversation) {
        return res.status(404).json({ message: 'Not found' });
      }
  
      res.json(conversation);
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'error' });
    }
});

module.exports = router;
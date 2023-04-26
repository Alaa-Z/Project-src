const router = require('express').Router();
const Book = require('../model/Book')
const User = require('../model/User')

// Import authMiddleware 
const authMiddleware = require('../middleware/auth');

// Import validation 
const {addBookValidation} = require('../validation')


// ROUTE TO GET ALL BOOKS IN DATABASE
router.get('/', async (req, res) => {
    try {
      // Find all books
      const books = await Book.find();
      // return all books
      res.json(books);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
});

// ROUTER TO POST A BOOK
router.post('/add', authMiddleware, async (req, res) => {
    // Validate the data 
    const {error} = addBookValidation(req.body)
    //   If there is an error 
    if(error) {
        return res.status(400).send(error.details[0].message)
    }

    try {
      const book = new Book({
        title: req.body.title,
        author: req.body.author,
        ISBN: req.body.ISBN,
        available: req.body.available || true
    });
   
    // save the book
    const newBook = await book.save();

    // Add the book ID to the user's list of books
    const user = await User.findById(req.user._id);
    user.books.push(newBook._id);
    await user.save();

    // res.json(newBook);
    res.json({ message: 'Your book added successfully.' });

    } catch (err) {
    res.status(500).json({ message: err.message });
    }
});

module.exports = router;
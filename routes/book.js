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
      // Find all books by last added order
      const books = await Book.find().sort({addedAt: -1}).populate('user',['name','address']);
      // return all books
      res.json(books);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
});

// GET BOOK DETAILS
router.get('/:id', async (req, res) => {
  try {
    // find the book and display to whom it belongs
    const book = await Book.findById(req.params.id).populate('user', 'name');
    if (!book) {
      return res.status(404).json({ message: 'Book not found' });
    }
    // return book details
    res.json(book);
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
        available: req.body.available || true,
        user: req.user._id // Set also the user id for the book
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

// ROUTE TO DELETE A BOOK BY ITS OWNER / OR ADMIN
router.delete('/delete/:id', authMiddleware, async (req, res) => {
  try {
    // find the book by id
    const book = await Book.findById(req.params.id);
    if (!book) {
      return res.status(404).json({ message: 'Book not found' });
    }

    // Only thr book owner or the admin can delete the book
    if (book.user.toString() !== req.user._id.toString() && !req.user.isAdmin) {
      return res.status(401).json({ message: 'Unauthorized to delete' });
    }

    // Delete the book from the user's book array
    const user = await User.findById(book.user);
    user.books.pull(book._id);
    await user.save();

    // Delete the book
    await book.deleteOne();

    res.json({ message: 'Book deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ROUTE To CHANGE STATUS OF A BOOK (LOANED OR AVAILABLE)
router.put('/status/:id',authMiddleware, async (req, res) => {
  try{
     // find the book by id
     const book = await Book.findById(req.params.id);
     if (!book) {
      return res.status(404).json({ message: 'Book not found' });
    }

    // Only thr book owner  can edit its status
    if (book.user.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: 'Unauthorized to delete' });
    }

    // toggle the availability of the book(between true and false)
    book.available = !book.available;

    // save the updated book
    await book.save();

    // return the updated book
    res.json(book);
    // res.json({ message: 'Book status have been changed successfully' });

    } catch (error) {
      console.error(error);
      res.status(500).json({ message: err.message });
    }
})


module.exports = router;
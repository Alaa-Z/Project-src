const router = require('express').Router();
const Book = require('../model/Book')


// ROUTE TO GET ALL BOOKS IN DATABASE
router.get('/books', async (req, res) => {
    try {
      // Find all books
      const books = await Book.find();
      // return all books
      res.json(books);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
});

module.exports = router;
const mongoose = require('mongoose');


const bookSchema = new mongoose.Schema({
    title: {
      type: String,
      required: true
    },
    author: {
      type: String,
      required: true
    },
    ISBN: {
      type: String,
      required: true,
      unique: true
    },
    available: {
      type: Boolean,
      required: true,
      default: true
    }
});

module.exports = mongoose.model('Book',bookSchema );

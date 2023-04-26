const mongoose = require('mongoose');


const bookSchema = new mongoose.Schema({
    title: {
      type: String,
      required: true,
      min: 2,
      max: 255
    },
    author: {
      type: String,
      required: true,
      min: 2,
      max: 255
    },
    ISBN: {
      type: String,
      required: true,
      min: 10,
      max: 13
    },
    available: {
      type: Boolean,
      required: true,
      default: true
    }
});

module.exports = mongoose.model('Book',bookSchema );

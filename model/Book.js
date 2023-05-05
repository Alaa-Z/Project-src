const mongoose = require('mongoose');
const User = require('./User');

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
    },
    addedAt:{
      type: Date,
      default: Date.now
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    }
});

module.exports = mongoose.model('Book',bookSchema );

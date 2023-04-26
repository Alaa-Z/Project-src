const mongoose= require('mongoose');
const Book = require('./Book');


const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        min: 2,
        max: 255
    },
    email: {
        type: String,
        required: true,
        min:6,
        max: 255
    },
    password: {
        type: String,
        required: true,
        min:6,
        max: 1024
    },
    date: {
        type: Date,
        default : Date.now
    }, 
    isAdmin: {
        type: Boolean,
        default : false
    },
    books: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Book'
    }],
});


module.exports = mongoose.model('User',userSchema );

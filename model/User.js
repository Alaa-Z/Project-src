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
    address: {
        type: String,
        required: true,
    },
    latitude: {
        type: Number,
        required: true,
    },
    longitude: {
        type: Number,
        required: true,
    },
    books: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Book'
    }],
    conversations: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Conversation'
        }
    ],
    verified: {
        type: Boolean,
        default : false
    },
    verificationToken: {
        type: String
    },
    verificationTokenTime:{
        type: Date
    }
});


module.exports = mongoose.model('User',userSchema );

const mongoose = require('mongoose');

const ConversationSchema = new mongoose.Schema({
  users: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }],
  messages: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Message',
    required: true
  }]
}, { timestamps: true });

module.exports = mongoose.model('Conversation', ConversationSchema);

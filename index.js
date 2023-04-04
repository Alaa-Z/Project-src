const express = require('express');
const app = express(); 
const dotenv = require('dotenv');
const mongoose= require('mongoose');

dotenv.config();

// Connect to MongoDB Atlas with Mongoose
mongoose.connect( process.env.DB_CONNECT, { 
  useNewUrlParser: true,
  useUnifiedTopology: true
});

mongoose.Promise = global.Promise;


// Imoport Routes
const authRoute = require('./routes/auth');

// Route Middlewares
app.use('/api/user/', authRoute)


app.listen(3000, () => {
    console.log("The Server up and running!")
})
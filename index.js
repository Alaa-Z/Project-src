const express = require('express');
const app = express(); 
const dotenv = require('dotenv');
const mongoose= require('mongoose');

// Imoport Routes
const authRoute = require('./routes/auth');

dotenv.config();

// Connect to MongoDB Atlas with Mongoose
mongoose.connect( process.env.DB_CONNECT, { 
  useNewUrlParser: true,
  useUnifiedTopology: true
});

mongoose.Promise = global.Promise;

// Middleware
app.use(express.json());

// Route Middlewares
app.use('/api/user/', authRoute)

app.listen(3000, () => {
    console.log("The Server up and running!")
})
const express = require('express');
const app = express(); 
const dotenv = require('dotenv');
const mongoose= require('mongoose');
const cors = require('cors')

// CORS middleware
app.use(cors());

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', 'http://localhost:3000');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  next();
});

// Imoport Routes
const authRoute = require('./routes/auth');
const adminRouter = require('./routes/admin');

dotenv.config();

// Connect to MongoDB Atlas with Mongoose
mongoose.connect( process.env.DB_CONNECT, { 
  useNewUrlParser: true,
  useUnifiedTopology: true
});

mongoose.Promise = global.Promise;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Route Middlewares
app.use('/api/user/', authRoute)
app.use('/api/admin/', adminRouter);





app.listen(5000, () => {
    console.log("The Server up and running!")
    
})
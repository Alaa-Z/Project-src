const express = require('express');
const app = express(); 
const dotenv = require('dotenv');
const mongoose= require('mongoose');
const cors = require('cors')
// to retrieve a list of the passed router with the set verbs.
const listEndpoints = require('express-list-endpoints')

// CORS middleware
app.use(cors());

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  next();
});

// Imoport Routes
const authRoute = require('./routes/user');
const adminRouter = require('./routes/admin');
const bookRouter = require('./routes/book');

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
app.use('/api/books', bookRouter);


// console.log(listEndpoints(app));

const port = process.env.PORT || 5000;

app.listen(port, () => {
  console.log("The Server up and running!")
});

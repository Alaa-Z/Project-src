const express = require('express');
const app = express(); 

// Impport Routes
const authRoute = require('./routes/auth');

// Route Middlewares
app.use('/api/user/', authRoute)


app.listen(3000, () => {
    console.log("The Server up and running!")
})
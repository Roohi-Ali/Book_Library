require ('dotenv').config();
const express = require('express');
// console.log(process.env)
const app = express();
const path = require('path');
const mongoose = require('mongoose');
const PORT = process.env.PORT;
console.log(PORT)
const ejs = require('ejs');
const dbData = require('./database/dbConn');
const router = require('./routes/router.js')

// const mongoose = require('mongoose');
// mongoose.connect('mongodb://localhost:27017/bookdb');

dbData();

app.set('view engine','ejs')

app.use(express.urlencoded({ extended:false}));
app.use(express.json())
app.use('/public', express.static('public'));
app.use('/',router)




mongoose.connection.once('open',()=>{
    console.log('Connected to MongoDB')
    app.listen(PORT, ()=>{ console.log(`Server running on port ${PORT}`)})
})



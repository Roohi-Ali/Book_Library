const Member = require('../model/Member.js');
const Book = require('../model/Book.js');
const mongoose = require('mongoose');
const fs = require('fs');

// const multer = require('multer');
// const upload = multer({dest:'uploads/'});

const contr = require('./controller.js');

let loggedInUser = contr.loggedInUser


const addBookpage = (req,res)=>{
    res.render('../views/addBookView')
}
const addOneBook = async (req, res) => {

    const a_book = new Book({ bname: req.body.bname, author: req.body.author });
    await a_book.save();
    console.log(a_book)
    res.send('Book added')
}


const removeOneBook = async (req, res) => {
    await Book.deleteOne({ bname: req.body.bname});
    console.log(req.body.name + "book deleted")
    res.send('Book deleted')
}

const fileupload = async(req,res)=>{
try {
    const file = req.file
    // console.log(req.file)
    let count=0;
    const rawData = fs.readFileSync(req.file.path,'utf8')
    const booksData = JSON.parse(rawData)
    for (const rec of booksData) {
        // const a_book = new Book({ bname: rec.bname, author: rec.author, available: rec.available });
        // await a_book.save();
        await Book.create(rec)
        count++;
    }
    console.log('Data inserted successfully')
    res.send(count + ' records inserted successfully')
} catch(err){
    console.error('Error inserting data:', err)
}
}

module.exports = {  addBookpage, addOneBook, removeOneBook,fileupload}
const Member = require('../model/Member.js');
const Book = require('../model/Book.js')
const mongoose = require('mongoose');

let loggedInUser;
const mainView = (req, res) => {
    res.render('../views/main.ejs')
}

// const enterDet = (req,res)=>{
//     res.render('../views/user')
// }

const userView = (req, res) => {
    res.render('../views/user')
}

const registerUser = async (req, res) => {
    const { name, pwd } = req.body;
    if (!name || !pwd) return res.status(400).json({ 'message': 'username and password are required' })

    //check for duplicate usernames in the db
    // const duplicate = await Member.findOne({name: name}).exec();
    // if (duplicate) return res.sendStatus(409) //Conflict

    //get last member

    try {
        const last_mem = await Member.findOne().sort({ m_id: -1 })
        let count;
        if (last_mem) {
            count = last_mem.m_id;
            console.log(count)
            count++;
        }
        else count = 1
        // console.log(last_mem)
        const newMember = await Member.create({
            'm_id': count,
            'name': name,
            'password': pwd
        })
        loggedInUser = result
        console.log(loggedInUser)

        res.render('../views/bookForm', { mem: loggedInUser.name })
        // res.status(201).json({'success':`New USer ${result} created`})
    }

    catch (err) {
        res.status(500).json({ 'message': err.message })
    }
    // const data = {
    //     name: req.body.name,
    //     password: req.body.psw
    // }
    // const a_mem = new Member(data);
    // await a_mem.save();
    // console.log(a_mem)

}


const loginUser = async (req, res) => {
    try {
        const member = await (await Member.find({ name: req.body.name })).map((elem) => {
            if (elem.password == req.body.pwd) {
                loggedInUser = elem
                // console.log(loggedInUser)
                res.render('../views/bookForm', { mem: loggedInUser.name })
            }
            else {
                console.log('name and password do not match')
                res.send("name and password do not match")
            }
        })
    }
    catch (err) {
        console.log(err)
    }

}

const lookUpBookList = async (req, res) => {
    try {
        
        const result = await Book.find({available:true}).exec()
        // console.log(result)
        let arr_books = []
        const addBookToArray = result.map((elem) => {
            let bname = elem.bname
            let author = elem.author
            let id = elem.id
            let b_id = elem.b_id
            arr_books.push({ bname, author, id, b_id })
        })
        return (arr_books)
        // res.render('../views/booklist', { records: arr_books })
    } catch (err) {
        console.log(err.message)
    }
}

const bookForm = (req, res) => {
    res.render('../views/bookForm')
}

const borrowBook = async (req, res) => {
    let arr_books = await lookUpBookList()
    res.render('../views/booklist', { records: arr_books })
}
const returnBook = (req, res) => {
    res.render('../views/chkStatus')
}
const chkStatus = async (req, res) => {
    let doc = await Member.findById( {_id : loggedInUser._id})
    .populate("borrowedBooks")

    console.log( doc )
    res.send(doc)
    //res.render('../views/chkStatus', { doc })
}

const addBook = async (req, res) => {

    const data = {
        bname: req.body.bname,
        author: req.body.author
    }
    const a_book = new Book({ bname: req.body.bname, author: req.body.author });
    await a_book.save();
    console.log(a_book)
    res.render('../views/booklist')
}


const showBookList = async (req, res) => {
    let arr_books = await lookUpBookList()
    res.render('../views/booklist', { records: arr_books })
}

const borrow = async (req, res) => {
    //console.log(req.body)

}

async function queryCheckOut(arr_id) {
    if (Array.isArray(arr_id)) {
        console.log("entered 1 if")
        const query = await Book.find({ _id: { $in: arr_id } })
        return query
    }
    else {
        console.log("entered 2 else")
        console.log(arr_id)
        const query = await Book.find({ _id: arr_id })
        console.log(query)
        return query
    }
}
const checkOut = async (req, res) => {
    try {
        //Allowing member to borrow only 5 books at a time
        if (loggedInUser.borrowedBooks.length < 5) {
            let arr_id = req.body.bookid
            const query = await queryCheckOut(arr_id)

            let doc = await Member.findById({ _id: loggedInUser._id })
            Array.isArray(arr_id) ? doc.borrowedBooks.push(...arr_id) : doc.borrowedBooks.push(arr_id)
            
            await doc.save()
            console.log("Doc" + doc)

            // Instead of deleting borrowed books from library, i will set the Available flag to false
            // //delete the borrowed books from Library
            // await Book.deleteMany({
            //     _id: {
            //         $in: arr_id
            //     }
            // })
            if (Array.isArray(arr_id)) {
                await Book.updateMany({ _id: { $in: arr_id } }, { $set: { available: false } })
            } else {
                await Book.updateOne({ _id: arr_id }, { $set: { available: false } })
            }
            res.render('../views/borrow', { query: query })
        }
        else{
            res.render('../views/chkStatus',{message:"You are not allowed to borrow more than 5 books"})
        }
    }
    catch (err) { console.log(err.message) }

}

// const showBookList = async (req,res)=>{
//     try{
//         const result = await Book.find()
//         console.log(result)
//         let arr_books=[]
//         const addBookToArray = result.map((elem)=>{
//             let bname = elem.bname
//             let author = elem.author
//             arr_books.push({bname,author})
//         })
//         console.log(arr_books)
//         // res.send(result)
//         res.render('../views/booklist', { records: arr_books })
//     }catch(err){
//         console.log(err.message)
//     }

// }


module.exports = { borrow, mainView, userView, registerUser, loginUser, bookForm, addBook, showBookList, borrowBook, returnBook, chkStatus, checkOut }
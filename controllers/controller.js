const Member = require('../model/Member.js');
const Book = require('../model/Book.js')
const mongoose = require('mongoose');

let loggedInUser;


const mainView = (req, res) => {
    res.render('../views/main.ejs',{message:" "})
}



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
        console.log("in try block line43")
        loggedInUser = newMember
        console.log("in try block line45")
        console.log(loggedInUser)

        res.render('../views/bookForm', { mem: loggedInUser.name })
        // res.status(201).json({'success':`New USer ${result} created`})
    }

    catch (err) {
        console.log("Some error")
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

const returnDash = async (req, res) => {
    res.render('../views/bookForm', { mem: loggedInUser.name })
}

const loginUser = async (req, res) => {
    try {
        if (await req.body.name=='admin'){
           if (req.body.pwd == '0000'){
            console.log('Admin Verified')
            loggedInUser = {name:req.body.name, password:req.body.pwd}
            res.render('../views/adminDashBoard', { username: loggedInUser.name })
           }
            else {
            console.log('Incorrect pasword')
            res.render('../views/main.ejs',{message:'Incorrect Password'})
            }
        }

        
        else if (await Member.exists({ name: req.body.name })) {
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
        else { 
            res.send("Member does not exist") 
        }
    } 
    catch (err) {
        console.log(err)
    }

}

const lookUpBookList = async (req, res) => {
    try {

        const result = await Book.find({ available: true }).exec()
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
const returnBook = async (req, res) => {
    try{
    let m_id = loggedInUser._id
    let arr_id = req.body.bookid
    if (Array.isArray(arr_id) ){
        const updatedMember = await Member.findByIdAndUpdate(m_id,
            {$pull:{ borrowedBooks: {$in:arr_id}}},
            {new: true} )
            await Book.updateMany( {id: {$in :arr_id}}, { $set: {available: true}})
            console.log('Books returned successfully')
    } 
    else{
        const updatedMember = await Member.findByIdAndUpdate(m_id,
            {$pull:{ borrowedBooks:arr_id}},
            {new: true} )
            await Book.updateMany( {id:arr_id}, { $set: {available: true}})
            console.log('Book returned successfully')
    }
    
    let doc = await sendStatus()
    res.render('../views/chkStatus', {name : doc.name, count_bb:doc.borrowedBooks.length, records:doc.borrowedBooks})
    }
    catch(err){
        console.error('Error returning books', error)
    }
}

async function sendStatus (){
    let doc = await Member.findById({ _id: loggedInUser._id })
        .populate("borrowedBooks")
    return doc 
}
const chkStatus = async (req, res) => {
    let doc = await sendStatus()
    // let doc = await Member.findById({ _id: loggedInUser._id })
    //     .populate("borrowedBooks")
    res.render('../views/chkStatus', {name : doc.name, count_bb:doc.borrowedBooks.length, records:doc.borrowedBooks})
}




const showBookList = async (req, res) => {
    let arr_books = await lookUpBookList()
    res.render('../views/booklist', { records: arr_books })
}

async function query_findBooksById(arr_id) {
    if (Array.isArray(arr_id)) {
        const query = await Book.find({ _id: { $in: arr_id } })
        return query
    }
    else {
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
            const query = await query_findBooksById(arr_id)

            let doc = await Member.findById({ _id: loggedInUser._id })
            Array.isArray(arr_id) ? doc.borrowedBooks.push(...arr_id) : doc.borrowedBooks.push(arr_id)

            await doc.save()
            console.log("Doc" + doc)

            // Instead of deleting borrowed books from library, i will set the Available flag to false
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
        else {
            res.render('../views/chkStatus', { message: "You are not allowed to borrow more than 5 books" })
        }
    }
    catch (err) { console.log(err.message) }

}

const logOut = async (req, res) => {
    loggedInUser = null
    res.render('../views/main', {message: " "})
}
module.exports = {  loggedInUser,logOut,mainView, userView, registerUser, loginUser, bookForm, showBookList, borrowBook, returnBook, chkStatus, checkOut,returnDash }
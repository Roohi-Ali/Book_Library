const Member = require('../model/Member.js');
const Book = require('../model/Book.js')
const mongoose = require('mongoose');

const mainView = (req,res)=>{
    res.render('../views/main.ejs')
}

// const enterDet = (req,res)=>{
//     res.render('../views/user')
// }

const userView = (req,res)=>{
    res.render('../views/user')
}

const registerUser = async (req,res)=>{
    const {name, pwd} = req.body;
    console.log( name, pwd)
    if ( !name || !pwd) return res.status(400).json({'message':'username and password are required'})
    
    //check for duplicate usernames in the db
    // const duplicate = await Member.findOne({name: name}).exec();
    // if (duplicate) return res.sendStatus(409) //Conflict

    //get last member

    try{
        const last_mem = await Member.findOne().sort({m_id:-1})
        let count;
        if (last_mem) {
            count = last_mem.m_id;
            console.log(count)
            count++;
        }
        else count = 1
        // console.log(last_mem)
        const result = await Member.create({
            'm_id': count,
            'name' : name,
            'password' :pwd
        })
        console.log(result)
        res.render('../views/bookForm', { mem : req.body.name})
        // res.status(201).json({'success':`New USer ${result} created`})
    }
    
    catch( err) {
        res.status(500).json({'message': err.message})
    }
    // const data = {
    //     name: req.body.name,
    //     password: req.body.psw
    // }
    // const a_mem = new Member(data);
    // await a_mem.save();
    // console.log(a_mem)

}


const loginUser = async (req,res)=>{
    console.log(req.body.name)
    res.render('../views/bookForm', { mem : req.body.name})
}

const lookUpBookList = async (req,res)=>{
    try{
        const result = await Book.find()
        // console.log(result)
        let arr_books=[]
        const addBookToArray = result.map((elem)=>{
            let bname = elem.bname
            let author = elem.author
            arr_books.push({bname,author})
        })
        return (arr_books)
        // res.render('../views/booklist', { records: arr_books })
    }catch(err){
        console.log(err.message)
    }
}

const bookForm = (req,res)=>{
    res.render('../views/bookForm')
}

const borrowBook = async(req,res)=>{
    console.log("lets check")
    let arr_books = await lookUpBookList()
    console.log(arr_books)
    res.render('../views/booklist', { records: arr_books })
}
const returnBook = (req,res)=>{
    res.render('../views/chkStatus')
}
const chkStatus = (req,res)=>{

    res.render('../views/chkStatus')
}

const addBook = async (req,res)=>{

    const data = {
        bname: req.body.bname,
        author: req.body.author
    }
    const a_book = new Book({bname:req.body.bname, author:req.body.author});
    await a_book.save();
    console.log(a_book)
    res.render('../views/booklist')
}


const showBookList = async (req,res)=>{
    let arr_books = await lookUpBookList()
    res.render('../views/booklist', { records: arr_books })
}

const checkOut = async (req,res)=>{
    res.send("Here we have to Check out books")
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


module.exports = {mainView,userView,registerUser,loginUser,bookForm,addBook,showBookList,borrowBook,returnBook,chkStatus,checkOut }
const express = require('express');
const router = express.Router();
const path = require('path')
const funcs = require('../controllers/controller.js')

router.get('/',funcs.mainView)

// router.post('/enterDet',funcs.enterDet)

// router.get('/user',funcs.userView)

router.post('/register',funcs.registerUser)

router.post('/login',funcs.loginUser)

router.get('/bookForm',funcs.bookForm)

router.post('/borrowBook',funcs.borrowBook)
router.post('/checkOut',funcs.checkOut)

router.post('/returnBook',funcs.returnBook)
router.post('/chkStatus',funcs.chkStatus)
router.post('/borrow',funcs.borrow)

router.post('/bookForm',funcs.addBook)

router.post('/booklist',funcs.showBookList)

module.exports = router;


// router.post('/register',async (req,res)=>{
//     const data = {
//         name: req.body.name,
//         password: req.body.psw
//     }
//     const a_mem = new Member({name:req.body.name, password:req.body.psw});
//     await a_mem.save();
//     console.log(a_mem)
//     res.render('bookForm', { mem : req.body.name})
//     //user.insertOne({name:data.name,password:data.password})
// })
const express = require('express');
const router = express.Router();
const multer = require('multer');
const upload = multer({dest:'uploads/'});
const path = require('path')
const funcs = require('../controllers/controller.js')
const adminFuncs = require('../controllers/adminController.js')

router.get('/',funcs.mainView)
router.post('/logOut',funcs.logOut)
router.post('/register',funcs.registerUser)
router.post('/login',funcs.loginUser)
router.post('/returnDash',funcs.returnDash)
router.get('/bookForm',funcs.bookForm)
router.post('/borrowBook',funcs.borrowBook)
router.post('/checkOut',funcs.checkOut)
router.post('/returnBook',funcs.returnBook)
router.post('/chkStatus',funcs.chkStatus)
// router.post('/bookForm',funcs.addBook)
router.post('/booklist',funcs.showBookList)


//Admin Routes
router.post('/addBookpage',adminFuncs.addBookpage)
router.post('/addOneBook',adminFuncs.addOneBook)
router.post('/fileupload',upload.single('filename'),adminFuncs.fileupload)


router.post('/removeOneBook',adminFuncs.removeOneBook)

module.exports = router;
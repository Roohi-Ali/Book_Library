const mongoose = require('mongoose');

const bookSchema = new mongoose.Schema({
    bname: {
      type: String,
      required: true
    }, 
      author: {
        type: String,
        required: true
      },
      available:{
        type: Boolean,
        default:true
      }
  });

module.exports = mongoose.model('Book',bookSchema)
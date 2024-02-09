const mongoose = require('mongoose');

const bookSchema = new mongoose.Schema({
    b_id: Number,
    bname: {
      type: String,
      required: true
    }, 
      author: {
        type: String,
        required: true
      }
  });

module.exports = mongoose.model('Book',bookSchema)
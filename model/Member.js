const mongoose = require('mongoose');
const { Schema } = mongoose;

const memberSchema = new Schema({
      m_id: {
            type: Number,
            default: 1

      },
      name: {
            type: String,
            required: true
          }, 
      password: {
            type: String,
            required: true
          },
      borrowedBooks: [{
            type: Schema.Types.ObjectId, ref: 'book',
      }]
})

module.exports = mongoose.model('Member',memberSchema)
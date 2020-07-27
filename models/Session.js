const mongoose = require('mongoose')
const {v4: uuidv4} = require('uuid')

sessionSchema = mongoose.Schema({
    //sid: mongoose.Types.ObjectId,
    sid: String,
    username: String
})

module.exports = mongoose.model('Session',sessionSchema)
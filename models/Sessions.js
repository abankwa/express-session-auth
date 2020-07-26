const mongoose = require('mongoose')

sessionSchema = mongoose.Schema({
    sid: mongoose.Types.ObjectId,
    user: String
})

module.exports = mongoose.model('Session',sessionSchema)
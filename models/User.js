const mongoose = require('mongoose')
const bcrypt = require('bcrypt')

userSchema = mongoose.Schema({
    username: String,
    password: String
})

userSchema.methods.isPasswordValid = function(password){
    return bcrypt.compareSync(password,this.password)
}

userSchema.methods.generateHash = function(password){
    return bcrypt.hashSync(password,bcrypt.genSaltSync(8))
}

module.exports = mongoose.model('User', userSchema)

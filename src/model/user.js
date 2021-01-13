const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

const userSchema = new mongoose.Schema({
    name : {
        type : String,
        trim : true
    },
    surname : {
        type : String,
        trim : true
    },
    email : {
        type : String,
        required : true,
        unique : true
    },
    password : {
        type : String,
        required : true
    },
    degree : {
        type : String,
         trim : true
    },
    department : {
        type : String,
         trim : true
    },
    symptoms:{
        type : Array,
        trim : true
    },
    ex : {
        type : Number,
         trim : true
    },
    add : {
        type : String,
         trim : true
    },
    city : {
        type : String,
        trim : true
    },
    role : {
        type : String,
        default : 'patient',
        trim : true
    },
    verify : {
        type : String,
        default : 'Not approved',
        trim : true
    },
    imagepath:{
        type:String,
        default:'data:image/jpeg;base64,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',
        trim:true
    },

    h1 : {
        type : String,
        trim : true
    },
    h2 : {
        type : String,
        trim : true
    },
    mobile :{
        type : String,
        trim : true
    },
    reg :{
        type : String,
        trim : true
    },
    gender :{
        type : String,
        trim : true
    },
    image : Buffer,
    token : String
})

userSchema.methods.toJSON = function() {
    const user = this
    const userObject = user.toObject()

    delete userObject.password
    
    return userObject
}

userSchema.methods.generateAuthToken = async function() {
    const user = this
    const token = await jwt.sign({_id : user._id.toString()}, 'verySecret')
    user.token = token
    await user.save()
}

userSchema.statics.findByCredentials = async (email, password) => {
    const user = await User.findOne({email})
    if(!user) {
        throw 'invalid email and password'
    }
    const isMatched = await bcrypt.compare(password, user.password)
    if(!isMatched) {
        throw 'invalid email and password'
    }
    return user
}

userSchema.pre('save', async function(next) {
    const user = this
    if(user.isModified('password')){
        user.password = await bcrypt.hash(user.password, 8)
    }
    next()
})

const User = mongoose.model('User', userSchema)

module.exports = User
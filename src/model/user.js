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
        default:'../assets/gen.jpg',
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
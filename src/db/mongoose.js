const mongoose = require('mongoose')

mongoose.connect('mongodb+srv://admin:admin@cluster0.8ogki.mongodb.net/appoitment' , {
    useNewUrlParser : true,
    useCreateIndex : true,
    useUnifiedTopology: true,
})
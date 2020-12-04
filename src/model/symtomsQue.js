const mongoose = require('mongoose')

const symptomsSchema = new mongoose.Schema({
    title : String,
    questions : []
})

module.exports = mongoose.model('SymptomsQuestions', symptomsSchema)
require('../db/mongoose')
const fs = require('fs')
const data = JSON.parse(fs.readFileSync('./data.json', 'utf-8'))
const SymptomsQuestions = require('../model/symtomsQue')

const importData = async () => {
    await SymptomsQuestions.create(data)
    console.log('created')
}
const deleteData = async () => {
    await SymptomsQuestions.deleteMany()
    console.log('deleted')
}
if(process.argv[2] == '--import') importData()
if(process.argv[2] == '--delete') deleteData()

//  node .\importData.js --delete
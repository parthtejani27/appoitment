const mongoose = require('mongoose')

const appointmentSchema = new mongoose.Schema({
    time : {
        type: String,
        trim : true,
        required : true
    },
    patient : {
        type : mongoose.Schema.Types.ObjectId,
        ref : 'User',
        required : true
    },
    patient_name : String,
    doctor_name : String,
    doctor : {
        type : mongoose.Schema.Types.ObjectId,
        ref : 'User',
        required : true
    },
    status : {
        type: String,
        default : 'pending',
    }
})


const Appointment = mongoose.model('Appointment', appointmentSchema)

module.exports = Appointment
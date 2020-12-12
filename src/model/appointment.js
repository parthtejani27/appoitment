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
    },
    a1 : {
        type : String,
        trim : true
    },
    a2 : {
        type : String,
        trim : true
    },
    a3 : {
        type : String,
        trim : true
    },
    a4 : {
        type : String,
        trim : true
    },
    a5 : {
        type : String,
        trim : true
    },
    a6 : {
        type : String,
        trim : true
    },
    a7 : {
        type : String,
        trim : true
    },
    a8 : {
        type : String,
        trim : true
    },
    a9 : {
        type : String,
        trim : true
    },
    a10 : {
        type : String,
        trim : true
    },
    a11 : {
        type : String,
        trim : true
    },
    a12 : {
        type : String,
        trim : true
    },
    a13 : {
        type : String,
        trim : true
    },
    a14 : {
        type : String,
        trim : true
    },
    a15 : {
        type : String,
        trim : true
    },
    a16 : {
        type : String,
        trim : true
    },
    a17 : {
        type : String,
        trim : true
    }
})


const Appointment = mongoose.model('Appointment', appointmentSchema)

module.exports = Appointment
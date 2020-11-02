const express = require('express')
require('./db/mongoose')

const User = require('./model/user')
const Appointment = require('./model/appointment')
const auth = require('./middleware/auth')
const app = express()
app.use(express.json())

app.get('/', (req, res) => {
    res.send('Wlcome to our app!')
})

app.post('/signup', async (req, res) => {
    const email = req.body.email
    const password = req.body.password
    const name = req.body.name
  
    const user = new User({
        name,
        email,
        password
    })
    try {
        await user.save()
        await user.generateAuthToken()

        return res.send({user})
    }catch(e) {
         return res.send()
    }
})

app.post('/signupdoc', async (req, res) => {
    const email = req.body.email
    const password = req.body.password
    const name = req.body.name
    const degree = req.body.degree
    const ex = req.body.ex
    const add = req.body.add
    const city = req.body.city
    const role = req.body.role
    const h1 = req.body.h1
    const h2 = req.body.h2

    const user = new User({
        name,
        email,
        password,degree,ex,add,city,role,h1,h2
    })
    try {
        await user.save()
        await  user.generateAuthToken()
        return res.send({user})
    }catch(e) {
         return res.send()
    }
})

app.post('/signin', async (req, res) => {
    // aaya pan aave 6eha
    const email = req.body.email
    const password = req.body.password
    
    try{
        const user = await User.findByCredentials(email,password)
        await user.generateAuthToken()
        return res.send({user})
    }catch(e) {
        return res.send({"error" : e})
    }
})

app.get('/get_doctors', auth, async (req, res) => {
    const doctors = await User.find({
        role : 'doctor'
    })
    .select('name degree _id ex') 

    if(!doctors) {
        return res.send({
            error : 'No doctors found!'
        })
    }

    res.send({
        doctors
    })
    
})

app.post('/book_appoitment',auth,  async (req, res) => {
    try {
        
        const appoitment = new Appointment({
            time: req.body.time,
            patient : req.body.p_id,
            doctor : req.body.d_id,
            doctor_name : req.body.doctor_name,
            patient_name : req.body.patient_name
        })
        if(!appoitment){
            return res.send({
                err : "something went wrong"
            })
        }
        await appoitment.save()
        res.send({
            success : "appoitment sended successfully! "
        })
    }catch(err) {
        return res.send({
            err : "something went wrong"
        })
    } 
})

app.get('/get_user_appoitments', async(req, res) => {
   // console.log(req.query)
    const appoitments = await Appointment.find({
        patient : req.query._id,
        status : req.query.status
    }).select('_id doctor doctor_name time status')
   
    res.send({
        appoitments
    })
})

app.get('/get_doctor_appoitments', async(req, res) => {
    //console.log(req.query)
    const appoitments = await Appointment.find({
        doctor : req.query._id,
        status : req.query.status
    }).select('_id patient patient_name time status')

    res.send({
        appoitments
    })
})
app.post('/confirm_appointment',async(req,res) =>{
        const _id = req.body._id
        const status = 'confirmed'
    try{
        const appointment = await Appointment.findById(_id)
        appointment.status=status
        await appointment.save()
        res.send({
            success:'status confirmed'
        })
    }catch(e)
    {
        console.log(e)
    }
})
app.post('/cancel_appointment',async(req,res) =>{
    const _id = req.body._id
    const status = 'Cancelled'
try{
    const appointment = await Appointment.findById(_id)
    appointment.status=status
    await appointment.save()
    res.send({
        success:'status cancelled'
    })
}catch(e)
{
    console.log(e)
}
})

app.get('/search_doctor_by_name', auth, async (req, res) => {
    
    const doctors = await User.find({
        name : req.query.name,
        role : 'doctor'
    }).select('_id name degree ex')

    if(!doctors) {
        return res.send({
            error : 'No doctors found!'
        })
    }


    res.send({
        doctors 
    })
})
app.get('/getDocdetails', auth, async (req, res) => {
   
    const doctor = await User.findOne({
        _id : req.query._id,
        role : 'doctor'
    }).select('_id name degree ex add city h1 h2')

    if(!doctor) {
        return res.send({
            error : 'No doctor found!'
        })
    }

    res.send({
        doctor
    })
})

app.post('/logout', auth, async (req, res) => {
    try {
        req.user.tokens = req.user.tokens.filter(token => token.token !== req.token)
        await req.user.save()

        res.send()
    }catch(e){
        res.status(500).send()
    }
})



app.listen(3000, () => {
    console.log('Api running on port 3000')
})
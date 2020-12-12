const express = require('express')
require('./db/mongoose')
const PORT = process.env.PORT || 3000
const User = require('./model/user')
const Appointment = require('./model/appointment')
const SymptomsQuestions = require('./model/symtomsQue')
const auth = require('./middleware/auth')
const app = express()
app.use(express.json())

const sharp = require('sharp')

app.get('/', (req, res) => {
    res.send('Welcome to our app!')
})

app.get('/getans', async(req, res) => {
    //console.log(req.query)
    const appoitment = await Appointment.findOne({
        _id : req.query._id,
    }).select('_id a1 a2 a3 a4 a5 a6 a7 a8 a9 a10 a11 a12 a13 a14 a15 a16 a17')

    res.send({
        appoitment
    })
})

app.patch('/submitque',auth, async (req, res) => {
    const a_id = req.body.a_id;
    const a1 = req.body.a1
    const a2 =req.body.a2
    const a3 =req.body.a3
    const a4 =req.body.a4
    const a5 =req.body.a5
    const a6 =req.body.a6
    const a7 =req.body.a7
    const a8 =req.body.a8
    const a9 =req.body.a9
    const a10 = req.body.a10
    const a11 = req.body.a11
    const a12 = req.body.a12
    const a13 = req.body.a13
    const a14 = req.body.a14
    const a15 = req.body.a15
    const a16 = req.body.a16
    const a17 = req.body.a17
    

    const appoitment = await Appointment.findByIdAndUpdate(a_id, {
        a1,a2,a3,a4,a5,a6,a7,a8,a9,a10,a11,a12,a13,a14,a15,a16,a17
    }, {
        new : true
    })
    //console.log(appoitment)
    res.send({
        appoitment  
    })
})




const multer = require('multer')
const { find, findById, findByIdAndUpdate } = require('./model/user')

const upload = multer({
    limits:{
        filesize :1000000
    },
    fileFilter(req, file, cb){
        if(!file.originalname.match(/\.(jpg|png|jpeg)$/)){
            return cb(new Error('please upload image file only'))
        }
        cb(undefined,true)
    }
})

app.post('/uploadimage' , upload.single('image'), async (req,res)=>{
    console.log('aa',req.body)
    const buffer = await sharp(req.body.image).resize({width:300,height:300}).png().toBuffer()
    
    req.user.image = buffer
    await req.user.save()
    res.send()
},(error,req,res,next)=>{
    res.status(400).send({error: 'please upload image file only'})
})
app.post('/signupdoc', async (req, res) => {
    const email = req.body.email
    const password = req.body.password
    const name = req.body.name
    const degree = req.body.degree
    const department = req.body.department
    const symptoms = req.body.symptoms
    const ex = req.body.ex
    const add = req.body.add
    const city = req.body.city
    const role = req.body.role
    const h1 = req.body.h1
    const h2 = req.body.h2
   const mobile = req.body.mobile
   const reg = req.body.reg
  // console.log(req.file)

    const user = new User({
        name,
        email,
        password,degree,department,ex,add,city,role,h1,h2,symptoms,mobile,reg
    })
    try {
        await user.save()
        await  user.generateAuthToken()
        return res.send({user})
    }catch(e) {
         return res.send()
    }
})

app.get('/getphoto',async (req,res)=>{
    try{
        const user = await User.findById(req.params.id)
        if(!user || !user.avatar){
            throw new Error()
        }
        res.set('Content-Type','image/png')
        res.send(user.avatar)
    }catch(e){
        res.status(400).send()
    }
})


app.post('/signup', async (req, res) => {
    const email = req.body.email
    const password = req.body.password
    const name = req.body.name
    const gender = req.body.gender
    const city = req.body.city
    const mobile = req.body.mobile
  
    const user = new User({
        name,
        email,
        password,
        city,
        gender,
        mobile
    })
    try {
        await user.save()
        await user.generateAuthToken()

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
        verify:'approved',
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

app.get('/notapproved_doctors', auth, async (req, res) => {
    const doctors = await User.find({
        verify:'Not approved',
        role : 'doctor'
    })
    .select('name degree _id ex reg') 

    if(!doctors) {
        return res.send({
            error : 'No doctors found!'
        })
    }

    res.send({
        doctors
    })
    
})

app.get('/department', auth, async (req, res) => {
    const doctors = await User.find({
        department : req.query.dep,
        city : req.query.city,
        verify:'approved',
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
        return res.send({appoitment})
        // res.send({
        //     success : "appoitment sended successfully! "
        // })
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
        symptoms : req.query.name,
        city : req.query.city,
        verify:'approved',
        // city : req.query.city,
        role : 'doctor'
    }).select('_id name degree ex')
    //console.log(doctors, req.query.name)
    if(!doctors) {
        return res.send({
            error : 'No doctors found!'
        })
    }


    res.send({
        doctors 
    })
})

app.get('/search_doctor_by_name1', auth, async (req, res) => {
    
    const doctors = await User.find({
        name : req.query.name,
        city : req.query.city,
        verify:'approved',
        // city : req.query.city,
        role : 'doctor'
    }).select('_id name degree ex')
    //console.log(doctors, req.query.name)
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
    }).select('_id name degree department ex add city h1 h2')

    if(!doctor) {
        return res.send({
            error : 'No doctor found!'
        })
    }

    res.send({
        doctor
    })
})

app.get('/getQue',auth,  async (req, res) => {
    try {
        
        const data = await SymptomsQuestions.find({title : req.query.title})
        
        res.json({
            data
        })
    }catch(e) {
        res.status(500).send()
    }
})
app.post('/approve_doc',async(req,res) =>{
    const _id = req.body._id
    const verify = 'approved'
try{
    const user = await User.findById(_id)
    user.verify=verify
    await user.save()
    res.send({
        success:'doctor verified'
    })
}catch(e)
{
    console.log(e)
}
})

app.post('/delete_doc',async(req,res) =>{
    const _id = req.body._id
    const verify = 'reject'
try{
    const user = await User.findById(_id)
    user.verify=verify
    await user.save()
    res.send({
        success:'doctor rejected'
    })
}catch(e)
{
    console.log(e)
}
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



app.listen(PORT, () => {
    console.log('Api running on port '+PORT)
})
// aana lidhe notu haltu bc kyarnu
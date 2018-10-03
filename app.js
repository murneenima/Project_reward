const express = require('express')
const mongoose = require('mongoose')
const bodyParser = require('body-parser')

var Schema = mongoose.Schema
var StudentSchema = new Schema({
    name :{
        type:String,
        required: true
    },
    surname:{
        type:String,
        required:true
    },
    studentID:{
        type:String,
        unique:true,
        required:true,
    },
    password:{
        type:String,
        required:true,
        minlength:6
    },
    house:{
        type:String,
        required:true
    }  
})

var Student = mongoose.model('Student',StudentSchema)

mongoose.connect('mongodb://localhost:27017/StudentDB').then((doc)=>{
    console.log('success')
}, (err)=>{
    console.log('fail')
})

var app = express()

app.use(bodyParser.urlencoded({ // เข้ารหัส เพราะเวลา html ส่งข้อมูลมา มันจะเป็นรหัส ทำให้มันอ่านข้อมูลที่ส่งมาจาก form ได้
    extended:true
}));
app.use(bodyParser.json())

app.get('/',(req,res)=>{
    console.log('hello')
    res.send('hello')
})

app.post('/sign_up',(req,res)=>{
    console.log(JSON.stringify(req.body))
    //res.send(req.body)

  if(req.body.house== 'Choose...'){
     res.status(400).send('house doesnot choose');
           return
    }
    
    let house = ''
    if(req.body.house == 'Larry Page'){
        house = 'Larry Page'
    }else if(req.body.house == 'Mark Zuckerberg'){
        house = 'Mark Zuckerberg'
    }else if(req.body.house == 'Elon Musk'){
        house = 'Elon Musk'
    }else if(req.body.house == 'Bill Gates'){
        house = 'Bill Gates'
    }
    //console.log('house == ', req.body.house)

    let newStudent = new Student ({
        name: req.body.name,
        surname: req.body.surname,
        studentID: req.body.studentID,
        password: req.body.password,
        house: house
    })

    newStudent.save().then((doc)=>{
        res.send(doc)
    }, (err) => {
        res.status(400).send(err)
    })
    
})

/*app.get('/sign_in',(req,res)=>{
    
        let studentIDInput = req.headers['studentID']
        let passwordInput = req.headers['password']

         Student.find({
         studentID : studentIDInput,
       password : passwordInput
    }).then((student)=>{
        if(student.length == 1){ //เจอข้อมูล 1 คน 
            res.send(student[0]) // ที่เป็น 0 เพราะมันเจอที่ ตน ที่ 0 มันต้องมีแค่คนเดียว
        }else if(student.length == 0){
            res.status(400).send('sorry id not found')
        }
    },(err)=>{
        res.send(400).send(err)
    })
})
*/
app.listen(3000,()=>{
    console.log('listin port 3000') 
})
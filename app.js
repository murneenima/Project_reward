const express = require('express')
const mongoose = require('mongoose')
const bodyParser = require('body-parser')
const hbs = require('hbs')
mongoose.Promise = global.Promise; 

mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/StudentDB').then((doc)=>{
    console.log('-------success--------')
}, (err)=>{
    console.log('fail')
})

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

var TypeSchema = new Schema({
    typeactivity :{
        type:String,
        required: true
    },
    lastid:{
        type:Number,
        default : "0"

    }
})

var ActivitySchema = new Schema({
    id_activity:{
        type:Number,
        required:true
    },
    name_activity:{
        type:String,
        required:true,
        unique:true  
    },
    type_activity:{
        type:String,
        required:true
    },
    point:{
        type:Number,
        required:true
    },
    purpose:{
        type:String,
        required:true
    }

})

var OpenSchema = new Schema({
    name_open :{
        type:String,
        required:true
    }
})

var Student = mongoose.model('Student',StudentSchema) // สร้าง table
var TypeActivity = mongoose.model('TypeActivity',TypeSchema) // สร้าง mode/table activity
var Activity = mongoose.model('Activity',ActivitySchema) // สร้าง mode/table activity

var app = express()
app.use(function (req, res, next) {
    res.header('Access-Control-Allow-Origin', '*')
    res.header('Access-Control-Allow-Methods', 'GET, POST, PATCH, PUT, DELETE, OPTIONS');
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

app.use(express.static('public'))
app.set('view engine','hbs')
//app.use(express.static('public'))


app.use(bodyParser.urlencoded({ // เข้ารหัส เพราะเวลา html ส่งข้อมูลมา มันจะเป็นรหัส ทำให้มันอ่านข้อมูลที่ส่งมาจาก form ได้
    extended:true
}));
app.use(bodyParser.json())

app.get('/',(req,res)=>{
    console.log('hello')
    res.send('hello')
})

//================================== Member =================================

app.post('/sign_up',(req,res)=>{
    //console.log(JSON.stringify(req.body))
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

app.post('/sign_in',(req,res)=>{
    
        let studentIDInput = req.body.studentID
        let passwordInput = req.body.password

         Student.find({
         studentID : studentIDInput,
        password : passwordInput
    }).then((student)=>{
        if(student.length == 1){ //เจอข้อมูล 1 คน 
            res.send(student[0])// ที่เป็น 0 เพราะมันเจอที่ ตน ที่ 0 มันต้องมีแค่คนเดียว
            //  res.render('admin_success.hbs',{
            //     studentID:student[0].studentID,
            //     name:student[0].name,
            //     surname:student[0].surname,
            //     house:studentID[0].house
            // }) 
            console.log('login success')
        }else if(student.length == 0){
            res.status(400).send('sorry id not found')
        }
    },(err)=>{
        res.send(400).send(err)
    })
})

app.get('/find',(req,res)=>{
    Student.find({},(err,data)=>{
        if(err) console.log(err);
      //  console.log('Student.findOne | ',data);
    }).then((data)=>{
       // for(i=0 ; i<data.length; i++){
            res.render('admin_member.hbs',{
                data: encodeURI(JSON.stringify(data))
            })
        //}
        

    },(err)=>{
        res.status(400).render('fail.hbs')
    })
})

//================================== Type Activity==================================

app.post('/post_typeactivity',(req,res)=>{
    let newTypeaActivity = new TypeActivity ({
        typeactivity:req.body.typeactivity,
        lastid: req.body.lastid
    })
    newTypeaActivity.save().then((doc)=>{
        res.send(doc)
    },(err)=>{
        res.status(400).send(err)
    })
})

app.get('/Typeactivity',(req,res)=>{
    TypeActivity.find({},(err,dataTYpe)=>{
        if(err) console.log(err);
       // console.log(dataType)
    }).then((dataType)=>{
            res.render('admin_activity.hbs',{
                dataType: encodeURI(JSON.stringify(dataType))
            })
    },(err)=>{
        res.status(400).render('fail.hbs')
    })
})


//==================================Activity==================================

app.post('/post_activity',(req,res)=>{
    console.log('req.body is'+JSON.stringify(req.body))
   TypeActivity.find({
       typeactivity: req.body.type_activity 
   }).then((data)=>{
       console.log('data is '+data[0])
        let newActivity = new Activity({
            id_activity: data[0].lastid+1,
            name_activity: req.body.name_activity,
            type_activity:req.body.type_activity,
            point:req.body.point,
            purpose:req.body.purpose
        })
        newActivity.save().then((doc)=>{
            TypeActivity.findOne({typeactivity: req.body.type_activity}, function(err, data){            
                if(data){
                    data.lastid += 1
                    data.save(function(err) {
                        if (err) // do something
                        console.log('is fail to update lastID')
                        else 
                        console.log('is UPdated lastID')
                    });
                }else{
                    console.log(err);
                }
            });
            res.send(doc)
        },(err)=>{
            res.status(400).send(err)
        })

    },(err)=>{
        res.status(400).send(err)
    })
    
})


// ========================================= render ============================
app.get('/activity', (req, res) => {
    res.render('admin_activity.hbs')
})


app.listen(process.env.PORT || 3000,()=>{
    console.log('listin port 3000') 
})
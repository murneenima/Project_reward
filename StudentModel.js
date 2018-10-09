var mongoose = require('mongoose')
var StudentSchema = mongoose.Schema({
    name :{
        type:String,
        required: true
    },
    surname:{
        type:String,
        required:true // รับค่ามาตลอด
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
module.exports = Student ;
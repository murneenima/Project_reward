//connect

const express = require('express');
const hbs = require('hbs');

var app = express();

app.set('view engine','hbs');

var mongoose = require('mongoose')
mongoose.connect('mongodb://localhost:27017/StudentDB')
mongoose.Promise = global.Promise; 

//Schema
var Student = require('./StudentModel');

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

app.listen(3000,()=>{
    console.log('listin port 3000') 
})


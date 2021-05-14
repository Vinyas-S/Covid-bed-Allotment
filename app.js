var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var passport = require('passport');
var User= require('./models/user');
var LocalStrategy = require('passport-local');

mongoose.connect("mongodb://localhost/bbmp_app");
app.use(bodyParser.urlencoded({ extended: true }));
app.set("view engine", "ejs");
app.use(express.static('public'));


app.use(require("express-session")({
    secret:"Once again I win",
    resave:false,
    saveUninitialized:false
}));

 app.use(passport.initialize());
 app.use(passport.session());

 passport.use(new LocalStrategy(User.authenticate()));
 passport.serializeUser(User.serializeUser());
 passport.deserializeUser(User.deserializeUser());

 app.use(function(req, res, next) {
    res.locals.currentUser=req.user;
    next();
});

 var patientSchema=new mongoose.Schema({
     bu:String,
     name:String,
     age:String,
     address:String,
     pin:String,
     ward:String,
     symptoms:String,
     days:String,
     oxy:String,
     oxygen:String,
     search:String,
     test:String,
     result:String,
     phone:String,
     hos:String,
     names:String,
     bed:String

 });

 var Patient=mongoose.model('Patient',patientSchema);

app.get('/',function(req,res){
    res.render('bbmp');
});

app.get('/covid19',isLoggedIn, function(req, res){
    res.render('covid19');

});

app.get('/coviddisplay',function(req,res){
    Patient.find({},function(err,allpatients){
        if(err){
            console.log(err);
        }
        else{
            res.render("coviddisplay",{patients:allpatients,currentUser:req.user});
        }
    });
});

app.post('/coviddisplay',function(req,res){
    var bu=req.body.BU;
    var name=req.body.name;
    var  age=req.body.age;
    var address=req.body.address;
    var pin=req.body.pin;
    var ward=req.body.ward;
    var symptoms=req.body.symptoms;
    var days=req.body.days;
    var oxy=req.body.oxy;
    var oxygen=req.body.oxygen;
    var search=req.body.search;
    var test=req.body.test;
    var result=req.body.result;
    var phone=req.body.phone;
    var hos=req.body.hos;
    var names=req.body.names;
    var bed=req.body.bed;
    var newPatient={bu:bu,name:name,age:age,address:address,pin:pin,ward:ward,symptoms:symptoms,days:days,oxy:oxy,oxygen:oxygen,search:search,test:test,result:result,phone:phone,hos:hos,names:names,bed:bed}
    Patient.create(newPatient,function(err,newlyCreated){
        if(err){ 
            console.log(err);
        }
        else{
            console.log(newlyCreated);
            res.redirect("/coviddisplay");
        }
    })
});


app.get('/register', function(req, res){
    res.render('register');
});

app.post('/register', function(req, res){
    var newUser = new User({username:req.body.username});
    User.register(newUser,req.body.password,function(err,user){
        if(err){
            console.log(err);
            return res.render('register');
        }
        passport.authenticate("local")(req,res,function(){
            res.redirect("/")
        });
    });
});

app.get('/login',function(req,res){
    res.render('login');
});

app.post('/login',passport.authenticate('local',
     {
        successRedirect:"/covid19",
        failureRedirect:"/login"

    }), function(req,res){
            

});

app.get('/logout',function(req,res){
    req.logout();
    res.redirect('/');
});

function isLoggedIn(req, res,next){
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect("/login");
}

app.listen(3000,function(){
    console.log("Server has started");
});

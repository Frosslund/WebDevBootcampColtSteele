var express = require("express");
var app = express();

var animalsArray = {cow:"Moo", pig:"Oink", dog:"Woof"};

app.get("/", function(req, res){
   res.send("Hi there, welcome to my assignment!"); 
});

app.get("/speak/:animal", function(req,res){
    var animal = req.params.animal;
    res.send("The " + animal + " says: " + "'" + animalsArray[animal] + "!'"); 
});

app.get("/repeat/:word/:number", function(req,res){
    var word = req.params.word;
    var number = parseInt(req.params.number);
    var str = "";
    for(var i = 0; i < number; i++){
        str += word + " ";
    };
    res.send(str);    
});

app.get("/*", function(req, res){
   res.send("Sorry, page not found.. What are you doing with your life?"); 
});

app.listen(process.env.PORT, process.env.IP, function(){
    console.log("Server has started.");
});
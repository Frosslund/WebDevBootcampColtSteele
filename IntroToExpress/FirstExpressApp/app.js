var express = require("express");
var app = express();

// "/" --> "Hi there!"
app.get("/", function(req, res){
    res.send("Hi there!");
});

// "/bye" --> "Goodbye!"
app.get("/bye", function(req, res){
    res.send("Goodbye!");
});

app.get("/r/:subReddit", function(req, res){
    var subReddit = req.params.subReddit;
    res.send("Welcome to the " + subReddit +  " subreddit!"); 
});

app.get("/*", function(req, res){
   res.send("Hittar inte urlen faaaan"); 
});


// Tell express to listen for requests (starting server)
app.listen(process.env.PORT, process.env.IP, function(){
    console.log("Server has started.");
});
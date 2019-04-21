var express = require("express");
var app = express();

app.use(express.static("public"));
app.set("view engine", "ejs");

app.get("/", function(req, res){
    res.render("home");
});

app.get("/posts", function(req, res){
    var posts = [
        {post: "This is a post", author: "Gobblibob"},
        {post: "This is another post", author: "Ubblibubbli"},
        {post: "This is the last post", author: "Tjotablobly"}
        ];
    res.render("posts", {posts: posts});
});

app.get("/:word", function(req,res){
    var word = req.params.word;
    res.render("words", {wordVar:word});
});

app.listen(process.env.PORT, process.env.IP, function(){
    console.log("Server has started.");
});
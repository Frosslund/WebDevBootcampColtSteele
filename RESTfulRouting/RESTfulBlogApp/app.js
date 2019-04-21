var express = require("express"),
    app = express(),
    expressSanitizer = require("express-sanitizer"),
    bodyParser = require("body-parser"),
    methodOverride = require("method-override"),
    mongoose = require("mongoose");
    
  
// App config  
mongoose.connect("mongodb://localhost:27017/restful_blog_app", { useNewUrlParser: true });
app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended : true}));
app.use(methodOverride("_method"));
app.use(expressSanitizer());

// Mongoose/Model Congig.
var blogSchema = new mongoose.Schema({
   title: String,
   image: String,
   body: String,
   created: {type: Date, default: Date.now()}
});
var Blog = mongoose.model("Blog", blogSchema);

// RESTful routes

// INDEX Routes
app.get("/", function(req, res){
   res.redirect("/blogs"); 
});

app.get("/blogs", function(req, res){
    Blog.find({}, function(err, blogs){
       if(err) {
           console.log(err);
       } else {
           res.render("index", {blogs : blogs}); 
       }
    });
});

// NEW Route
app.get("/blogs/new", function(req, res){
   res.render("new"); 
});

// CREATE Route
app.post("/blogs", function(req, res){
   // create blog
   req.body.blog.body = req.sanitize(req.body.blog.body);
   Blog.create(req.body.blog, function(err, newBlog){
      if(err) {
          res.render("new");
      } else {
          // then redirect to the index
          res.redirect("/blogs");
      }
   });
});

// SHOW ROUTE
app.get("/blogs/:id", function(req, res){
   Blog.findById(req.params.id, function(err, foundBlog){
       if(err) {
           res.redirect("/blogs");
       } else {
            res.render("show", {blog: foundBlog});     
       }
   });
});

// EDIT Route
app.get("/blogs/:id/edit", function(req, res){
    Blog.findById(req.params.id, function(err, foundBlog){
        if(err) {
            res.redirect("/blogs");
        } else {
            res.render("edit", {blog: foundBlog});
        }
    });
});

// UPDATE Route
app.put("/blogs/:id", function(req, res){
    req.body.blog.body = req.sanitize(req.body.blog.body);
    Blog.findByIdAndUpdate(req.params.id, req.body.blog, function(err, updatedBlog){
        if(err) {
            res.redirect("/blogs");
        } else {
            res.redirect("/blogs/" + req.params.id);
        }
    });
});

// DELETE Route
app.delete("/blogs/:id", function(req, res){
   // destroy blog
   Blog.findByIdAndRemove(req.params.id, function(err) {
       if(err) {
           res.redirect("/blogs");
       } else {
           // redirect somewhere
           res.redirect("/blogs");
       }
   });
});

app.listen(process.env.PORT, process.env.IP, function(){
   console.log("The server has started."); 
});

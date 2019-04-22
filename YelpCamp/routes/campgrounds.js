var express = require("express");
var router = express.Router();
var Campground = require("../models/campground");

//INDEX - list of all campgrounds GET /campgrounds
router.get("/", function(req, res){
  // Get all the campgrounds from db
  Campground.find({}, function(err, allCampgrounds){
     if(err) {
        console.log(err);
     } else {
        res.render("campgrounds/index", {campgrounds: allCampgrounds});
     }
  }); 
});

//CREATE - add a new campground to DB POST /campgrounds
router.post("/", function(req, res){
  var name = req.body.name;
  var image = req.body.image;
  var desc = req.body.description;
  var newCampground = {name: name, image: image, description: desc};
  // Create a new campground and save to db
  Campground.create(newCampground, function(err, newlyCreated){
     if(err) {
        console.log(err);
     } else {
        res.redirect("/campgrounds");
     }
  });
});

//NEW - show form to create new campground GET /campgrounds/new
router.get("/new", function(req,res){
  res.render("campgrounds/new");
});

//SHOW - show info about one campground. GET /campgrounds/:id
router.get("/:id", function(req, res){
  // find the campground with provided id
  Campground.findById(req.params.id).populate("comments").exec(function(err, foundCampground){
     if(err){
        console.log(err);
     } else {
        console.log(foundCampground);
        // render show template with that campground
        res.render("campgrounds/show", {campground: foundCampground});
     }
  });
});

module.exports = router;
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
router.post("/", isLoggedIn, function(req, res){
  var name = req.body.name;
  var image = req.body.image;
  var desc = req.body.description;
  var author = {
     id: req.user._id,
     username: req.user.username
  }
  var newCampground = {name: name, image: image, description: desc, author: author};
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
router.get("/new", isLoggedIn, function(req,res){
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

//EDIT - 
router.get("/:id/edit", checkCampgroundOwnership,function(req, res) {
   Campground.findById(req.params.id, function(err, foundCampground) {
      if(err) {
         res.redirect("/campgrounds");
      } else {
         res.render("campgrounds/edit", {campground: foundCampground});
      }
   }); 
});

//UPDATE - 
router.put("/:id", checkCampgroundOwnership ,function(req, res) {
   // find and update the correct campground and redirect to show page
   Campground.findByIdAndUpdate(req.params.id, req.body.campground, function(err, updatedCampground) {
      if(err) {
         res.redirect("/campgrounds");
      } else {
         res.redirect("/campgrounds/" + req.params.id);
      }
   });
});

//DESTROY -
router.delete("/:id", checkCampgroundOwnership ,function(req, res) {
   Campground.findByIdAndRemove(req.params.id, function(err) {
      if(err) {
         res.redirect("/campgrounds");
      } else {
         res.redirect("/campgrounds");
      }
   });
});

//middleware
function isLoggedIn(req, res, next){
   if(req.isAuthenticated()) {
      return next();
   }
   res.redirect("/login");
}

function checkCampgroundOwnership(req, res, next) {
   // is user logged in
   if(req.isAuthenticated()) {
      Campground.findById(req.params.id, function(err, foundCampground) {
         if(err) {
            res.redirect("back");
         } else {
            // does user own the campground?
            if(foundCampground.author.id.equals(req.user._id)) {
               next();
            } else {
               res.redirect("back");
            } 
         }
      });
   } else {
      res.redirect("back");
   }
}

module.exports = router;
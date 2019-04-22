// ================================
// Comments Routes

app.get("/campgrounds/:id/comments/new", isLoggedIn, function(req, res) {
  // Find cg by id
  Campground.findById(req.params.id, function(err, campground) {
     if(err) {
        console.log(err);
     } else {
        res.render("comments/new", {campground : campground});   
     }
  });
});

app.post("/campgrounds/:id/comments", isLoggedIn, function(req ,res) {
  //look up campground using id
  Campground.findById(req.params.id, function(err, campground) {
     if(err) {
        console.log(err);
        res.redirect("/campgrounds");
     } else {
        // create new comment
        Comment.create(req.body.comment, function(err, comment) {
           if(err) {
              console.log(err);
           } else {
              //connect new comment to cg
              campground.comments.push(comment);
              campground.save();
              // redirect to show page
              res.redirect("/campgrounds/" + campground._id);
           }
        });
     }
  });
}); 

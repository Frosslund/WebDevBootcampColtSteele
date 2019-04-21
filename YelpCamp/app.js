var express       = require("express"),
    app           = express(),
    bodyParser    = require("body-parser"),
    mongoose      = require("mongoose"),
    Campground    = require("./models/campground"),
    Comment       = require("./models/comment"),
    passport      = require("passport"),
    LocalStrategy = require("passport-local"),
    User          = require("./models/user"),
    seedDB        = require("./seeds");

mongoose.connect("mongodb://localhost:27017/yelp_camp", { useNewUrlParser: true });
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({extended : true}));
app.use(express.static(__dirname + "/public"));
seedDB();

// Passport Configuration
app.use(require("express-session")({
   secret: "Darth Vader finds your lack of faith disturbing",
   resave: false,
   saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function(req, res, next) {
   res.locals.currentUser = req.user;
   next();
});

app.get("/", function(req, res){
   res.render("landing"); 
});

//INDEX - list of all campgrounds GET /campgrounds
app.get("/campgrounds", function(req, res){
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
app.post("/campgrounds", function(req, res){
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
app.get("/campgrounds/new", function(req,res){
   res.render("campgrounds/new");
});

//SHOW - show info about one campground. GET /campgrounds/:id
app.get("/campgrounds/:id", function(req, res){
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

// Auth Routes

// show register form
app.get("/register", function(req, res) {
   res.render("register");
});

// handle sign up logic
app.post("/register", function(req, res) {
   var newUser = new User({username: req.body.username});
   User.register(newUser, req.body.password, function(err, user) {
      if(err) {
         console.log(err);
         return res.render("register");
      }
      passport.authenticate("local")(req, res, function(){
         res.redirect("/campgrounds");
      });
   });
});

// show login form
app.get("/login", function(req, res) {
   res.render("login");
});

// handle login logic
app.post("/login", passport.authenticate("local", 
   {
      successRedirect: "/campgrounds",
      failureRedirect: "/login"
   }), function(req , res) {
   
});

// logout route
app.get("/logout", function(req, res) {
   req.logout();
   res.redirect("/campgrounds");
});

function isLoggedIn(req, res, next){
   if(req.isAuthenticated()) {
      return next();
   }
   res.redirect("/login");
}

app.listen(process.env.PORT, process.env.IP, function(){
   console.log("The YelpCamp server has started."); 
});
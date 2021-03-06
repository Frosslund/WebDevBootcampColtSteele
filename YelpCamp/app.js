var express          = require("express"),
    app              = express(),
    bodyParser       = require("body-parser"),
    mongoose         = require("mongoose"),
    Campground       = require("./models/campground"),
    Comment          = require("./models/comment"),
    passport         = require("passport"),
    flash            = require("connect-flash"),
    LocalStrategy    = require("passport-local"),
    User             = require("./models/user"),
    methodOverride   = require("method-override");
    seedDB           = require("./seeds");

//Requiring Routes    
var campgroundRoutes = require("./routes/campgrounds"),
    commentsRoutes   = require("./routes/comments"),
    indexRoutes      = require("./routes/index");  


mongoose.connect("mongodb://localhost:27017/yelp_camp", { useNewUrlParser: true });
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({extended : true}));
app.use(express.static(__dirname + "/public"));
app.use(methodOverride("_method"));
app.use(flash());
// seedDB(); // seed the database

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
   res.locals.error = req.flash("error");
   res.locals.success = req.flash("success");
   next();
});

app.use(indexRoutes);
app.use("/campgrounds/:id/comments", commentsRoutes);
app.use("/campgrounds", campgroundRoutes);

app.listen(5000, function(){
   console.log("The YelpCamp server has started."); 
});
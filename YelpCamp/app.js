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

var campgroundRoutes = require("./routes/campgrounds"),
    commentsRoutes   = require("./routes/comments"),
    indexRoutes      = require("./routes/index");  


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

app.use(indexRoutes)

app.listen(5000, function(){
   console.log("The YelpCamp server has started."); 
});
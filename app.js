// zgodnie z poradnikiem https://javascript.plainenglish.io/session-authentication-with-node-js-express-passport-and-mongodb-ffd1eea4521c
const express = require('express');
const session = require('express-session');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const morgan = require('morgan'); // package that creates logs
const mongoose = require('mongoose');
const app = express();
const User = require('./models/user')
const MongoStore = require('connect-mongo');
const db = mongoose.connection;

const commentRoutes = require('./routes/commentRoutes');
// const userRoutes = require('./routes/userRoutes');

//connect to mongoDB
const dbURI = 'mongodb+srv://nycto:pass1234@nycto.tbhpcyi.mongodb.net/nycto?retryWrites=true&w=majority';
mongoose.connect(dbURI)
    .then((result) => app.listen(3000))
    .then(() => console.log('Server started'))
    .catch((err) => console.log(err));

// register view engine
app.set('view engine', 'ejs');

// middleware and static files (eg. css, image
// make files from dir 'public' available to frontend
app.use(express.static('public'));
/*
  Session configuration and utilization of the MongoStore for storing
  the session in the MongoDB database
*/
app.use(express.urlencoded({ extended: false })); // do postowania komentarzy
app.use(session({
    secret: 'your secret key',
    resave: false,
    saveUninitialized: true,
    store: new MongoStore({ mongoUrl: db.client.s.url })
}));
/*
  Setup the local passport strategy, add the serialize and
  deserialize functions that only saves the ID from the user
  by default.
*/
const strategy = new LocalStrategy(User.authenticate())
passport.use(strategy);
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
app.use(passport.initialize());
app.use(passport.session());

/*
  Beyond this point is all system specific routes.
  All routes are here for simplicity of understanding the tutorial
  /register -- Look closer at the package https://www.npmjs.com/package/passport-local-mongoose
  for understanding why we don't try to encrypt the password within our application
*/
app.post('/register', function (req, res) {
    User.register(
        new User({
            // email: req.body.email,
            username: req.body.username
        }), req.body.password, function (err, msg) {
            if (err) {
                res.send(err);
            } else {
                res.send({ message: "Successful" });
            }
        }
    )
})



// log requests to console
app.use(morgan('dev'));

// routes
//jak express trafi na dany URL, to nie wykonuje dalszego kodu przy GET, przy USE wykonuje jesli damy next()
// app.get('/', (req, res) => {
//     res.redirect('/comments');
// });

app.get('/', (req, res) => {
    res.render('mainpage', {title: 'Main page'});
});


app.get('/about', (req, res) => {
    res.render('about', {title: 'About'});
});

// redirect to route files
app.use('/comments', commentRoutes);
// app.use('/users', userRoutes);

// 404 page - dziala dla kazdego przeslanego URL, musi byc na dole kodu, zeby nie wykonalo sie zawsze, tylko gdy poprzednie gety nie przejda
app.use((req, res) => {
    res.status(404).render('404', {title: '404'});
});
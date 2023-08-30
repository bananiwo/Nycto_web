// zgodnie z poradnikiem https://javascript.plainenglish.io/session-authentication-with-node-js-express-passport-and-mongodb-ffd1eea4521c
const express = require('express');
const session = require('express-session');
const morgan = require('morgan'); // package that creates logs
const mongoose = require('mongoose');
const app = express();
const MongoStore = require('connect-mongo');
const db = mongoose.connection;

const commentRoutes = require('./routes/commentRoutes');
const userRoutes = require('./routes/userRoutes');

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
app.use('/users', userRoutes);

// 404 page - dziala dla kazdego przeslanego URL, musi byc na dole kodu, zeby nie wykonalo sie zawsze, tylko gdy poprzednie gety nie przejda
app.use((req, res) => {
    res.status(404).render('404', {title: '404'});
});
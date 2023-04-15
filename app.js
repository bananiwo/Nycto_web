const express = require('express');
const morgan = require('morgan'); // package that creates logs
const mongoose = require('mongoose');
const app = express();

const commentRoutes = require('./routes/commentRoutes');

//connect to mongoDB
const dbURI = 'mongodb+srv://nycto:pass1234@nycto.tbhpcyi.mongodb.net/nycto?retryWrites=true&w=majority';
mongoose.connect(dbURI)
    .then((result) => app.listen(3000))
    .catch((err) => console.log(err));

// register view engine
app.set('view engine', 'ejs');

// middleware and static files (eg. css, images)
// make files from dir 'public' available to frontend
app.use(express.static('public'));
app.use(express.urlencoded({ extended: true })); // do postowania komentarzy

// log requests to console
app.use(morgan('dev'));

// mongoose and mongo sandbox routes
app.get('/add-comment', (req, res) => {
    const comment = new Comment({
        title: 'new comment2',
        snippet: 'comment snippet',
        body: 'body of the comment'
    });

    comment.save()
        .then((result) => {
            res.send(result)
        })
        .catch ((err) => {
            console.log(err)
        })
});

app.get('/all-comments', (req, res) => {
    Comment.find()
        .then((result) => {
            res.send(result);
        })
        .catch((err) => {
            console.log(err);
        });
})

app.get('/single-comment', (req, res) => {
    Comment.findById('643adedbb90a088943fd059f')
        .then((result) => {
            res.send(result)
        })
        .catch((err) => {
            console.log(err);
        });
    }
)


// routes

//jak express trafi na dany URL, to nie wykonuje dalszego kodu przy GET, przy USE wykonuje jesli damy next()
app.get('/', (req, res) => {
    res.redirect('/comments');
});

app.get('/about', (req, res) => {
    res.render('about', {title: 'About'});
});

//comment routes
app.use('/comments', commentRoutes);

// 404 page - dziala dla kazdego przeslanego URL, musi byc na dole kodu, zeby nie wykonalo sie zawsze, tylko gdy poprzednie gety nie przejda
app.use((req, res) => {
    res.status(404).render('404', {title: '404'});
});
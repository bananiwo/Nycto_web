const express = require('express')
const User = require('../models/user');
const router = express.Router();
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
// const bcrypt = require('bcrypt')
//
//
// router.use(express.json())
//

const strategy = new LocalStrategy(User.authenticate())
passport.use(strategy);
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
router.use(passport.initialize(() => {}));
router.use(passport.session(() => {}));

router.get('/register',  (req, res) => {
    res.render('register', {title: 'Registration'})
})

router.post('/register', function (req, res) {
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

router.get('/login',  (req, res) => {
    res.render('login', {title: 'Login'})
})

router.post('/login', passport.authenticate('local', {
    failureRedirect: '/login-failure',
    successRedirect: '/login-success'
}), (err, req, res, next) => {
    if (err) next(err);
});

router.get('/login-failure', (req, res, next) => {
    console.log(req.session);
    res.send('Login Attempt Failed.');
});

router.get('/login-success', (req, res, next) => {
    console.log(req.session);
    res.send('Login Attempt was successful.');
});

router.get('/admin', (req, res) => {
    User.find()
        .then((result) => {
            res.render('admin', {title: 'Admin panel', users: result})
        })
        .catch((err) => {
            console.log(err);
        })
});

module.exports = router
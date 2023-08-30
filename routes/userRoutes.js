const express = require('express')
const User = require('../models/user');
const router = express.Router();
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const userController = require('../user-controller');
const validationRule =  require('../validation-rule');

const strategy = new LocalStrategy(User.authenticate())
passport.use(strategy);
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
router.use(passport.initialize(() => {}));
router.use(passport.session(() => {}));

router.get('/register', userController.userForm);
router.post('/validate-form',validationRule.form, userController.validateForm);

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

/*
  Protected Route -- Look in the account controller for
  how we ensure a user is logged in before proceeding.
  We call 'isAuthenticated' to check if the request is
  authenticated or not.
*/
router.get('/profile', function(req, res) {
    console.log(req.session)
    if (req.isAuthenticated()) {
        res.json({ message: 'You made it to the secured profie' })
        // res.render('create', {title: 'Create a new comment'});
    } else {
        res.json({ message: 'You are not authenticated' })
    }
})

module.exports = router
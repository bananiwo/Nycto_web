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
// router.get('/admin', (req, res) => {
//     User.find()
//         .then((result) => {
//             res.render('admin', {title: 'Admin panel', users: result})
//         })
//         .catch((err) => {
//             console.log(err);
//         })
// });
//
//
router.get('/register',  (req, res) => {
    res.render('register', {title: 'Registration'})
})
//
// router.get('/login',  (req, res) => {
//     res.render('login', {title: 'Login'})
// })
//
// //login works only sandbox mode - from request.rest
// router.post('/login', async (req, res) => {
//         const user = await User.findOne({username: req.body.username})
//         if (user == null) {
//             return res.status(500).send('Cannot find user')
//         }
//         try {
//             if (await bcrypt.compare(req.body.password, user.password)) {
//                 res.send("Logged in")
//             } else {
//                 res.send("Wrong password")
//             }
//         } catch {
//             res.status(500).send()
//         }
//     }
// )
//
module.exports = router
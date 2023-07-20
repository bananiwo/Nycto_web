const express = require('express')
const User = require('../models/user');
const router = express.Router();
const bcrypt = require('bcrypt')
const Comment = require("../models/comment");

router.use(express.json())

router.get('/admin', (req, res) => {
    User.find()
        .then((result) => {
            res.render('admin', {title: 'Admin panel', users: result})
        })
        .catch((err) => {
            console.log(err);
        })
});

router.post('/register', async (req, res) => {
    const hashedPassword = await bcrypt.hash(req.body.password, 10) // 10 means automatically add 10-digit salt
    const user = new User({username: req.body.username, password: hashedPassword });
    user.save()
        .then((result) => {
            res.redirect('/users/admin')
        })
        .catch((err) => {
            console.log(err);
        })
})

router.get('/register',  (req, res) => {
    res.render('register', {title: 'Registration'})
})

router.get('/login',  (req, res) => {
    res.render('login', {title: 'Login'})
})

//login works only sandbox mode - from request.rest
router.post('/login', async (req, res) => {
        const user = await User.findOne({username: req.body.username})
        if (user == null) {
            return res.status(500).send('Cannot find user')
        }
        try {
            if (await bcrypt.compare(req.body.password, user.password)) {
                res.send("Logged in")
            } else {
                res.send("Wrong password")
            }
        } catch {
            res.status(500).send()
        }
    }
)

module.exports = router
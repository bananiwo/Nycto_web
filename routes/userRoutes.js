const express = require('express')
const User = require('../models/user');
const router = express.Router();
const bcrypt = require('bcryptjs')
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
    const user = new User(req.body)
    try {
        await user.save()
        const token = await user.generateAuthToken()
        res.status(201).send({user, token})
    } catch (e) {
        res.status(400).send(e)
    }
})

router.get('/register',  (req, res) => {
    res.render('register', {title: 'Registration'})
})

router.get('/login',  (req, res) => {
    res.render('login', {title: 'Login'})
})

router.post('/login', async (req, res) => {
        try {
            const user = await User.findByCredentials(req.body.username, req.body.password)
            const token = await user.generateAuthToken()
            res.send({ user, token })
        } catch (e) {
            res.status(400).send("Cannot log in")
        }
    }
)

module.exports = router
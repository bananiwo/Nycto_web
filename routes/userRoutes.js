const express = require('express')
const User = require('../models/user');
const router = express.Router();
const bcrypt = require('bcryptjs')
const Comment = require("../models/comment");
const auth = require('../middleware/auth')

router.use(express.json())

router.get('/admin', auth, async (req, res) => {
    User.find()
        .then((result) => {
            res.render('admin', {title: 'Admin panel', users: result})
        })
        .catch((err) => {
            console.log(err);
        })
});

router.get('/me', auth, async (req, res) => {
    res.send(req.user)
})

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

router.post('/logout', auth, async (req, res) => {
    try {
        req.user.tokens = req.user.tokens.filter((token) => {
            return token.token !== req.token
        })
        await req.user.save()
        res.send()
    } catch (e) {
        res.status(500).send()
    }
})

router.post('/logoutAll', auth, async (req, res) => {
    try {
        req.user.tokens = []
        await req.user.save()
        // res.send()
        res.redirect('/mainpage')
    } catch (e) {
        res.status(500).send()
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
            res.render('account', { user, token })
            // res.redirect('/me')
            // res.send({ user, token })
        } catch (e) {
            res.status(400).send("Cannot log in")
        }
    }
)

router.delete('/me', auth, async (req, res) => {
    try {
        await req.user.deleteOne()
        res.send(req.user)
    } catch (e) {
        res.status(500).send()
    }
})

module.exports = router
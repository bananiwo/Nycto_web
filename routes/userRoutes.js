const express = require('express')
const User = require('../models/user');
const router = express.Router();
const auth = require('../middleware/auth')

router.use(express.json())
logged = false
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
    try {
        const user = req.session.user
        if(!user) {
            res.status(400).send({message: "Please authenticate"})
        }
        res.render('account', {title: 'Account', user, logged: req.logged})
        // res.send(user)
    } catch (e) {
        res.status(400).send(e)
    }
})

router.post('/register', async (req, res) => {
    const user = new User(req.body)
    try {
        await user.save()
        const token = await user.generateAuthToken()
        req.session.user = user
        res.cookie('token', token)
        res.redirect('/users/me')
        // res.status(201).send({user, token})
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
        res.clearCookie('token')
        res.redirect('/users/login')
    } catch (e) {
        res.status(500).send()
    }
})

router.post('/logoutAll', auth, async (req, res) => {
    try {
        req.user.tokens = []
        await req.user.save()
        // res.send()
        res.clearCookie('token')
        res.redirect('/')
    } catch (e) {
        res.status(500).send()
    }
})

router.get('/register',  (req, res) => {
    res.render('register', {title: 'Registration', logged: req.logged})
})

router.get('/login',  (req, res) => {
    res.render('login', {title: 'Login', logged: req.logged})
})

router.post('/login', async (req, res) => {
        try {
            const user = await User.findByCredentials(req.body.username, req.body.password)
            const token = await user.generateAuthToken()
            req.session.user = user
            res.cookie('token', token)
            res.redirect('/users/me')
        } catch (e) {
            res.status(400).send("Cannot log in")
        }
    }
)

router.post('/delete', auth, async (req, res) => {
    try {
        await req.user.deleteOne()
        res.redirect('/')
        // res.send(req.user)
    } catch (e) {
        res.status(500).send()
    }
})

router.get('/unauthorized', async (req, res) => {
    res.render('unauthorized', {title: 'Unauthorized'})
})

module.exports = router
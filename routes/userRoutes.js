const express = require('express')
const router = express.Router();
const bcrypt = require('bcrypt')

router.use(express.json())

const users = [{name: 'Name', password: "Password"}]

router.get('/', (req, res) => {
    res.json(users)
})

router.post('/', async (req, res) => {
    try {
        const hashedPassword = await bcrypt.hash(req.body.password, 10) // 10 means automatically add 10-digit salt
        const user = {name: req.body.name, password: hashedPassword }
        users.push(user)
        res.status(201).send()
    } catch {
        res.status(500).send()
    }
})

router.post('/login', async (req, res) => {
    const user = users.find(user => user.name === req.body.name)
    if (user == null) {
        return res.status(500).send('Cannot find user')
    }
    try {
        if(await bcrypt.compare(req.body.password, user.password)) {
            res.send("Logged in")
        } else {
            res.send("Wrong password")
        }
    } catch {
        res.status(500).send()
    }
})

module.exports = router;
const express = require('express');
const Comment = require('../models/comment');
const User = require('../models/user');
const router = express.Router();
const auth = require('../middleware/auth')

router.use(express.json())
logged = false
router.get('/all', async (req, res) => {
    Comment.find().sort({createdAt: -1})
        .then((result) => {
            res.render('comments', {title: 'All comments', comments: result, logged: req.logged})
        })
        .catch((err) => {
            console.log(err);
        })
});

router.get('/myComments', auth, async (req, res) => {
    try{
        const comments = await Comment.find({owner: req.user._id})
        res.render('myComments', {comments, logged: req.logged})
        // res.send(comments)
    } catch (e) {
        res.status(500).send()
    }
})

router.post('/', auth, async (req, res) => {
    const comment = new Comment({
        ...req.body,
        owner: req.user._id,
        author: req.user.username
    })

    try {
        await comment.save()
        // res.status(201).send(comment)
        res.redirect('/comments/all')
    } catch (e) {
        res.status(400).send()
    }
});

router.get('/create', auth, (req, res) => {
    res.render('create', {title: 'Create a new comment', logged: req.logged});
});

router.get('/:id', async (req, res) => {
    const id = req.params.id;
    try {
        const commentWithUsername = await Comment.findById(id).populate({
            path: 'owner',
            select: 'username -_id', // Exclude _id field from the user object
        });
        res.render('details', { comment: commentWithUsername, title: 'Comment Details', logged: req.logged})
    } catch (e) {
        res.status(404).render('404', {title: 'Comment not found'});
    }
})

router.delete('/:id', auth, async (req, res) => {
    try {
        const comment = await Comment.findOneAndDelete({_id: req.params.id, owner: req.user._id})
        if (!comment) {
            res.status(404).send()
        }
        res.send(comment)
    } catch (e) {
        res.status(500).send()
    }
})

module.exports = router;
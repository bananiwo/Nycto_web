const express = require('express');
const Comment = require('../models/comment');
const router = express.Router();
const auth = require('../middleware/auth')

router.use(express.json())

router.get('/all', (req, res) => {
    Comment.find().sort({createdAt: -1})
        .then((result) => {
            res.render('comments', {title: 'All comments', comments: result})
        })
        .catch((err) => {
            console.log(err);
        })
});

router.get('/myComments', auth, async (req, res) => {
    try{
        const comments = await Comment.find({owner: req.user._id})
        res.send(comments)
    } catch (e) {
        res.status(500).send()
    }
})

router.post('/', auth, async (req, res) => {
    const comment = new Comment({
        ...req.body,
        owner: req.user._id
    })

    try {
        await comment.save()
        // res.status(201).send(comment)
        res.redirect('/comments/all')
    } catch (e) {
        res.status(400).send()
    }

    //
    // comment.save()
    //     .then((result) => {
    //         res.redirect('/comments/all');
    //     })
    //     .catch((err) => {
    //         console.log(err);
    //     })
});

router.get('/create', (req, res) => {
    res.render('create', {title: 'Create a new comment'});
});

router.get('/:id', (req, res) => {
    const id = req.params.id;
    Comment.findById(id)
        .then((result) => {
            res.render('details', { comment: result, title: 'Comment Details' });
        })
        .catch((err) => {
            res.status(404).render('404', {title: 'Comment not found'});
        });
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


    // const id = req.params.id;
    // Comment.findByIdAndDelete(id)
    //     .then(result => {
    //         res.json({ redirect: '/comments' });
    //     })
    //     .catch(err => {
    //         console.log(err);
    //     })
})

module.exports = router;
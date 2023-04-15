const express = require('express');
const Comment = require('../models/comment');
const router = express.Router();
router.get('/', (req, res) => {
    Comment.find().sort({createdAt: -1})
        .then((result) => {
            res.render('index', {title: 'All comments', comments: result})
        })
        .catch((err) => {
            console.log(err);
        })
});

router.post('/', (req, res) => {
    const comment = new Comment(req.body);
    comment.save()
        .then((result) => {
            res.redirect('/comments');
        })
        .catch((err) => {
            console.log(err);
        })
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

router.delete('/:id', (req, res) => {
    const id = req.params.id;
    Comment.findByIdAndDelete(id)
        .then(result => {
            res.json({ redirect: '/comments' });
        })
        .catch(err => {
            console.log(err);
        })
})

module.exports = router;
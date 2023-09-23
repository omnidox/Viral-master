const express = require('express');
const { Tag, PostTag } = require('../model');

const router = express.Router();

// Retrieve all tags
router.get('/', async (req, res) => {
    const tags = await Tag.findAll();
    res.json(tags);
});

// Retrieve tag by id
router.get('/:id', async (req, res) => {
    const id = req.params.id;
    const tag = await Tag.findByPk(id);
    res.json(tag);
});

// Create a new tag
router.post('/', async (req, res) => {
    const tagInput = req.body;
    const newTag = await Tag.create(tagInput);
    res.json(newTag);
});

// Update an existing tag by id
router.patch('/:id', async (req, res) => {
    const id = req.params.id;
    const tagInput = req.body;
    const [updated] = await Tag.update(tagInput, {
        where: { id: id }
    });
    if (updated) {
        const updatedTag = await Tag.findByPk(id);
        res.json(updatedTag);
    } else {
        res.status(404).json({ message: "Tag not found" });
    }
});

// Delete a tag by id
router.delete('/:id', async (req, res) => {
    const id = req.params.id;
    const deleted = await Tag.destroy({
        where: { id: id }
    });
    if (deleted) {
        res.status(204).send();
    } else {
        res.status(404).json({ message: "Tag not found" });
    }
});

// Associate a post with a tag
router.post('/postId/:postId/tagId/:tagId', async (req, res) => {
    const postId = req.params.postId;
    const tagId = req.params.tagId;
    const newPostTag = await PostTag.create({ PostId: postId, TagId: tagId });
    res.json(newPostTag);
});

// Remove association between a post and a tag
router.delete('/postId/:postId/tagId/:tagId', async (req, res) => {
    const postId = req.params.postId;
    const tagId = req.params.tagId;
    const deleted = await PostTag.destroy({
        where: { PostId: postId, TagId: tagId }
    });
    if (deleted) {
        res.status(204).send();
    } else {
        res.status(404).json({ message: "Association not found" });
    }
});

// Retrieve all posts associated with a tag by id
router.get('/:id/posts', async (req, res) => {
    const id = req.params.id;
    const tag = await Tag.findByPk(id, { include: 'Posts' });
    res.json(tag.Posts);
});

module.exports = router;

const express = require('express');
const { User, Post, Vote, Comment, Bookmark } = require('../model');
const { UserRole } = require("../const/user");

const router = express.Router();

function isAuthenticated(req, res, next) {
    if (req.session.userId) {
        next();
    } else {
        res.status(401).json({ message: 'Unauthorized' });
    }
}

function isAdmin(req, res, next) {
    if (req.session.role === 'Admin') {
        next();
    } else {
        res.status(401).json({ message: 'Unauthorized' });
    }
}

const isSelfOrAdmin = (model) => {
    return async (req, res, next) => {
        const idToMod = req.params.id;
        let ownerId;

        try {
            const instance = await model.findByPk(idToMod);

            if (!instance) {
                res.status(404).json({ message: "Resource not found" });
                return;
            }

            if (model === User) {
                ownerId = instance.id;
            } else if (model === Post || model === Comment || model === Bookmark || model === Vote) {
                ownerId = instance.UserId;
            } else {
                res.status(500).json({ message: "Invalid model provided" });
                return;
            }

            if (req.session.userId === ownerId || req.session.role === UserRole.Admin) {
                next();
            } else {
                res.status(403).json({ message: "You are not authorized to perform this action" });
            }
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: "An error occurred while checking authorization" });
        }
    };
};



// Retrieve all votes
router.get('/', isAuthenticated, isAdmin, async (req, res) => {
    const votes = await Vote.findAll();
    res.json(votes);
});

// Retrieve vote by id
router.get('/:id', async (req, res) => {
    const id = req.params.id;
    const vote = await Vote.findByPk(id);
    res.json(vote);
});

// Create a new vote (only authenticated users can create votes)
router.post('/', isAuthenticated, async (req, res) => {
    const voteInput = req.body;
    const newVote = await Vote.create(voteInput);
    res.json(newVote);
});

// Update an existing vote by id (only the owner or an admin can update a vote)
router.patch('/:id', isSelfOrAdmin(Vote), async (req, res) => {
    const id = req.params.id;
    const voteInput = req.body;
    const [updated] = await Vote.update(voteInput, {
        where: { id: id }
    });
    if (updated) {
        const updatedVote = await Vote.findByPk(id);
        res.json(updatedVote);
    } else {
        res.status(404).json({ message: "Vote not found" });
    }
});

// Delete a vote by id (only the owner or an admin can delete a vote)
router.delete('/:id', isSelfOrAdmin(Vote), async (req, res) => {
    const id = req.params.id;
    const deleted = await Vote.destroy({
        where: { id: id }
    });
    if (deleted) {
        res.status(204).send();
    } else {
        res.status(404).json({ message: "Vote not found" });
    }
});

// Retrieve upvotes and downvotes for a post by id
router.get('/post/count/:id/', async (req, res) => {
    const postId = req.params.id;

    const post = await Post.findByPk(postId);

    if (!post) {
        res.status(404).json({ message: "Post not found" });
    } else {
        const upvotes = await Vote.count({
            where: {
                PostId: postId,
                type: 'upvote'
            }
        });

        const downvotes = await Vote.count({
            where: {
                PostId: postId,
                type: 'downvote'
            }
        });

        res.json({
            upvotes: upvotes,
            downvotes: downvotes
        });
    }
});

// Retrieve upvotes and downvotes for a comment by id
router.get('/comments/count:id', async (req, res) => {
    const commentId = req.params.id;

    const comment = await Comment.findByPk(commentId);

    if (!comment) {
        res.status(404).json({ message: "Comment not found" });
    } else {
        const upvotes = await Vote.count({
            where: {
                CommentId: commentId,
                type: 'upvote'
            }
        });

        const downvotes = await Vote.count({
            where: {
                CommentId: commentId,
                type: 'downvote'
            }
        });

        res.json({
            upvotes: upvotes,
            downvotes: downvotes
        });
    }
});


// Retrieve upvotes and downvotes for a list of posts by id
router.post('/post/count', async (req, res) => {
    const postIds = req.body.postIds;

    let result = {};

    for (const postId of postIds) {
        const post = await Post.findByPk(postId);
        if (post) {
            const upvotes = await Vote.count({
                where: {
                    PostId: postId,
                    type: 'upvote'
                }
            });

            const downvotes = await Vote.count({
                where: {
                    PostId: postId,
                    type: 'downvote'
                }
            });

            result[postId] = {
                upvotes: upvotes,
                downvotes: downvotes
            };
        }
    }

    res.json(result);
});

// Retrieve upvotes and downvotes for a list of comments by id
router.post('/comments/count', async (req, res) => {
    const commentIds = req.body.commentIds;

    let result = {};

    for (const commentId of commentIds) {
        const comment = await Comment.findByPk(commentId);
        if (comment) {
            const upvotes = await Vote.count({
                where: {
                    CommentId: commentId,
                    type: 'upvote'
                }
            });

            const downvotes = await Vote.count({
                where: {
                    CommentId: commentId,
                    type: 'downvote'
                }
            });

            result[commentId] = {
                upvotes: upvotes,
                downvotes: downvotes
            };
        }
    }

    res.json(result);
});


router.post('/post/:userId/check', async (req, res) => {
    const userId = req.params.userId;
    const postIds = req.body.postIds;

    let result = {};

    for (const postId of postIds) {
        const vote = await Vote.findOne({
            where: {
                UserId: userId,
                PostId: postId,
            },
        });

        result[postId] = vote;
    }

    res.json(result);
});

router.post('/comments/:userId/check', async (req, res) => {
    const userId = req.params.userId;
    const commentIds = req.body.commentIds;

    let result = {};

    for (const commentId of commentIds) {
        const vote = await Vote.findOne({
            where: {
                UserId: userId,
                CommentId: commentId,
            },
        });

        result[commentId] = vote;
    }

    res.json(result);
});


module.exports = router;

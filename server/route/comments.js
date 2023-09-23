const express = require('express');
const { Comment } = require('../model');
const { Op } = require('sequelize');
const sequelize = require('sequelize');
const router = express.Router();
const { UserRole } = require("../const/user");

// authMiddleware.js
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


// Retrieve all comments
// router.get('/', async (req, res) => {
//     const comments = await Comment.findAll();
//     res.json(comments);
// });

// Retrieve all comments - accessible only to admins

router.get('/', isAuthenticated, isAdmin, async (req, res) => {
    const comments = await Comment.findAll();
    res.json(comments);
});


// Retrieve comment by id
router.get('/:id', async (req, res) => {
    const id = req.params.id;
    const comment = await Comment.findByPk(id);
    if (comment) {
        res.json(comment);
    } else {
        res.status(404).json({ message: "Comment not found" });
    }
});

// Create a new comment - accessible only to logged in users
router.post('/', isAuthenticated, async (req, res) => {
    const comment_input = req.body;
    const new_comment = await Comment.create(comment_input);
    res.json(new_comment);
});

// // Update an existing comment by id
// router.patch('/:id', isAuthenticated, async (req, res) => {
//     const id = req.params.id;
//     const comment_input = req.body;
//     const [updated] = await Comment.update(comment_input, {
//         where: { id: id }
//     });
//     if (updated) {
//         const updatedComment = await Comment.findByPk(id);
//         res.json(updatedComment);
//     } else {
//         res.status(404).json({ message: "Comment not found" });
//     }
// });

// Update an existing comment by id - accessible only to admins and the comment's author
router.patch('/:id', isAuthenticated, isSelfOrAdmin(Comment), async (req, res) => {
    const id = req.params.id;
    const comment_input = req.body;
    const [updated] = await Comment.update(comment_input, {
        where: { id: id }
    });
    if (updated) {
        const updatedComment = await Comment.findByPk(id);
        res.json(updatedComment);
    } else {
        res.status(404).json({ message: "Comment not found" });
    }
});

// Delete a comment by id
// router.delete('/:id', isAuthenticated, async (req, res) => {
//     const id = req.params.id;
//     const deleted = await Comment.destroy({
//         where: { id: id }
//     });
//     if (deleted) {
//         res.status(204).send();
//     } else {
//         res.status(404).json({ message: "Comment not found" });
//     }
// });

// Delete a comment by id - accessible only to admins and the comment's author
router.delete('/:id', isAuthenticated, isSelfOrAdmin(Comment), async (req, res) => {
    const id = req.params.id;
    const deleted = await Comment.destroy({
        where: { id: id }
    });
    if (deleted) {
        res.status(204).send();
    } else {
        res.status(404).json({ message: "Comment not found" });
    }
});

// Create multiple comments
router.post('/multcomments', async (req, res) => {
    const comment_inputs = req.body;

    // Use bulkCreate to create all comments at once
    const new_comments = await Comment.bulkCreate(comment_inputs);

    res.json(new_comments);
});

// Retrieve comments by Post id
router.get('/post/:postId', async (req, res) => {
    const postId = req.params.postId;
    const comments = await Comment.findAll({ where: { PostId: postId } });
    res.json(comments);
});

// Retrieve comments by User id
// router.get('/user/:userId', async (req, res) => {
//     const userId = req.params.userId;
//     const comments = await Comment.findAll({ where: { UserId: userId } });
//     res.json(comments);
// });

// Retrieve comments by User id, and paginate by cursor
router.get('/user/:userId', async (req, res) => {
    const userId = req.params.userId;
    const limit = req.query.limit ? parseInt(req.query.limit, 10) : 10;
    const cursor = req.query.cursor ? parseInt(req.query.cursor, 10) : null;

    const whereCondition = {
        UserId: userId,
        PostId: { [Op.not]: null },
    };

    if (cursor) {
        whereCondition.id = { [Op.lt]: cursor };
    }

    try {
        const comments = await Comment.findAll({
            where: whereCondition,
            order: [['id', 'DESC']],
            limit: limit,
        });

        const newCursor = comments.length > 0 ? comments[comments.length - 1].id : null;

        res.json({
            cursor: newCursor,
            comments: comments
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "An error occurred while fetching comments" });
    }
});

// Count and return the number of comments for each post
router.post('/post/count', async (req, res) => {
    const postIds = req.body.postIds;

    try {
        const commentCounts = await Comment.findAll({
            attributes: ['PostId', [sequelize.fn('COUNT', sequelize.col('PostId')), 'comments']],
            where: {
                PostId: { [Op.in]: postIds },
            },
            group: ['PostId'],
            raw: true,
        });

        const commentCountMap = commentCounts.reduce((acc, count) => {
            acc[count.PostId] = { comments: parseInt(count.comments) };
            return acc;
        }, {});

        res.json(commentCountMap);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "An error occurred while fetching comment counts" });
    }
});


module.exports = router;

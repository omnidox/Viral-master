const express = require('express');
const { Post, Vote, Comment } = require('../model');
const { Sequelize, Op} = require("sequelize");
const { UserRole } = require("../const/user");

const router = express.Router();


// Middleware to check if the user is logged in
const isAuthenticated = (req, res, next) => {
    if (req.session.userId) {
        next();
    } else {
        res.status(401).json({ message: "You must be logged in to perform this action" });
    }
};

// Middleware to check if the user is the author of the post or an admin
const isAuthorOrAdmin = async (req, res, next) => {
    const postId = req.params.id;
    const post = await Post.findByPk(postId);
    if (!post) {
        res.status(404).json({ message: "Post not found" });
        return;
    }
    if (req.session.role === UserRole.Admin || req.session.userId === post.UserId) {
        next();
    } else {
        res.status(403).json({ message: "You are not authorized to perform this action" });
    }
};

function isAdmin(req, res, next) {
    if (req.session.role === 'Admin') {
      next();
    } else {
      res.status(401).json({ message: 'Unauthorized' });
    }
  }
  
// Now, to search for posts with a specific title and paginate the results, you can send a request to 
// the /search endpoint with the title parameter, e.g., /search?title=example&limit=5.

router.get('/search', async (req, res) => {
    const defaultLimit = 10;
    let limit = parseInt(req.query.limit) || defaultLimit;
    let cursor = req.query.cursor;
    let title = req.query.title;

    if (!title) {
        return res.status(400).json({ message: "Title parameter is required for searching posts" });
    }

    if (!cursor || cursor.trim() === '') {
        cursor = null;
    }

    let posts;

    try {
        const searchCondition = {
            title: {
                [Op.like]: Sequelize.literal(`LOWER('%${title}%')`) // case-insensitive search using LIKE and LOWER
            }
        };

        if (cursor !== null) {
            searchCondition.id = {
                [Op.lt]: cursor
            };
        }

        posts = await Post.findAll({
            where: {
                UserId: { [Op.not]: null },
                ...searchCondition
            },
            limit: limit,
            order: [['id', 'DESC']]
        });

    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "An error occurred while searching for posts" });
    }

    const newCursor = posts.length > 0 ? posts[posts.length - 1].id : null;

    res.json({
        cursor: newCursor,
        posts: posts
    });
});



// Retrieve posts with cursor pagination and sort by popularity
router.get('/popular', async (req, res) => {
    const defaultLimit = 10;
    let limit = parseInt(req.query.limit) || defaultLimit;

    let cursor = req.query.cursor;

    if (!cursor || cursor.trim() === '') {
        cursor = null;
    }

    let posts;

    try {
        const netUpvotesLiteral = Sequelize.literal('(SELECT COUNT(*) FROM `Votes` WHERE `PostId` = `Post`.`id` AND `type` = \'upvote\') - (SELECT COUNT(*) FROM `Votes` WHERE `PostId` = `Post`.`id` AND `type` = \'downvote\')');
        // Page pagination
        const offset = limit * (cursor?? 0);

        posts = await Post.findAll({
            attributes: {
                include: [
                    [netUpvotesLiteral, 'netUpvotes']
                ]
            },
            limit: limit,
            order: [
                [netUpvotesLiteral, 'DESC'],
                ['id', 'DESC']
            ],
            where: {
                UserId: { [Op.not]: null },
            },
            offset,
            // include: [
            //     { model: Vote }
            // ]
        });

        // TODO: Future Improvement: Alternative cursor required for `cursor-based-pagination`
        // if (cursor === null) {
        //     posts = await Post.findAll({
        //         attributes: {
        //             include: [
        //                 [netUpvotesLiteral, 'netUpvotes']
        //             ]
        //         },
        //         limit: limit,
        //         order: [
        //             [netUpvotesLiteral, 'DESC'],
        //             ['id', 'DESC']
        //         ],
        //         where: {
        //             UserId: { [Op.not]: null },
        //         }
        //         // include: [
        //         //     { model: Vote }
        //         // ]
        //     });
        // } else {
        //     posts = await Post.findAll({
        //         attributes: {
        //             include: [
        //                 [netUpvotesLiteral, 'netUpvotes']
        //             ]
        //         },
        //         limit: limit,
        //         order: [
        //             [netUpvotesLiteral, 'DESC'],
        //             ['id', 'DESC']
        //         ],
        //         where: {
        //             id: {
        //                 [ Op.lt ]: cursor,
        //             },
        //             UserId: { [Op.not]: null },
        //         },
        //         // include: [
        //         //     { model: Vote }
        //         // ]
        //     });
        //}
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "An error occurred while fetching popular posts" });
    }

    const newCursor = (cursor?? 0) + 1;
    //const newCursor = posts.length > 0 ? posts[posts.length - 1].id : null;

    res.json({
        cursor: newCursor,
        posts: posts
    });
});



// Retrieve posts with cursor pagination
router.get('/cursor', async (req, res) => {
    const defaultLimit = 10; // default number of posts to retrieve per page
    let limit = parseInt(req.query.limit) || defaultLimit; // parse limit parameter from request query

    let cursor = req.query.cursor; // cursor parameter from request query

    // if cursor is not provided or is an empty string, set cursor to null
    if (!cursor || cursor.trim() === '') {
        cursor = null;
    }

    let posts;

    if (cursor === null) {
        // if cursor is null, retrieve the first page of posts
        posts = await Post.findAll({
            limit: limit,
            order: [['id', 'DESC']],
            where: {
                UserId: { [Op.not]: null }, // Don't show posts from a removed user
            },
        });
    } else {
        // if cursor is not null, retrieve the next page of posts
        posts = await Post.findAll({
            limit: limit,
            order: [['id', 'DESC']],
            where: {
                id: { [Op.lt]: cursor }, // retrieve posts with id less than the cursor
                UserId: { [Op.not]: null },
            },
        });
    }

    // create a new cursor by getting the id value of the last post in the list
    const newCursor = posts.length > 0 ? posts[posts.length - 1].id : null;

    res.json({
        cursor: newCursor,
        posts: posts
    });
});


// Retrieve all posts
router.get('/', async (req, res) => {
    const posts = await Post.findAll();
    res.json(posts);
});

// Retrieve post by id
router.get('/:id', async (req, res) => {
    const id = req.params.id;
    const posts = await Post.findByPk(id);
    res.json(posts);
});

// Create a new post
// router.post('/', async (req, res) => {
//     const post_input = req.body;
//     const new_post = await Post.create(post_input);
//     res.json(new_post);
// });

// Create a new post with session authentication
router.post('/', isAuthenticated, async (req, res) => {
    const post_input = req.body;
    post_input.UserId = req.session.userId; // Set the author of the post
    console.log("PostInput: " + post_input);
    const new_post = await Post.create(post_input);
    res.json(new_post);
});


// Create multiple posts
router.post('/createmultposts', async (req, res) => {
    const post_inputs = req.body;

    // Use bulkCreate to create all posts at once
    const new_posts = await Post.bulkCreate(post_inputs);

    res.json(new_posts);
});

// Update an existing post by id
// router.patch('/:id', async (req, res) => {
//     const id = req.params.id;
//     const post_input = req.body;
//     const [updated] = await Post.update(post_input, {
//         where: { id: id }
//     });
//     if (updated) {
//         const updatedPost = await Post.findByPk(id);
//         res.json(updatedPost);
//     } else {
//         res.status(404).json({ message: "Post not found" });
//     }
// });

// Update an existing post by id with session authentication
router.patch('/:id', isAuthenticated, isAuthorOrAdmin, async (req, res) => {
    const id = req.params.id;
    const post_input = req.body;
    const [updated] = await Post.update(post_input, {
        where: { id: id }
    });
    if (updated) {
        const updatedPost = await Post.findByPk(id);
        res.json(updatedPost);
    } else {
        res.status(404).json({ message: "Post not found" });
    }
});


// Delete a post by id
// router.delete('/:id', async (req, res) => {
//     const id = req.params.id;
//     const deleted = await Post.destroy({
//         where: { id: id }
//     });
//     if (deleted) {
//         res.status(204).send();
//     } else {
//         res.status(404).json({ message: "Post not found" });
//     }
// });

// Delete a post by id
router.delete('/:id', isAuthenticated, isAuthorOrAdmin, async (req, res) => {
    const id = req.params.id;
    const deleted = await Post.destroy({
        where: { id: id }
    });
    if (deleted) {
        res.status(204).send();
    } else {
        res.status(404).json({ message: "Post not found" });
    }
});

// Retrieve posts by User id, and paginate by cursor
router.get('/user/:userId', async (req, res) => {
    const userId = req.params.userId;
    const limit = req.query.limit ? parseInt(req.query.limit, 10) : 10;
    const cursor = req.query.cursor ? parseInt(req.query.cursor, 10) : null;

    const whereCondition = { userId };

    if (cursor) {
        whereCondition.id = { [Op.lt]: cursor };
    }

    try {
        const posts = await Post.findAll({
            where: whereCondition,
            order: [['id', 'DESC']],
            limit: limit,
        });

        const newCursor = posts.length > 0 ? posts[posts.length - 1].id : null;

        res.json({
            cursor: newCursor,
            posts: posts,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "An error occurred while fetching posts" });
    }
});


// Retrieve comments for a post by id
router.get('/:id/comments', async (req, res) => {
    const postId = req.params.id;
    const comments = await Comment.findAll({ where: { PostId: postId } });
    res.json(comments);
});


// Retrieve upvotes and downvotes for a post by id
router.get('/:id/votes', async (req, res) => {
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

// Retrieve posts given a list of postIds
router.post('/multposts', async (req, res) => {
    const postIds = req.body.ids;
    
    if (!Array.isArray(postIds)) {
        res.status(400).json({ message: "Invalid input format. 'ids' should be an array of postIds." });
        return;
    }

    const posts = await Post.findAll({ where: { id: postIds } });
    
    // Convert the posts array into an object with postId as the key
    const postsById = posts.reduce((acc, post) => {
        acc[post.id] = post;
        return acc;
    }, {});

    res.json(postsById);
});

module.exports = router;

const express = require('express');
const { Bookmark, Comment, Post, User, Vote } = require('../model');
const { Op } = require("sequelize");
const { UserRole } = require("../const/user");

const router = express.Router();

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



// Retrieve all bookmarks,user, and post information - accessible only to admins
router.get('/', isAuthenticated, isAdmin, async (req, res) => {
    try {
        const bookmarks = await Bookmark.findAll({ include: [Post, User] });
        res.json(bookmarks);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "An error occurred while fetching bookmarks" });
    }
});

// Retrieve bookmark by id, along with post and user information - accessible only to logged in users
router.get('/:id', isAuthenticated, async (req, res) => {
    const id = req.params.id;
    const bookmark = await Bookmark.findByPk(id, { include: [Post, User] });
    res.json(bookmark);
});

// Create a new bookmark - accessible only to logged in users
router.post('/', isAuthenticated, async (req, res) => {
    const bookmarkInput = req.body;
    const newBookmark = await Bookmark.create(bookmarkInput);
    res.json(newBookmark);
});

// Update an existing bookmark by id and return the updated bookmark, along with post and user information - accessible only to logged in users who are either the bookmark owner or admins
router.patch('/:id', isAuthenticated, isSelfOrAdmin(Bookmark), async (req, res) => {
    const id = req.params.id;
    const bookmarkInput = req.body;
    const [updated] = await Bookmark.update(bookmarkInput, {
        where: { id: id }
    });
    if (updated) {
        const updatedBookmark = await Bookmark.findByPk(id, { include: [Post, User] });
        res.json(updatedBookmark);
    } else {
        res.status(404).json({ message: "Bookmark not found" });
    }
});

// Delete a bookmark by id - accessible only to logged in users who are either the bookmark owner or admins
router.delete('/:id', isAuthenticated, isSelfOrAdmin(Bookmark), async (req, res) => {
    const id = req.params.id;
    const deleted = await Bookmark.destroy({
        where: { id: id }
    });
    if (deleted) {
        res.status(204).send();
    } else {
        res.status(404).json({ message: "Bookmark not found" });
    }
});

// Retrieve bookmarks by User id, along with post and user information
// router.get('/user/:userId', async (req, res) => {
//     const userId = req.params.userId;
//     const bookmarks = await Bookmark.findAll({ where: { UserId: userId }, include: [Post, User] });
//     res.json(bookmarks);
// });

// Retrieve bookmarks by Post id, along with post and user information
router.get('/post/:postId', async (req, res) => {
    const postId = req.params.postId;
    const bookmarks = await Bookmark.findAll({ where: { PostId: postId }, include: [Post, User] });
    res.json(bookmarks);
});

router.post('/post/:userId/check', async (req, res) => {
    const userId = req.params.userId;
    const postIds = req.body.postIds;

    let result = {};

    for (const postId of postIds) {
        const bookmark = await Bookmark.findOne({
            where: {
                UserId: userId,
                PostId: postId,
            },
        });

        result[postId] = bookmark;
    }

    res.json(result);
});


// Retrieve bookmarks by User id, along with post and user information, and paginate by cursor
// Example cursor and limit query parameters: /user/1?cursor=10&limit=10
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
        const bookmarks = await Bookmark.findAll({
            where: whereCondition,
            include: [Post],
            order: [['id', 'DESC']],
            limit: limit,
        });

        const newCursor = bookmarks.length > 0 ? bookmarks[bookmarks.length - 1].id : null;

        res.json({
            cursor: newCursor,
            bookmarks: bookmarks
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "An error occurred while fetching bookmarks" });
    }
});


module.exports = router;

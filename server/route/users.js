const express = require('express');
const bcrypt = require('bcryptjs');
const { Op } = require("sequelize");
const { User } = require("../model");
const { UserRole } = require("../const/user");

const router = express.Router();


const isAuthenticated = (req, res, next) => {
    if (req.session.userId) {
        next();
    } else {
        res.status(401).json({ message: "You must be logged in to perform this action" });
    }
};

const isAdmin = (req, res, next) => {
    if (req.session.role === UserRole.Admin) {
        next();
    } else {
        res.status(403).json({ message: "You are not authorized to perform this action" });
    }
};

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



// Retrieve all users
// router.get('/', async (req, res) => {
//     const users = await User.findAll();
//     res.json(users);
// });


// Retrieve all users - accessible only to admins
router.get('/', isAuthenticated, isAdmin, async (req, res) => {
    const users = await User.findAll();
    res.json(users);
});


// Retrieve user by their username
router.get('/@:username', async (req, res) => {
    const username = req.params.username;
    const user = await User.findOne({ where: { username } });
    if (user) {
        res.json(user);
    } else {
        res.status(404).json({ message: "User not found" });
    }
});

// Check if a username is available
router.get('/@:username/available', async (req, res) => {
    const username = req.params.username;
    const exists = await User.findOne({ where: { username } })
        .then(result => result != null);
    res.json({ exists });
});

// Retrieve user by id
router.get('/:id', async (req, res) => {
    const id = req.params.id;
    const user = await User.findByPk(id);
    if (user) {
        res.json(user);
    } else {
        res.status(404).json({ message: "User not found" });
    }
});

// Create a new user
router.post('/', async (req, res) => {
    const user_input = req.body;

    // Hash the password before storing it in the database
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(user_input.password, salt);

    // Replace the plaintext password with the hashed password
    user_input.password = hashedPassword;

    const new_user = await User.create(user_input);
    res.json(new_user);
});

// Update an existing user by id
// router.patch('/patch/:id', async (req, res) => {
//     const id = req.params.id;
//     const user_input = req.body;

//     // Hash the new password if it's being updated
//     if (user_input.password) {
//         const salt = await bcrypt.genSalt(10);
//         const hashedPassword = await bcrypt.hash(user_input.password, salt);
//         user_input.password = hashedPassword;
//     }

//     const [updated] = await User.update(user_input, {
//         where: { id: id }
//     });

//     if (updated) {
//         const updatedUser = await User.findByPk(id);
//         res.json(updatedUser);
//     } else {
//         res.status(404).json({ message: "User not found" });
//     }
// });



// Update an existing user by id only if the user is an admin or the user themselves
router.patch('/:id', isAuthenticated, isSelfOrAdmin(User), async (req, res) => {
    const id = req.params.id;
    const user_input = req.body;

    // Fetch the user's role from the session
    const userRole = req.session.role;

    // Check if the user is an admin or the user themselves
    if (userRole !== UserRole.Admin && req.session.userId !== parseInt(id)) {
        res.status(403).json({ message: 'Forbidden: You do not have permission to update this user' });
        return;
    }

    // Hash the new password if it's being updated
    if (user_input.password) {
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(user_input.password, salt);
        user_input.password = hashedPassword;
    }

    const [updated] = await User.update(user_input, {
        where: { id: id }
    });

    if (updated) {
        const updatedUser = await User.findByPk(id);
        res.json(updatedUser);
    } else {
        res.status(404).json({ message: "User not found" });
    }
});




// // Delete a user by id
// router.delete('/:id', async (req, res) => {
//     const id = req.params.id;
//     const deleted = await User.destroy({
//         where: { id: id }
//     });
//     if (deleted) {
//         res.status(204).send();
//     } else {
//         res.status(404).json({ message: "User not found" });
//     }
// });

// Delete a user by id - accessible only if the user is an admin or the user themselves
router.delete('/:id', isAuthenticated, isSelfOrAdmin(User), async (req, res) => {
    const id = req.params.id;

    const deleted = await User.destroy({
        where: { id: id }
    });
    if (deleted) {
        res.status(204).send();
    } else {
        res.status(404).json({ message: "User not found" });
    }
});

// Retrieve multiple users
router.post('/multusers', async (req, res) => {
    const userIds = req.body.ids;

    if (!Array.isArray(userIds)) {
        res.status(400).json({ message: "Invalid input format. 'ids' should be an array of userIds." });
        return;
    }

    const users = await User.findAll({ where: { id: userIds } });

    // Convert the posts array into an object with postId as the key
    const usersById = users.reduce((acc, user) => {
        acc[user.id] = user;
        return acc;
    }, {});

    res.json(usersById);
});

// Create multiple users
// router.post('/multiple', async (req, res) => {
//     const user_inputs = req.body;

//     // Hash the passwords before storing them in the database
//     const hashedUserInputs = await Promise.all(user_inputs.map(async (user_input) => {
//         const salt = await bcrypt.genSalt(10);
//         const hashedPassword = await bcrypt.hash(user_input.password, salt);

//         // Replace the plaintext password with the hashed password
//         user_input.password = hashedPassword;
//         return user_input;
//     }));

//     // Create all users at once using bulkCreate
//     const new_users = await User.bulkCreate(hashedUserInputs);
//     res.json(new_users);
// });

// Create multiple users - accessible only to admins
router.post('/multiple', isAuthenticated, isAdmin, async (req, res) => {
    const user_inputs = req.body;

    // Hash the passwords before storing them in the database
    const hashedUserInputs = await Promise.all(user_inputs.map(async (user_input) => {
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(user_input.password, salt);

        // Replace the plaintext password with the hashed password
        user_input.password = hashedPassword;
        return user_input;
    }));

    // Create all users at once using bulkCreate
    const new_users = await User.bulkCreate(hashedUserInputs);
    res.json(new_users);
});

module.exports = router;

const express = require('express');
const cors = require('cors'); // Import the cors package

const setup_routes = (app) => {
    app.use(cors()); // Use cors middleware for all routes

    const apiRouter = express.Router();

    // Accessible routes
    apiRouter.use('/post', require('./post'));
    apiRouter.use("/comments", require("./comments"));
    apiRouter.use("/user", require("./users"));
    apiRouter.use('/votes', require('./votes'));
    apiRouter.use('/tags', require('./tags'));
    apiRouter.use('/bookmarks', require('./bookmarks'));
    apiRouter.use('/auth', require('./auth'));

    app.use('/api/v1', apiRouter);
}

module.exports = setup_routes;

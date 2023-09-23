const { Port } = require('./const/server');
const express = require('express');
const session = require('express-session');
const build_router = require('./route');
const db = require('./model');

const app = express();
// Allow sessions
app.use(session({
    secret: 'viral_server',
    name: 'viral_platform',
    saveUninitialized: false,
    resave: false,
}));
// Allow JSON parsing
app.use(express.json());

// Setup routes
build_router(app);

db.sequelize.sync().then(() => {
    app.listen(Port, () => {
        console.log(`Listening on port ${Port}`);
    });
});

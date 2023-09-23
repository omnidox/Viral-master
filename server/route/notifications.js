const express = require('express');
const { Notification } = require('../model');

const router = express.Router();

// Retrieve all notifications
router.get('/', async (req, res) => {
    const notifications = await Notification.findAll();
    res.json(notifications);
});

// Retrieve notification by id
router.get('/:id', async (req, res) => {
    const id = req.params.id;
    const notification = await Notification.findByPk(id);
    res.json(notification);
});

// Create a new notification
router.post('/', async (req, res) => {
    const notification_input = req.body;
    const new_notification = await Notification.create(notification_input);
    res.json(new_notification);
});

// Update an existing notification by id
router.patch('/:id', async (req, res) => {
    const id = req.params.id;
    const notification_input = req.body;
    const [updated] = await Notification.update(notification_input, {
        where: { id: id }
    });
    if (updated) {
        const updatedNotification = await Notification.findByPk(id);
        res.json(updatedNotification);
    } else {
        res.status(404).json({ message: "Notification not found" });
    }
});

// Delete a notification by id
router.delete('/:id', async (req, res) => {
    const id = req.params.id;
    const deleted = await Notification.destroy({
        where: { id: id }
    });
    if (deleted) {
        res.status(204).send();
    } else {
        res.status(404).json({ message: "Notification not found" });
    }
});

// Retrieve notifications by User id
router.get('/user/:userId', async (req, res) => {
    const userId = req.params.userId;
    const notifications = await Notification.findAll({ where: { UserId: userId } });
    res.json(notifications);
});

module.exports = router;

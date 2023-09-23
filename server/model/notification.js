module.exports = (sequelize, DataTypes) => {
    const Notification = sequelize.define('Notification', {
        type: {
            type: DataTypes.ENUM('post_vote', //A user receives this notification when someone votes on their post.
            'comment_vote', //A user receives this notification when someone votes on their comment.
            'post_reply', //A user receives this notification when someone comments on their post.
            'comment_reply'), //A user receives this notification when someone replies to their comment.
            allowNull: false,
        },

        //This field below is a boolean that indicates whether the user has read the notification or not. 
        //By default, it is set to false, meaning the notification is unread. When the user reads the notification, 
        //the value should be updated to true.

        read: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false,
        },
    });

    Notification.associate = (models) => {
        Notification.belongsTo(models.User);
        Notification.belongsTo(models.Post);
        Notification.belongsTo(models.Comment);
    };

    return Notification;
};

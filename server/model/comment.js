module.exports = (sequelize, DataTypes) => {
    // Model
    const Comment = sequelize.define('Comment', {
        content: {
            type: DataTypes.STRING,
            allowNull: false,
        },
    });

    // Associations

    Comment.associate = (models) => {
        Comment.hasMany(models.Comment); // All reply comments 
        Comment.belongsTo(models.Comment); // A reply to another comment 
        Comment.belongsTo(models.Post, { 
            onDelete: 'CASCADE', 
            onUpdate: 'CASCADE', 
        });
        Comment.belongsTo(models.User);
        Comment.hasMany(models.Vote);
        Comment.hasMany(models.Notification);
    };

    return Comment;
}

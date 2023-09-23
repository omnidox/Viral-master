module.exports = (sequelize, DataTypes) => {
    // Model
    const Post = sequelize.define('Post', {
        title: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        content: {
            type: DataTypes.TEXT,
            allowNull: false,
        },
    });

    // Associations

    Post.associate = (models) => {
        Post.hasMany(models.Comment);
        Post.belongsTo(models.User);
        Post.hasMany(models.Vote);
        Post.hasMany(models.Notification);
        Post.belongsToMany(models.Tag, { through: models.PostTag });
        Post.hasMany(models.Bookmark);
    };

    return Post;
}

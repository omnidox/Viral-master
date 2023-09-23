module.exports = (sequelize, DataTypes) => {
    const Vote = sequelize.define('Vote', {
        type: {
            type: DataTypes.ENUM('upvote', 'downvote'),
            allowNull: false,
        },
    });

    Vote.associate = (models) => {
        Vote.belongsTo(models.User);
        Vote.belongsTo(models.Post);
        Vote.belongsTo(models.Comment);
    };

    return Vote;
};
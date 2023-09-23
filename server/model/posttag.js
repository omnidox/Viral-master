module.exports = (sequelize, DataTypes) => {
    const PostTag = sequelize.define('PostTag', {});

    PostTag.associate = (models) => {
        PostTag.belongsTo(models.Post);
        PostTag.belongsTo(models.Tag);
    };

    return PostTag;
};
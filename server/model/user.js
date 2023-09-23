module.exports = (sequelize, DataTypes) => {
    // Model
    const User = sequelize.define('User', {
        firstname: {
            type: DataTypes.STRING(255),
            allowNull: false,
        },
        lastname: {
            type: DataTypes.STRING(255),
            allowNull: false,
        },

        username: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
        },
        email: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
            validate: {
                isEmail: true
            }
        },
        password: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        profilePicture: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        bio: {
            type: DataTypes.TEXT,
            allowNull: true,
        },
        role: {
            type: DataTypes.ENUM('user', 'admin'),
            allowNull: false,
            defaultValue: 'user'
        }

        // dateOfBirth: {
        //     type: DataTypes.DATEONLY,
        //     allowNull: true,
        // }
    });

    // Associations
    User.associate = (models) => {
        User.hasMany(models.Post);
        User.hasMany(models.Comment);
        User.hasMany(models.Vote);
        User.hasMany(models.Notification);
        User.hasMany(models.Bookmark);
    };

    return User;
}

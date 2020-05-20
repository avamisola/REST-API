'use strict';
const Sequelize = require('sequelize');

//create User model
module.exports = (sequelize) => {
    class User extends Sequelize.Model { }
    User.init({
        id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            allowNull: false
        },
        firstName: {
            type: Sequelize.STRING,
            allowNull: false,
            validate: {
                notNull: {
                    msg: 'First Name is required'
                },
                notEmpty: {
                    msg: 'First Name is required'
                },
            },
        },
        lastName: {
            type: Sequelize.STRING,
            allowNull: false,
            validate: {
                notNull: {
                    msg: 'Last Name is required'
                },
                notEmpty: {
                    msg: 'Last Name is required'
                },
            },
        },
        emailAddress: {
            type: Sequelize.STRING,
            allowNull: false,
            validate: {
                notNull: {
                    msg: 'Email is required'
                },
                notEmpty: {
                    msg: 'Email is required'
                },
            },
            unique: {
                args: true,
                msg: 'Email address already in use!'
            },
            isEmail: true,
        },
        password: {
            type: Sequelize.STRING,
            allowNull: false,
            validate: {
                notNull: {
                    msg: 'Password is required'
                },
                notEmpty: {
                    msg: 'Password is required'
                },
            },
        }
    }, { sequelize });

    //define model association, a User has many Courses
    User.associate = (models) => {
        User.hasMany(models.Course, {
            as: 'student',
            foreignKey: {
                fieldName: 'userId',
                allowNull: false
            }
        });
    }

    return User;
};

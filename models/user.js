'use strict';
const Sequelize = require('sequelize');

//create User model
module.exports = (sequelize) => {
    class User extends Sequelize.Model { }
    User.init({
        id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        firstName: {
            type: Sequelize.STRING
        },
        lastName: {
            type: Sequelize.STRING
        },
        emailAddress: {
            type: Sequelize.STRING
        },
        password: {
            type: Sequelize.STRING
        }
    }, { sequelize });

    //define model association, a User has many Courses
    User.hasMany(Course, {
      //Course.userId = User.id
      foreignKey: 'userId'
    });

    return User;
};

'use strict';
const Sequelize = require('sequelize');

//create Course model
module.exports = (sequelize) => {
    class Course extends sequelize.Model { }
    Course.init({
        id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        userId: {
            type: Sequelize.INTEGER
        },
        title: {
            type: Sequelize.STRING
        },
        description: {
            type: Sequelize.TEXT
        },
        estimatedTime: {
            type: Sequelize.STRING,
            allowNull: true
        },
        materialsNeeded: {
            type: Sequelize.STRING,
            allowNull: true
        }
    }, { sequelize })

    //define model association, a Course belongs to single User
    Course.belongsTo(User);

    return Course;
};

'use strict';
const Sequelize = require('sequelize');

//create Course model
module.exports = (sequelize) => {
    class Course extends Sequelize.Model {}
    Course.init({
        id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            allowNull: false
        },
        title: {
            type: Sequelize.STRING,
            allowNull: false,
            validate: {
                notNull: {
                    msg: 'Title is required'
                },
                notEmpty: {
                    msg: 'Title is required'
                },
            },
        },
        description: {
            type: Sequelize.TEXT,
            allowNull: false,
            validate: {
                notNull: {
                    msg: 'Description is required'
                },
                notEmpty: {
                    msg: 'Description is required'
                },
            },
        },
        estimatedTime: {
            type: Sequelize.STRING,
            allowNull: true
        },
        materialsNeeded: {
            type: Sequelize.STRING,
            allowNull: true
        }
    }, { sequelize });

    //define model association, a Course belongs to single User
    Course.associate = (models) => {
        Course.belongsTo(models.User, {
            as: 'student',
            foreignKey: {
                fieldName: 'userId',
                allowNull: false
            }
        });
    }

    return Course;
};

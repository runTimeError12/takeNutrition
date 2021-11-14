"use strict";

module.exports = (sequelize, DataTypes) => {
    const mealData = sequelize.define("mealData", {
        mealDataID: {
            field: "mealDataID",
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        title: {
            field: "title",
            type: DataTypes.STRING,
            allowNull: false
        },
        notes: {
            field: "notes",
            type: DataTypes.TEXT
        },
        protein: {
            field: "protein",
            type: DataTypes.DECIMAL(10, 2)
        },
        fat: {
            field: "fat",
            type: DataTypes.DECIMAL(10, 2)
        },
        carbs: {
            field: "carbs",
            type: DataTypes.DECIMAL(10, 2)
        },
        calories: {
            field: "calories",
            type: DataTypes.INTEGER
        },
        takenAt: {
            field: "takenAt",
            type: DataTypes.DATE
        },
        imgUrl: {
            field: "imgUrl",
            type: DataTypes.TEXT
        },
        isActive: {
            field: "isActive",
            type: DataTypes.BOOLEAN,
            default: 1
        },
    },
        {
            tableName: "mealData"
        });

    mealData.associate = (models) => {

        mealData.belongsTo(models.users, {
            foreignKey: "userID"
        });
        mealData.belongsTo(models.users, {
            foreignKey: "createdByUserID"
        });

        mealData.belongsTo(models.users, {
            foreignKey: "lastUpdatedUserID"
        });
    };


    return mealData;
}
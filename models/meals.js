"use strict";

module.exports = (sequelize, DataTypes) => {
    const MEALS = sequelize.define("meals", {
       mealID: {
            field: "mealID",
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        ingredientCode: {
            field: "ingredientCode",
            type: DataTypes.INTEGER,
            allowNull: false,
            unique: true
        },
        ingredientDescription: {
            field: "ingredientDescription",
            type: DataTypes.STRING(4000)
        },
        protein: {
            field: "protein",
            type: DataTypes.DECIMAL(10,2)
        },
        totalFat: {
            field: "totalFat",
            type: DataTypes.DECIMAL(10,2)
        },
        carbohydrate: {
            field: "carbohydrate",
            type: DataTypes.DECIMAL(10,2)
        },
        energy: {
            field: "energy",
            type: DataTypes.INTEGER
        }
    },
    {
        tableName: "meals"
    });
   
    return MEALS;
}
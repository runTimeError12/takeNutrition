"use strict";

module.exports = (sequelize, DataTypes) => {
    const MAP_TAKEN_MEAL = sequelize.define("mealTakenDetails", {
        mealTakenDetailsID: {
            field: "mealTakenDetailsID",
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        mealCount:{
            field: "mealCount",
            type: DataTypes.INTEGER
        },	
        isActive: {
            field: "isActive",
            type: DataTypes.BOOLEAN,
            default: 1
        },        
    },
    {
        tableName: "mealTakenDetails"
    });
   
    MAP_TAKEN_MEAL.associate = (models) => {  
         MAP_TAKEN_MEAL.belongsTo(models.mealTaken, {
            foreignKey: "mealTakenID"
          });
          MAP_TAKEN_MEAL.belongsTo(models.meals, {
            foreignKey: "mealID"
          });
          MAP_TAKEN_MEAL.belongsTo(models.users, {
            foreignKey: "createdByUserID"
          });
  
          MAP_TAKEN_MEAL.belongsTo(models.users, {
            foreignKey: "lastUpdatedUserID"
          });
    }  
    return MAP_TAKEN_MEAL;
}
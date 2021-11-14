"use strict";

module.exports = (sequelize, DataTypes) => {
    const MEAL_TAKEN = sequelize.define("mealTaken", {
      mealTakenID: {
            field: "mealTakenID",
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        takenAt:{
          field: "takenAt",
            type: DataTypes.DATE,
        },
        isActive: {
            field: "isActive",
            type: DataTypes.BOOLEAN,
            default: 1
        },        
    },
    {
        tableName: "mealTaken"
    });
   
    MEAL_TAKEN.associate = (models) => {  
        MEAL_TAKEN.belongsTo(models.users, {
            foreignKey: "userID"
         });
         MEAL_TAKEN.belongsTo(models.mealType, {
            foreignKey: "mealTypeID"
          });
          MEAL_TAKEN.belongsTo(models.users, {
            foreignKey: "createdByUserID"
          });
  
          MEAL_TAKEN.belongsTo(models.users, {
            foreignKey: "lastUpdatedUserID"
          });
    }  
    return MEAL_TAKEN;
}
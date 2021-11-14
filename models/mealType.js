"use strict";

module.exports = (sequelize, DataTypes) => {
    const MEAL_TYPE = sequelize.define("mealType", {
        mealTypeID: {
            field: "mealTypeID",
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        name: {
            field: "name",
            type: DataTypes.STRING
        },
        imgUrl: {
            field: "imgUrl",
            type: DataTypes.STRING(4000)
        },
        code: {
            field: "code",
            type: DataTypes.STRING
        },
        isActive: {
            field: "isActive",
            type: DataTypes.BOOLEAN,
            default: 1
        },        
    },
    {
        tableName: "mealType"
    });
    MEAL_TYPE.associate = (models) => {
        
        MEAL_TYPE.belongsTo(models.users, {
          foreignKey: "createdByUserID"
        });

        MEAL_TYPE.belongsTo(models.users, {
          foreignKey: "lastUpdatedUserID"
        });
    };
    return MEAL_TYPE;
}
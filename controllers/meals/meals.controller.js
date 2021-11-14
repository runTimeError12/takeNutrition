var Sequelize = require('sequelize');
const Op = Sequelize.Op;
const models = require("../../models/db");
const conn = require("../../config/conn");
const helper = require('../../helpers/util');
const log = require('../../helpers/logger');
const { imageUpload } = require("../../helpers/file-upload");
const sequelize = conn;

exports.getMeals = async(req, res, next) => {
    //meals refrece 
    //https://www.ars.usda.gov/northeast-area/beltsville-md-bhnrc/beltsville-human-nutrition-research-center/food-surveys-research-group/docs/fndds-download-databases/
    try {
        let querystring = `select mealID,ingredientCode,ingredientDescription,protein,totalFat,carbohydrate,energy from meals;`;
        //carbohydrate,((protein *4) + (total_fat * 9) + (carbohydrate * 4)) as calories,
        sequelize
            .query(querystring, {
                replacements: {},
                type: sequelize.QueryTypes.SELECT
            })
            .then(meals => {
                res.send({
                    status: 200,
                    data: meals,
                    message: "Meals found successfully"
                });
            })
            .catch(err => next(err));
    } catch (e) {
        next(e)
    }
}

exports.addMealType = async(req, res, next) => {
    console.log("addMealType")
    try {

        if (await models.mealType.findOne({ where: { name: req.body.name } })) {
            throw new Error('Meal with name: ' + req.body.name + ' already exist!')
        }

        // var userID = helper.getIdFromToken(req.headers['authorization']);
        var userID = req.body.userID;

        const mealType = {
            mealTypeID: userID,
            name: req.body.name,
            code: req.body.code,
            imgUrl: req.body.imgUrl,
            created_by: userID,
            updated_by: userID,
            isActive: 1
        }

        // console.log("Req, ", req );

        models.mealType.create(mealType)
            .then(mealType => {
                res.send({
                    data: mealType,
                    message: "mealType added succsessfully!"
                })
            })
            .catch(err => {
                res.send({
                    status: 400,
                    message: "Error occured while adding mealType!"
                })
                console.log("Req, ", err);
            })


    } catch (e) {
        next(e);
    }

}

exports.getMealType = async(req, res, next) => {
    try {
        let querystring = `select mealTypeID,name,imgUrl,code,isActive,createdAt,updatedAt,createdByUserID,lastUpdatedUserID from mealType;`;
        sequelize
            .query(querystring, {
                replacements: {},
                type: sequelize.QueryTypes.SELECT
            })
            .then(meals => {
                res.send({
                    status: 200,
                    data: meals,
                    message: "meal type found successfully"
                });
            })
            .catch(err => next(err));
    } catch (e) {
        next(e)
    }
}

exports.getActivityFactor = async(req, res, next) => {

    try {
        let querystring = `select activityFactorID,name from nut_activity_factor where isActive=1;`;
        sequelize
            .query(querystring, {
                replacements: {},
                type: sequelize.QueryTypes.SELECT
            })
            .then(data => {
                res.send({
                    status: 200,
                    data: data,
                    message: "Activity Factor found successfully"
                });
            })
            .catch(err => next(err));
    } catch (e) {
        next(e)
    }
}

exports.takingMeal = async(req, res, next) => {
    console.log("takingMeal")
    console.log(req.body.meals)
    var userID = req.body.userID;
    let transaction;
    try {
        transaction = await sequelize.transaction();
        let mealTaken = {
            userID: Number(userID),
            mealTypeID: Number(req.body.mealTypeID),
            takenAt: (req.body.takenAt),
            createdByUserID: Number(userID),
            lastUpdatedUserID: Number(userID),
            isActive: 1
        }

        console.log(mealTaken);
        await models.mealTaken.create(mealTaken, { transaction }).then(mealTaken => {
                console.log(mealTaken);
                let meals = req.body.meals;
                let mealsArr = [];
                meals.forEach(element => {
                    mealsArr.push({
                        mealTakenID: Number(mealTaken.dataValues.mealTakenID),
                        mealID: Number(element.mealID),
                        mealCount: Number(element.mealCount),
                        createdByUserID: Number(userID),
                        lastUpdatedUserID: Number(userID),
                        isActive: 1
                    })
                })

                models.mealTakenDetails.bulkCreate(mealsArr, { transaction }).then(takenDeatils => {
                    transaction.commit();
                    res.send({
                        status: 200,
                        data: takenDeatils,
                        message: "mealTaken added succsessfully!"
                    })
                }).catch(err => {
                    if (transaction) transaction.rollback();
                    res.send({
                        status: 400,
                        message: "Error occured while adding Meal Taken Details!"
                    })
                    console.log("Req, ", err);
                })
            })
            .catch(err => {
                if (transaction) transaction.rollback();
                res.send({
                    status: 400,
                    message: "Error occured while adding mealTaken!"
                })
                console.log("Req, ", err);
            })


    } catch (e) {
        if (transaction) await transaction.rollback();
        next(e);
    }

}

exports.getMealsStatus = async(req, res, next) => {
    try {

        // var userID = helper.getIdFromToken(req.headers['authorization']);
        let { userID, to, from } = req.query;
        let querystring = `select mt.*,ISNULL(mtn.mealTypeID, 0)isTaken,mtn.takenAt from mealType mt 
                        left join (select * from  mealTaken where userID=:userID and takenAt BETWEEN CAST(:from as DATETIME) and CAST(:to as DATETIME)) mtn on mt.mealTypeID=mtn.mealTypeID;`;
        sequelize
            .query(querystring, {
                replacements: { userID: Number(userID), to, from },
                type: sequelize.QueryTypes.SELECT
            })
            .then((meals) => {
                let ret = [];
                meals.forEach(element => {
                    if (element.mealTypeID != 4) {
                        ret.push(element)
                    } else {

                    }
                })
                console.log(ret);
                res.send({
                    status: 200,
                    data: ret,
                    message: "Meal's status found successfully"
                });
            })
            .catch(err => next(err));
    } catch (e) {
        next(e)
    }
}

exports.nutritionHistory = async(req, res, next) => {
    try {
        // var userID = helper.getIdFromToken(req.headers['authorization']);
        let { userID, to, from } = req.query;
        let querystring = `select CAST(mt.takenAt as DATE) takenAt,SUM(A.mealCount) mealCount,SUM(A.totalCalories) totalCalories from mealTaken mt 
    inner join (select mtd.mealTakenDetailsID,mtd.mealTakenID, mtd.mealCount,(m.energy*mtd.mealCount) totalCalories 
    from mealTakenDetails mtd inner join meals m on mtd.mealID=m.mealID)A
    on mt.mealTakenID=A.mealTakenID
    where mt.userID=:userID and mt.takenAt BETWEEN CAST(:from as DATETIME) and CAST(:to as DATETIME) group by CAST(mt.takenAt as DATE) ORDER BY CAST(mt.takenAt as DATE) DESC`;

        sequelize
            .query(querystring, {
                replacements: { userID: userID, from: from, to: to },
                type: sequelize.QueryTypes.SELECT
            })
            .then(nutritionHistory => {
                res.send({
                    status: 200,
                    data: nutritionHistory,
                    message: "Nutrition History found successfully"
                });
            })
            .catch(err => next(err));
    } catch (e) {
        next(e)
    }
}

exports.getMealsByName = async(req, res, next) => {
    try {
        let { top, ingredientDescription } = req.query;
        let querystring = `select TOP :top mealID,ingredientCode,ingredientDescription,protein,totalFat,carbohydrate,energy from meals
                    where ingredientDescription LIKE :ingredientDescription;`;
        sequelize
            .query(querystring, {
                replacements: { top: Number(top), ingredientDescription: '%' + ingredientDescription + '%' },
                type: sequelize.QueryTypes.SELECT
            })
            .then(meals => {
                res.send({
                    status: 200,
                    data: meals,
                    message: "Meals found successfully"
                });
            })
            .catch(err => next(err));
    } catch (e) {
        next(e)
    }
}

// exports.getTargetCalories = async (req, res, next) =>{
//   try{
//     let {top,ingredientDescription} = req.query;
//     let querystring = `select TOP :top mealID,ingredientCode,ingredientDescription,protein,totalFat,carbohydrate,energy from meals
//                     where ingredientDescription LIKE :ingredientDescription;`;
//         sequelize
//                 .query(querystring, {
//                   replacements: {top:Number(top),ingredientDescription:'%'+ingredientDescription+'%'},
//                   type: sequelize.QueryTypes.SELECT
//                 })
//                 .then(meals => {
//                   res.send({
//                     status: 200,
//                     data: meals,
//                     message:
//                       "Meals found successfully"
//                   });
//                 })
//                 .catch(err => next(err));
//   }catch(e){
//     next(e)
//   }
// }


exports.getMealsData = async(req, res, next) => {
    let { userID, to, from } = req.query;
    try {
        let querystring = `select mealDataID,title,notes,protein,fat,carbs,calories, takenAt, imgUrl from mealData where userID=:userID and takenAt BETWEEN CAST(:from as DATETIME) and CAST(:to as DATETIME) ORDER by (takenAt)  DESC`;
        sequelize
            .query(querystring, {
                replacements: { userID: userID, from: from, to: to },
                type: sequelize.QueryTypes.SELECT
            })
            .then(meals => {
                res.send({
                    status: 200,
                    data: meals,
                    message: "Meals found successfully"
                });
            })
            .catch(err => next(err));
    } catch (e) {
        next(e)
    }
}

exports.addMealData = async(req, res, next) => {
    console.log("addMealData")
    try {

        // if (await models.mealData.findOne({ where: { name: req.body.name } })) {
        //     throw new Error('Meal with name: ' + req.body.title + ' already exist!')
        // }

        var userID = req.body.userID;

        const meal = {
            userID: userID,
            title: req.body.title,
            notes: req.body.notes,
            imgUrl: req.body.imgUrl,
            takenAt: req.body.takenAt,
            protein: req.body.protein,
            fat: req.body.fat,
            carbs: req.body.carbs,
            calories: req.body.calories,
            isActive: 1,
            createdByUserID: userID,
            lastUpdatedUserID: userID
        }

        // console.log("Req, ", req );

        models.mealData.create(meal)
            .then(meal => {
                res.send({
                    status:200,
                    data: meal,
                    message: "Meal Data added succsessfully!"
                })
            })
            .catch(err => {
                res.send({
                    status: 400,
                    message: "Error occured while adding meal data!"
                })
                console.log("Req, ", err);
            })


    } catch (e) {
        next(e);
    }

}


exports.mealHistory = async(req, res, next) => {
    try {
        // var userID = helper.getIdFromToken(req.headers['authorization']);
        let { userID, to, from } = req.query;
        let querystring = `
    select CAST(takenAt as DATE) takenAt, Count(mealDataID) mealCount,SUM(calories) totalCalories from mealData 
    where userID=:userID and takenAt BETWEEN CAST(:from as DATETIME) and CAST(:to as DATETIME) group by CAST(takenAt as DATE) ORDER BY (takenAt) DESC`;

        sequelize
            .query(querystring, {
                replacements: { userID: userID, from: from, to: to },
                type: sequelize.QueryTypes.SELECT
            })
            .then(nutritionHistory => {
                res.send({
                    status: 200,
                    data: nutritionHistory,
                    message: "Nutrition History found successfully"
                });
            })
            .catch(err => next(err));
    } catch (e) {
        next(e)
    }
}

exports.getCalorieIntakeByDateRange = async(req, res, next) => {
    try {
        // var userID = helper.getIdFromToken(req.headers['authorization']);
        let { userID, to, from } = req.query;
        let querystring = `
      select  SUM(calories) todayCalorieIntake from mealData where userID=:userID and takenAt BETWEEN CAST(:from as DATETIME) and CAST(:to as DATETIME)`;

        sequelize
            .query(querystring, {
                replacements: { userID: userID, from: from, to: to },
                type: sequelize.QueryTypes.SELECT
            })
            .then(calorie => {
                res.send({
                    status: 200,
                    data: calorie,
                    message: "Today  Calorie Intake found successfully"
                });
            })
            .catch(err => next(err));
    } catch (e) {
        next(e)
    }
}
const meals = require('./meals.controller');
const express = require('express');
const router = express.Router();
const Joi = require('joi');
const validateRequest = require('../../helpers/validate-requres');
const { verify, isAdmin } = require('../../middlewares/authorize');
const jwt = require('jsonwebtoken');
const multer = require('multer');
const inMemoryStorage = multer.memoryStorage();
const uploadStrategy = multer({ storage: inMemoryStorage }).single('atlasImage');


router.get('/getMeals', verify, meals.getMeals);
router.get('/getMealtype', verify, meals.getMealType);
router.post('/addMealType', verify, meals.addMealType);
router.post('/takingMeal', verify, meals.takingMeal);
router.get('/getMealsStatus', verify, meals.getMealsStatus);
router.get('/nutritionHistory', verify, meals.nutritionHistory);
router.get('/getMealsByName', verify, meals.getMealsByName);
router.get('/getActivityFactor', verify, meals.getActivityFactor);

router.post('/addMealData', verify, meals.addMealData);
router.get('/getMealsData', verify, meals.getMealsData);
router.get('/mealHistory', verify, meals.mealHistory);
router.get('/getCalorieIntakeByDateRange', verify, meals.getCalorieIntakeByDateRange);


module.exports = router;
const express = require('express');
const database = require("../../Database/dbconnection");
const router = express.Router();
const authController = require('../controllers/auth.controller');
const mealController = require('../controllers/meal.controller');

router.post("/api/meal", authController.validateToken, mealController.validateMeal, mealController.addMeal);

router.get("/api/meal", mealController.getAllMeals);

router.get("/api/meal/:mealId", mealController.getMealById);

router.put("/api/meal/:mealId", authController.validateToken, mealController.validateMeal, mealController.updateMeal);

router.delete("/api/meal/:mealId", authController.validateToken, mealController.deleteMeal);

module.exports = router;
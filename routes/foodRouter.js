const express = require("express");
const Food = require("../models/food");
const foodRouter = express.Router();
const authenticate = require("../authenticate");

foodRouter
  .route("/")
  .get((req, res, next) => {
    Food.find()
      .then((foods) => {
        res.StatusCode = 200;
        res.setHeader("Content-Type", "application/json");
        res.json(foods);
      })
      .catch((err) => next(err));
  })
  .post(authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
    Food.create(req.body)
      .then((food) => {
        console.log("Food Created", food);
        res.statusCode = 200;
        res.setHeader("Content-Type", "application/json");
        res.json(food);
      })
      .catch((err) => next(err));
  })
  .put(authenticate.verifyUser, (req, res) => {
    res.statusCode = 403;
    res.end("PUT operation not supported on /food");
  })
  .delete(
    authenticate.verifyUser,
    authenticate.verifyAdmin,
    (req, res, next) => {
      Food.deleteMany()
        .then((response) => {
          res.statusCode = 200;
          res.setHeader("Content-Type", "application/json");
          res.json(response);
        })
        .catch((err) => next(err));
    }
  );

foodRouter
  .route("/:foodItemId")
  .get((req, res, next) => {
    Food.findById(req.params.foodItemId)
      .then((food) => {
        res.statusCode = 200;
        res.setHeader("Content-Type", "application/json");
        res.json(food);
      })
      .catch((err) => next(err));
  })
  .post(authenticate.verifyUser, (req, res) => {
    res.end(`POST operation not supported on /food/${req.params.foodItemId}`);
  })
  .put(authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
    Food.findByIdAndUpdate(
      req.params.foodItemId,
      {
        $set: req.body,
      },
      { new: true }
    )
      .then((food) => {
        res.statusCode = 200;
        res.setHeader("Content-Type", "application/json");
        res.json(food);
      })
      .catch((err) => next(err));
  })
  .delete(
    authenticate.verifyUser,
    authenticate.verifyAdmin,
    (req, res, next) => {
      Food.findByIdAndDelete(req.params.foodItemId)
        .then((response) => {
          res.statusCode = 200;
          res.setHeader("Content-Type", "application/json");
          res.json(response);
        })
        .catch((err) => next(err));
    }
  );

module.exports = foodRouter;

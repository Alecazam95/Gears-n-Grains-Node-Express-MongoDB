const express = require("express");
const Cart = require("../models/cart");
const authenticate = require("../authenticate");
const cors = require("./cors");
const cartRouter = express.Router();

cartRouter
  .route("/")
  .options(cors.corsWithOptions, (req, res) => res.sendStatus(200))
  .get(cors.cors, authenticate.verifyUser, (req, res, next) => {
    Cart.find({ user: req.user._id })
      .populate("user")
      .populate("foods")
      .then((item) => {
        res.statusCode = 200;
        res.setHeader("Content-Type", "application/json");
        res.json(item);
      })
      .catch((err) => next(err));
  })
  .post(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
    // find active userId based on the request
    Cart.findOne({ user: req.user._id }) // find cart item object for the user
      .then((item) => {
        if (item) {
          // if cart item object is found
          req.body.forEach((fav) => {
            //loop through each object in the posted array collection
            if (!item.foods.includes(fav._id)) {
              item.foods.push(fav._id);
            }
          });
          item
            .save()
            .then((item) => {
              res.statusCode = 200;
              res.setHeader("Content-Type", "application/json");
              res.json(item);
            })
            .catch((err) => next(err));
        } else {
          // if user is not found - create cart object
          Cart.create({ user: req.user._id })
            .then((item) => {
              req.body.forEach((cartItem) => {
                if (!item.foods.includes(cartItem._id)) {
                  item.foods.push(cartItem._id);
                }
              });
              item
                .save()
                .then((item) => {
                  res.statusCode = 200;
                  res.setHeader("Content-Type", "application/json");
                  res.json(item);
                })
                .catch((err) => next(err));
            })
            .catch((err) => next(err));
        }
      });
  })
  .put(cors.corsWithOptions, authenticate.verifyUser, (req, res) => {
    res.statusCode = 403;
    res.end(`PUT operation not supported on here`);
  })
  .delete(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
    Cart.findOneAndDelete()
      .then((item) => {
        if (item) {
          res.statusCode = 200;
          res.setHeader("Content-Type", "application/json");
          res.json(item);
        } else {
          res.statusCode = 404;
          res.setHeader("Content-Type", "text/plain");
          res.end("There are no cart items to delete");
        }
      })
      .catch((err) => next(err));
  });

cartRouter
  .route("/:foodId")
  .options(cors.corsWithOptions, (req, res) => res.sendStatus(200))
  .get(cors.cors, (req, res, next) => {
    res.statusCode = 403;
    res.setHeader("Content-Type", "text/plain");
    res.end(`GET operation not supported on /cart/${req.params.foodId}`);
  })
  .post(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
    Cart.findOne({ user: req.user._id })
      .then((item) => {
        if (item) {
          if (!item.foods.includes(req.params.foodId)) {
            item.foods.push(req.params.foodId);
            item
              .save()
              .then((item) => {
                res.statusCode = 200;
                res.setHeader("Content-Type", "application/json");
                res.json(item);
              })
              .catch((err) => next(err));
          } else {
            res.statusCode = 200;
            res.setHeader("Content-Type", "text/plain");
            res.end("That item is already in your cart.");
          }
        } else {
          Cart.create({
            user: req.user._id,
            foods: [req.params.foodId],
          })
            .then((item) => {
              res.statusCode = 200;
              res.setHeader("Content-Type", "application/json");
              res.json(item);
            })
            .catch((err) => next(err));
        }
      })
      .catch((err) => next(err));
  })
  .put(cors.corsWithOptions, authenticate.verifyUser, (req, res) => {
    res.statusCode = 403;
    res.end(`PUT operation not supported on /cart/${req.params.foodId}`);
  })
  .delete(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
    Cart.findOne({ user: req.user._id })
      .then((item) => {
        if (item) {
          item.foods = item.foods.filter(
            (f) => f.toString() !== req.params.foodId
          );
          item
            .save()
            .then((item) => {
              res.statusCode = 200;
              res.setHeader("Content-Type", "application/json");
              res.json(item);
            })
            .catch((err) => next(err));
        } else {
          res.setHeader("Content-Type", "text/plain");
          res.end("There are no items to delete.");
        }
      })
      .catch((err) => next(err));
  });

module.exports = cartRouter;

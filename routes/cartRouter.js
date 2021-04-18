const express = require("express");
const cartRouter = express.Router();

cartRouter
  .route("/")
  .all((req, res, next) => {
    res.statusCode = 200;
    res.setHeader("Content-Type", "text/plain");
    next();
  })
  .get((req, res) => {
    res.end(`Will send all of the cart items to you`);
  })
  .post((req, res) => {
    res.end(
      `Will add the cart: ${req.body.name} with description: ${req.body.description}`
    );
  })
  .put((req, res) => {
    res.statusCode = 403;
    res.end("PUT operation not supported on /cart");
  })
  .delete((req, res) => {
    res.end("Deleting all cart items");
  });

cartRouter
  .route("/:cartItemId")
  .all((req, res, next) => {
    res.statusCode = 200;
    res.setHeader("Content-Type", "text/plain");
    next();
  })
  .get((req, res) => {
    res.end(
      `Will send details of the cart item: ${req.params.cartItemId} to you`
    );
  })
  .post((req, res) => {
    res.end(`Will add item: ${req.params.cartItemId} to cart`);
  })
  .put((req, res) => {
    res.statusCode = 403;
    res.end(
      `Will update the cart item: ${req.body.name} with description: ${req.body.description}`
    );
  })
  .delete((req, res) => {
    res.end(`Deleting cart item: ${req.params.cartItemId}`);
  });

module.exports = cartRouter;

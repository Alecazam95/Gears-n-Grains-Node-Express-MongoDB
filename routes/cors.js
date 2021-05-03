const cors = require("cors");

const whitelist = ["http://localhost:3000", "https://localhost:3443"];
const corsOptionsDelegate = (req, callback) => {
  let corsOptions;
  console.log(req.header("Origin"));
  // Checking if Origin can be found in whitelist (if not -1 it was found) then allowing the true request to be accepted
  if (whitelist.indexOf(req.header("Origin")) !== -1) {
    corsOptions = { origin: true };
  } else {
    corsOptions = { origin: false };
  }
  callback(null, corsOptions);
};

// When we call cors, it will return to us a middleware function configured to set a cors header of accessControlAllowOrigin on a response object with a wildcard as its value - which means it will allow cors for all origins
exports.cors = cors();

// Returns a middlware function and checks if incoming request belongs to one of the whitelisted origins (setup above as localhost:3000 or the other) - if it does it sends back the response header of accesscontrollalloworigin with the whitelisted origin as the value - if it doesn't it doesn't include the cors header at all
exports.corsWithOptions = cors(corsOptionsDelegate);

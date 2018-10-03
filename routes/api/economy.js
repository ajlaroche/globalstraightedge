require("dotenv").config();
const router = require("express").Router();
const request = require("request");
const keys = require("../../keys.js");

const fredAPI = keys.fred.API;

router.route("/unemployment").get(function(req, res) {
  request(
    `https://api.stlouisfed.org/fred/series/observations?series_id=UNRATE&limit=12&frequency=m&sort_order=desc&api_key=${fredAPI}&file_type=json`,
    function(error, response, body) {
      if (!error && response.statusCode === 200) {
        const found = JSON.parse(body);
        res.json(found);
        // console.log(found);
      } else {
        console.log(error);
        found = {};
      }
    }
  );
});

module.exports = router;

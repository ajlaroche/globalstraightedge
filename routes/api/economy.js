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

router.route("/gdp").get(function(req, res) {
  request(
    `https://api.stlouisfed.org/fred/series/observations?series_id=A191RL1Q225SBEA&limit=20&frequency=q&sort_order=desc&api_key=${fredAPI}&file_type=json`,
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

router.route("/cpi").get(function(req, res) {
  request(
    `https://api.stlouisfed.org/fred/series/observations?series_id=CPIAUCSL&units=pc1&limit=12&frequency=m&sort_order=desc&api_key=${fredAPI}&file_type=json`,
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

router.route("/yieldspread").get(function(req, res) {
  request(
    `https://api.stlouisfed.org/fred/series/observations?series_id=T10Y2Y&limit=30&frequency=d&sort_order=desc&api_key=${fredAPI}&file_type=json`,
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

router.route("/wagegrowth").get(function(req, res) {
  request(
    `https://api.stlouisfed.org/fred/series/observations?series_id=AHETPI&units=pc1&limit=12&frequency=m&sort_order=desc&api_key=${fredAPI}&file_type=json`,
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

router.route("/tradebalance").get(function(req, res) {
  request(
    `https://api.stlouisfed.org/fred/series/observations?series_id=NETEXP&limit=20&frequency=q&sort_order=desc&api_key=${fredAPI}&file_type=json`,
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

router.route("/payrolls").get(function(req, res) {
  request(
    `https://api.stlouisfed.org/fred/series/observations?series_id=PAYEMS&units=chg&limit=12&frequency=m&sort_order=desc&api_key=${fredAPI}&file_type=json`,
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

router.route("/consumption").get(function(req, res) {
  request(
    `https://api.stlouisfed.org/fred/series/observations?series_id=PCECC96&limit=80&units=ch1&frequency=q&sort_order=desc&api_key=${fredAPI}&file_type=json`,
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

router.route("/recessions").get(function(req, res) {
  request(
    `https://api.stlouisfed.org/fred/series/observations?series_id=JHDUSRGDPBR&limit=80&frequency=q&sort_order=desc&api_key=${fredAPI}&file_type=json`,
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

require("dotenv").config();
const router = require("express").Router();
const request = require("request");
const keys = require("../../keys.js");

const alphavantageAPI = keys.alphavantage.API;
const fredAPI = keys.fred.API;

router.route("/indexquotes/:dow/:snp/:nas/:btc").get(function(req, res) {
  const dow = req.params.dow;
  const snp = req.params.snp;
  const nas = req.params.nas;
  const btc = req.params.btc;

  request(
    `https://api.iextrading.com/1.0/stock/market/batch?symbols=${snp},${dow},${nas},${btc}&types=quote`,
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

router.route("/forexquotes/:cur1/:cur2").get(function(req, res) {
  const cur1 = req.params.cur1;
  const cur2 = req.params.cur2;

  request(
    `https://www.alphavantage.co/query?function=CURRENCY_EXCHANGE_RATE&from_currency=${cur1}&to_currency=${cur2}&apikey=${alphavantageAPI}`,

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

router.route("/forexdaily/:cur1/:cur2").get(function(req, res) {
  const cur1 = req.params.cur1;
  const cur2 = req.params.cur2;

  request(
    `https://www.alphavantage.co/query?function=FX_DAILY&from_symbol=${cur1}&to_symbol=${cur2}&apikey=${alphavantageAPI}`,

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

router.route("/treasury/:id/:points/:frequency").get(function(req, res) {
  const id = req.params.id;
  const points = req.params.points;
  const frequency = req.params.frequency;

  request(
    `https://api.stlouisfed.org/fred/series/observations?series_id=${id}&limit=${points}&frequency=${frequency}&sort_order=desc&api_key=${fredAPI}&file_type=json`,

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

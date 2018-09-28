const router = require("express").Router();
const request = require("request");

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

router.route("/forexquotes/:currency").get(function(req, res) {
  const currency = req.params.currency;

  request(
    `https://www.alphavantage.co/query?function=CURRENCY_EXCHANGE_RATE&from_currency=${currency}&to_currency=USD&apikey=2A2VMW3LXGTW2WJ3`,
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

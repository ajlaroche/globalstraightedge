const router = require("express").Router();
const request = require("request");

router.route("/indexquotes/:dow/:snp").get(function(req, res) {
  const dow = req.params.dow;
  const snp = req.params.snp;

  request(
    `https://api.iextrading.com/1.0/stock/market/batch?symbols=${snp},${dow}&types=quote`,
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

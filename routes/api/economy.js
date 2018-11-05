require("dotenv").config();
const router = require("express").Router();
const request = require("request");
const keys = require("../../keys.js");
const async = require("async");

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

router.route("/yieldcurve").get(function(req, res) {
  const currentCurve = {
    threeMonth: [],
    twoYear: [],
    tenYear: [],
    thirtyYear: []
  };

  async.waterfall([
    function(done) {
      request(
        `https://api.stlouisfed.org/fred/series/observations?series_id=DTB3&limit=52&frequency=w&sort_order=desc&api_key=${fredAPI}&file_type=json`,
        function(error, response, body) {
          if (!error && response.statusCode === 200) {
            const found = JSON.parse(body);
            currentCurve.threeMonth.push(
              parseFloat(found.observations[1].value),
              parseFloat(found.observations[4].value)
            );
            // console.log(currentCurve);
            // res.json(currentCurve);
            // console.log(found);
            done(null, "one");
          } else {
            console.log(error);
            found = {};
          }
        }
      );
    },
    function(result1, done) {
      request(
        `https://api.stlouisfed.org/fred/series/observations?series_id=DGS2&limit=52&frequency=w&sort_order=desc&api_key=${fredAPI}&file_type=json`,
        function(error, response, body) {
          if (!error && response.statusCode === 200) {
            const found = JSON.parse(body);
            currentCurve.twoYear.push(
              parseFloat(found.observations[1].value),
              parseFloat(found.observations[4].value)
            );
            // console.log(currentCurve);
            done(null, "two");
            // res.json(currentCurve);
            // console.log(found);
          } else {
            console.log(error);
            found = {};
          }
        }
      );
    },
    function(resul2, done) {
      request(
        `https://api.stlouisfed.org/fred/series/observations?series_id=DGS10&limit=52&frequency=w&sort_order=desc&api_key=${fredAPI}&file_type=json`,
        function(error, response, body) {
          if (!error && response.statusCode === 200) {
            const found = JSON.parse(body);
            currentCurve.tenYear.push(
              parseFloat(found.observations[1].value),
              parseFloat(found.observations[4].value)
            );
            // console.log(currentCurve);
            done(null, "three");
            // res.json(currentCurve);
            // console.log(found);
          } else {
            console.log(error);
            found = {};
          }
        }
      );
    },
    function(result3, done) {
      request(
        `https://api.stlouisfed.org/fred/series/observations?series_id=DGS30&limit=52&frequency=w&sort_order=desc&api_key=${fredAPI}&file_type=json`,
        function(error, response, body) {
          if (!error && response.statusCode === 200) {
            const found = JSON.parse(body);
            currentCurve.thirtyYear.push(
              parseFloat(found.observations[1].value),
              parseFloat(found.observations[4].value)
            );
            // console.log(currentCurve);
            done(null, "four");
            res.json(currentCurve);
            // console.log(found);
          } else {
            console.log(error);
            found = {};
          }
        }
      );
    }
  ]);

  router.route("/houseprice").get(function(req, res) {
    request(
      `https://api.stlouisfed.org/fred/series/observations?series_id=USSTHPI&limit=80&units=pc1&frequency=q&sort_order=desc&api_key=${fredAPI}&file_type=json`,
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

  router.route("/housingstarts").get(function(req, res) {
    request(
      `https://api.stlouisfed.org/fred/series/observations?series_id=HOUST&limit=120&frequency=m&sort_order=desc&api_key=${fredAPI}&file_type=json`,
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
});

module.exports = router;

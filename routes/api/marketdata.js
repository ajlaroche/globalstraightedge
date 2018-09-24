const router = require("express").Router();
const request = require("request");

router.route("/indexquotes").get(function(req, res) {
  console.log("made to router");

  // request("https://financialmodelingprep.com/api/majors-indexes", function(
  //   error,
  //   response,
  //   body
  // ) {
  //   if (!error && response.statusCode === 200) {
  //     const found = JSON.parse(body);
  //     res.json(found);
  //     console.log(found);
  //   } else {
  //     console.log(error);
  //     found = {};
  //   }
  // });
});

module.exports = router;

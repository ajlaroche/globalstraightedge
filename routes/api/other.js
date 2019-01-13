require("dotenv").config();
const axios = require("axios");
const router = require("express").Router();
const request = require("request");
const keys = require("../../keys.js");
const http = require("http");

const lendingClubAPI = keys.lendingClub.API;

router.route("/lcsummary").get(function(req, res) {
  request(
    {
      url:
        "https://api.lendingclub.com/api/investor/v1/accounts/372299/summary",
      headers: { Authorization: lendingClubAPI }
    },
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

// get daily lending club record
request(
  {
    url: "https://api.lendingclub.com/api/investor/v1/accounts/372299/summary",
    headers: { Authorization: lendingClubAPI }
  },
  function(error, response, body) {
    if (!error && response.statusCode === 200) {
      const found = JSON.parse(body);
      // res.json(found);
      console.log(found);
      // testAxios();
    } else {
      console.log(error);
      found = {};
    }
  }
);

function testAxios() {
  // axios
  //   .get("/api/lcsummaryrecord")
  //   .then(function(response) {
  //     console.log(response);
  //   })
  //   .catch(function(error) {
  //     // console.log(error);
  //   });
  http
    .request("api/lcsummaryrecord", resp => {
      // let data = '';

      // A chunk of data has been recieved.
      resp.on("data", chunk => {
        console.log("got something back");
      });

      // The whole response has been received. Print out the result.
      resp.on("end", () => {
        console.log("Connection closed");
      });
    })
    .on("error", err => {
      console.log("Error: " + err.message);
    });
}

module.exports = router;

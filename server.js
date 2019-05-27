const express = require("express");
const PORT = process.env.PORT || 3001;
const app = express();
const path = require("path");
const mongoose = require("mongoose");
const logger = require("morgan");
const routes = require("./routes");
const sslRedirect = require("heroku-ssl-redirect"); // Forces all connection to go through https, requires paid heroku

app.use(logger("dev"));

app.use(sslRedirect());

// Connect to the Mongo DB
mongoose
  .connect(
    process.env.MONGODB_URI || "mongodb://localhost/globalstraightedge",
    { useNewUrlParser: true }
  )
  .then(() => console.log("MongoDB Connected"))
  .catch(err => console.log(err));

// Define middleware here
app.use(express.json()); //Replaces body-parser in latest version of express

// Serve up static assets (usually on heroku)
if (process.env.NODE_ENV === "production") {
  app.use(express.static("client/build"));
}

// Define API routes here
app.use(routes);

// Send every request to the React app
// Define any API routes before this runs
app.get("*", function(req, res) {
  res.sendFile(path.join(__dirname, "./client/build/index.html"));
});

app.listen(PORT, function() {
  console.log(`🌎 ==> Server now on port ${PORT}!`);
});

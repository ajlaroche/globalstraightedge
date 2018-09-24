const express = require("express");
const PORT = process.env.PORT || 3001;
const app = express();
const path = require("path");
const logger = require("morgan");
const routes = require("./routes");

app.use(logger("dev"));

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

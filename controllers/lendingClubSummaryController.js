const db = require("../models");

// Defining methods for the lendingClubSummaryController
module.exports = {
  findAll: function(req, res) {
    console.log("MADE IT TO THE CONTROLLER!!!");
    db.LendingClubSummary.find(req.query)
      .sort({ date: -1 })
      .then(dbModel => res.json(dbModel))
      .catch(err => res.status(422).json(err));
  },
  findById: function(req, res) {
    db.LendingClubSummary.findById(req.params.id)
      .then(dbModel => res.json(dbModel))
      .catch(err => res.status(422).json(err));
  },
  create: function(req, res) {
    console.log("MADE IT TO THE CONTROLLER!!!");
    // db.LendingClubSummary.create(req.body)
    //   .then(dbModel => {
    //     console.log("LendingClubSummary saved");
    //     res.json(dbModel);
    //   })
    //   .catch(err => {
    //     console.log(err);
    //     res.status(422).json(err);
    //   });
  },
  update: function(req, res) {
    db.LendingClubSummary.findOneAndUpdate({ _id: req.params.id }, req.body)
      .then(dbModel => res.json(dbModel))
      .catch(err => res.status(422).json(err));
  },
  remove: function(req, res) {
    db.LendingClubSummary.findById({ _id: req.params.id })
      .then(dbModel => dbModel.remove())
      .then(dbModel => res.json(dbModel))
      .catch(err => res.status(422).json(err));
  }
};

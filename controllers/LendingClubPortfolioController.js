const db = require("../models");

// Defining methods for the lendingClubPortfolioController
module.exports = {
  findAll: function(req, res) {
    db.LendingClubPortfolio.find(req.query)
      .sort({ date: -1 })
      .then(dbModel => res.json(dbModel))
      .catch(err => res.status(422).json(err));
  },
  findById: function(req, res) {
    db.LendingClubPortfolio.findById(req.params.id)
      .then(dbModel => res.json(dbModel))
      .catch(err => res.status(422).json(err));
  },
  create: function(req, res) {
    db.LendingClubPortfolio.create(req.body)
      .then(dbModel => {
        console.log("LendingClubPortfolio saved");
        res.json(dbModel);
      })
      .catch(err => {
        console.log(err);
        res.status(422).json(err);
      });
  },
  update: function(req, res) {
    db.LendingClubPortfolio.findOneAndUpdate({ _id: req.params.id }, req.body)
      .then(dbModel => res.json(dbModel))
      .catch(err => res.status(422).json(err));
  },
  remove: function(req, res) {
    db.LendingClubPortfolio.findById({ _id: req.params.id })
      .then(dbModel => dbModel.remove())
      .then(dbModel => res.json(dbModel))
      .catch(err => res.status(422).json(err));
  },

  findGrade: function(req, res) {
    const noteGrade = [
      `${req.params.grade}1`,
      `${req.params.grade}2`,
      `${req.params.grade}3`,
      `${req.params.grade}4`,
      `${req.params.grade}5`
    ];
    // console.log(noteGrade);
    db.LendingClubPortfolio.find({
      grade: { $in: noteGrade }
    })
      .sort({ date: -1 })
      .then(dbModel => res.json(dbModel))
      .catch(err => res.status(422).json(err));
  }
};

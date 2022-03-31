const Model = require("../models/model").Model;

const getReminder = (req, res) => {
  new Model("loan")
    .select(`*`, "", [], [])
    .then((loans) => {
      loans = loans.rows;
      new Model("reminder")
        .select(`*`, "", [parseInt(req.params.id)], ["WHERE id = $1"])
        .then((reminder_data) => {
          if (reminder_data.rowCount > 0) {
            reminder_data.rows.forEach((reminder) => {
              const loan = loans.find((loan) => loan.id == reminder.loan);
              reminder.loan = loan;
            });
            res
              .status(200)
              .json({ success: true, data: reminder_data.rows[0] });
          } else {
            res.status(200).json({ success: true, data: [] });
          }
        })
        .catch((error) => {
          console.log(error);
        });
    })
    .catch((error) => {
      console.log(error);
    });
};

const getReminders = (req, res) => {
  new Model("loan")
    .select(`*`, "", [], [])
    .then((loans) => {
      loans = loans.rows;
      new Model("reminder")
        .select(`*`, "", [], [])
        .then((reminder_data) => {
          if (reminder_data.rowCount > 0) {
            reminder_data.rows.forEach((reminder) => {
              const loan = loans.find((loan) => loan.id == reminder.loan);
              reminder.loan = loan;
            });
            res.status(200).json({ success: true, data: reminder_data.rows });
          } else {
            res.status(200).json({ success: true, data: [] });
          }
        })
        .catch((error) => {
          console.log(error);
        });
    })
    .catch((error) => {
      console.log(error);
    });
};

module.exports = {
  getReminder,
  getReminders,
};

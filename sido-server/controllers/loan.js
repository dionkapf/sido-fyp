const Model = require("../models/model").Model;

const getLoan = (req, res) => {
  new Model("loan")
    .select(`*`, "", [parseInt(req.params.id)], ["WHERE id = $1"])
    .then((loan_data) => {
      if (loan_data.rowCount > 0) {
        loan = loan_data.rows[0];
        loan.request_id = loan.request;
        loan.witness_1_id = loan.witness_1;
        loan.witness_2_id = loan.witness_2;
        loan.staff_id = loan.staff;
        delete loan.request;
        delete loan.witness_1;
        delete loan.witness_2;
        delete loan.staff;
        res.status(200).json({ success: true, data: loan });
      } else {
        res.status(200).json({ success: true, data: [] });
      }
    })
    .catch((error) => {
      console.log(error);
    });
};

const getLoans = (req, res) => {
  new Model("loan")
    .select(`*`, "", [], [])
    .then((loan_data) => {
      if (loan_data.rowCount > 0) {
        loans = loan_data.rows;
        loans.forEach((loan) => {
          loan.request_id = loan.request;
          loan.witness_1_id = loan.witness_1;
          loan.witness_2_id = loan.witness_2;
          loan.staff_id = loan.staff;
          delete loan.request;
          delete loan.witness_1;
          delete loan.witness_2;
          delete loan.staff;
        });
        if (req.query.count !== undefined) {
          const count = loans.length;
          console.log("Count", count);
          res.status(200).json({ success: true, data: count });
          return;
        }
        res.status(200).json({ success: true, data: loans });
      } else {
        res.status(200).json({ success: true, data: [] });
      }
    })
    .catch((error) => {
      console.log(error);
    });
};

module.exports = {
  getLoan,
  getLoans,
};

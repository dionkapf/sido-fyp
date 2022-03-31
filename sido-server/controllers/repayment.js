const Model = require("../models/model").Model;

const getRepayment = (req, res) => {
  new Model("repayment")
    .select(`*`, "", [parseInt(req.params.id)], ["WHERE id = $1"])
    .then((repayment_data) => {
      if (repayment_data.rowCount > 0) {
        res.status(200).json({ success: true, data: repayment_data.rows[0] });
      } else {
        res.status(200).json({ success: true, data: [] });
      }
    })
    .catch((error) => {
      console.log(error);
    });
};

const getRepayments = (req, res) => {
  new Model("repayment")
    .select(`*`, "", [], [])
    .then((repayment_data) => {
      if (repayment_data.rowCount > 0) {
        res.status(200).json({ success: true, data: repayment_data.rows });
      } else {
        res.status(200).json({ success: true, data: [] });
      }
    })
    .catch((error) => {
      console.log(error);
    });
};

module.exports = {
  getRepayment,
  getRepayments,
};

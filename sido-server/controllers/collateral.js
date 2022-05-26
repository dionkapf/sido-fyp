const Model = require("../models/model").Model;
const { getStaff } = require("./staff");

const getCollateral = (req, res) => {
  new Model("collateral")
    .select(
      `collateral.id AS id, collateral.name AS name, collateral.type AS type,collateral.value AS value, collateral.verified_status AS status, collateral.verified_worth AS worth, collateral.staff AS staff_id`,
      "",
      [parseInt(req.params.id)],
      ["WHERE id = $1"]
    )
    .then((collateral_data) => {
      if (collateral_data.rowCount > 0) {
        console.log(collateral_data.rows[0]);
        res.status(200).json({ success: true, data: collateral_data.rows[0] });
      } else {
        res.status(200).json({ success: true, data: [] });
      }
    })
    .catch((error) => {
      console.log(error);
    });
};

const getCollaterals = (req, res) => {
  new Model("collateral")
    .select(
      `collateral.id AS id, collateral.name AS name, collateral.type AS type,collateral.value AS value, collateral.verified_status AS status, collateral.verified_worth AS worth, collateral.staff AS staff_id`,
      "",
      [],
      []
    )
    .then((collateral_data) => {
      if (collateral_data.rowCount > 0) {
        res.status(200).json({ success: true, data: collateral_data.rows });
      } else {
        res.status(200).json({ success: true, data: [] });
      }
    })
    .catch((error) => {
      console.log(error);
    });
};

const createCollateral = (req, res) => {
  const { loan_request, name, type, worth } = req.body;
  const value = worth;
  new Model("collateral")
    .insert(
      [`loan_request`, `name`, `type`, `value`],
      [loan_request, name, type, value]
    )
    .then((collateral_data) => {
      res.status(200).json({ success: true, data: collateral_data.rows });
    })
    .catch((error) => {
      console.log(error);
    });
};

module.exports = {
  getCollateral,
  getCollaterals,
  createCollateral,
};

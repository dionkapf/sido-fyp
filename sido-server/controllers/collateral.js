const Model = require("../models/model").Model;
const { getStaff } = require("./staff");

const getCollateral = (req, res) => {
  new Model("collateral")
    .select(
      `collateral.id AS id, collateral.name AS name, collateral.type AS type,collateral.value AS value, collateral.type AS type, collateral.verified_status AS status, collateral.verified_worth AS worth, collateral.staff AS staff`,
      "",
      [parseInt(req.params.id)],
      ["WHERE id = $1"]
    )
    .then((collateral_data) => {
      console.log(collateral_data);
      if (collateral_data.rowCount > 0 && collateral_data.rows[0].staff) {
        req.params.id = collateral_data.rows[0].staff;
        getStaff(req, res).then((staff_data) => {
          console.log(staff_data);
          collateral_data.rows[0].staff = staff_data.rows[0];
          res.status(200).json({ success: true, data: collateral_data.rows[0] });
        });
      } else {
        res.status(200).json({ success: true, data: collateral_data.rows[0] });
      }
    })
    .catch((error) => {
      console.log(error);
    });
};

const getCollaterals = (req, res) => {
  new Model("collateral")
    .select(
      `collateral.id AS id, collateral.name AS name, collateral.type AS type,collateral.value AS value, collateral.type AS type, collateral.verified_status AS status, collateral.verified_worth AS worth, collateral.staff AS staff`,
      "",
      [],
      []
    )
    .then((collateral_data) => {
      console.log(collateral_data);
      if (collateral_data.rows[0].status) {
        req.params.id = collateral_data.rows[0].staff;
        getStaff(req, res).then((staff_data) => {
          console.log(staff_data);
          for (let i = 0; i < collateral_data.rowCount; i++) {
            const element = collateral_data.rows[i];
            element.staff = staff_data.rows[i];
          }
          res.status(200).json({ success: true, data: collateral_data.rows });
        });
      } else {
        for (let i = 0; i < collateral_data.rowCount; i++) {
          const element = collateral_data.rows[i];
          element.staff = [];
        }
        res.status(200).json({ success: true, data: collateral_data.rows });
      }
    })
    .catch((error) => {
      console.log(error);
    });
};

module.exports = {
  getCollateral,
  getCollaterals,
};

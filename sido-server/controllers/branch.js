const Model = require("../models/model").Model;

const generateDateColumn = (date, column_name = "") => {
  return ` TO_CHAR(${date} :: DATE, 'yyyy') AS ${column_name}`;
};

const getBranch = (req, res) => {
  new Model("branch")
    .select(
      `branch.id AS id, branch.name AS name, region.name AS region`,
      "",
      [parseInt(req.params.id)],
      ["INNER JOIN region ON region.id = branch.region AND branch.id = $1"]
    )
    .then((branch_data) => {
      if (branch_data.rowCount > 0) {
        res.status(200).json({ success: true, data: branch_data.rows[0] });
      } else {
        res.status(200).json({ success: true, data: [] });
      }
    })
    .catch((error) => {
      console.log(error);
    });
};

const getBranches = (req, res) => {
  new Model("branch")
    .select(
      `branch.id AS id, branch.name AS name, region.name AS region`,
      "",
      [],
      ["INNER JOIN region ON region.id = branch.region"]
    )
    .then((branch_data) => {
      if (branch_data.rowCount > 0) {
        res.status(200).json({ success: true, data: branch_data.rows });
      } else {
        res.status(200).json({ success: true, data: [] });
      }
    })
    .catch((error) => {
      console.log(error);
    });
};

module.exports = {
  getBranch,
  getBranches,
};

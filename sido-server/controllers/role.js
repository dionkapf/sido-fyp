const Model = require("../models/model").Model;

const generateDateColumn = (date, column_name, date_format = "yyyy-mm-dd") => {
  return ` TO_CHAR(${date} :: DATE, ${date_format}) AS ${column_name}`;
};

const getRole = (req, res) => {
  new Model("role")
    .select(
      `role.id AS id, role.name AS name`,
      "",
      [parseInt(req.params.id)],
      ["WHERE id = $1"]
    )
    .then((role_data) => {
      res.status(200).json({ success: true, data: role_data.rows });
    })
    .catch((error) => {
      console.log(error);
    });
};

const getRoles = (req, res) => {
  new Model("role")
    .select(`role.id AS id, role.name AS name`, "", [], [])
    .then((role_data) => {
      res.status(200).json({ success: true, data: role_data.rows });
    })
    .catch((error) => {
      console.log(error);
    });
};

module.exports = {
  getRole,
  getRoles,
};

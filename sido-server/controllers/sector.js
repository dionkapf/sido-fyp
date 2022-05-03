const Model = require("../models/model").Model;

const generateDateColumn = (date, column_name, date_format = "yyyy-mm-dd") => {
  return ` TO_CHAR(${date} :: DATE, ${date_format}) AS ${column_name}`;
};

const getSector = (req, res) => {
  new Model("sector")
    .select(
      `sector.id AS id, sector.name AS name`,
      "",
      [parseInt(req.params.id)],
      ["WHERE id = $1"]
    )
    .then((sector_data) => {
      res.status(200).json({ success: true, data: sector_data.rows[0] });
    })
    .catch((error) => {
      console.log(error);
    });
};

const getSectors = (req, res) => {
  new Model("sector")
    .select(`sector.id AS id, sector.name AS name`, "", [], [])
    .then((sector_data) => {
      res.status(200).json({ success: true, data: sector_data.rows });
    })
    .catch((error) => {
      console.log(error);
    });
};

module.exports = {
  getSector,
  getSectors,
};

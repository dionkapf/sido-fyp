const Model = require("../models/model").Model;

const generateDateColumn = (date, column_name, date_format = "yyyy-mm-dd") => {
  return ` TO_CHAR(${date} :: DATE, ${date_format}) AS ${column_name}`;
};

const getRegion = (req, res) => {
  new Model("region")
    .select(
      `region.id AS id, region.name AS name`,
      "",
      [parseInt(req.params.id)],
      ["WHERE id = $1"]
    )
    .then((region_data) => {
      res.status(200).json({ success: true, data: region_data.rows });
    })
    .catch((error) => {
      console.log(error);
    });
};

const getRegions = (req, res) => {
  new Model("region")
    .select(`region.id AS id, region.name AS name`, "", [], [])
    .then((region_data) => {
      res.status(200).json({ success: true, data: region_data.rows });
    })
    .catch((error) => {
      console.log(error);
    });
};

module.exports = {
  getRegion,
  getRegions,
};

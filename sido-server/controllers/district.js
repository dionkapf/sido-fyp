const Model = require("../models/model").Model;

const generateDateColumn = (date, column_name = "") => {
  return ` TO_CHAR(${date} :: DATE, 'yyyy') AS ${column_name}`;
};

const getDistrict = (req, res) => {
  new Model("district")
    .select(
      `district.id AS id, district.name AS name, region.name AS region`,
      "",
      [parseInt(req.params.id)],
      ["INNER JOIN region ON region.id = district.region AND district.id = $1"]
    )
    .then((district_data) => {
      if (district_data.rowCount > 0) {
        res.status(200).json({ success: true, data: district_data.rows[0] });
      } else {
        res.status(200).json({ success: true, data: [] });
      }
    })
    .catch((error) => {
      console.log(error);
    });
};

const getDistricts = (req, res) => {
  new Model("district")
    .select(
      `district.id AS id, district.name AS name, region.name AS region`,
      "",
      [],
      ["INNER JOIN region ON region.id = district.region"]
    )
    .then((district_data) => {
      if (district_data.rowCount > 0) {
        res.status(200).json({ success: true, data: district_data.rows });
      } else {
        res.status(200).json({ success: true, data: [] });
      }
    })
    .catch((error) => {
      console.log(error);
    });
};

module.exports = {
  getDistrict,
  getDistricts,
};

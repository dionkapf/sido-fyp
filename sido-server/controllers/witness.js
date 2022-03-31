const Model = require("../models/model").Model;

const getWitness = (req, res) => {
  new Model("witness")
    .select(`*`, "", [parseInt(req.params.id)], ["WHERE id = $1"])
    .then((witness_data) => {
      if (witness_data.rowCount > 0) {
        res.status(200).json({ success: true, data: witness_data.rows[0] });
      } else {
        res.status(200).json({ success: true, data: [] });
      }
    })
    .catch((error) => {
      console.log(error);
    });
};

const getWitnesses = (req, res) => {
  new Model("witness")
    .select(`*`, "", [], [])
    .then((witness_data) => {
      if (witness_data.rowCount > 0) {
        res.status(200).json({ success: true, data: witness_data.rows });
      } else {
        res.status(200).json({ success: true, data: [] });
      }
    })
    .catch((error) => {
      console.log(error);
    });
};

module.exports = {
  getWitness,
  getWitnesses,
};

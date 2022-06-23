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

const createWitness = (req, res) => {
  const {
    first_name,
    middle_name,
    last_name,
    birthdate,
    phone_number,
    email,
    sex,
  } = req.body;
  let columns = [];
  let values = [];
  if (middle_name) {
    columns = [
      `first_name`,
      `middle_name`,
      `last_name`,
      `birthdate`,
      `phone_number`,
      `email`,
      `sex`,
    ];
    values = [
      first_name,
      middle_name,
      last_name,
      birthdate,
      phone_number,
      email,
      sex,
    ];
  } else {
    columns = [
      `first_name`,
      `last_name`,
      `birthdate`,
      `phone_number`,
      `email`,
      `sex`,
    ];
    values = [first_name, last_name, birthdate, phone_number, email, sex];
  }
  new Model(`witness`)
    .insert(columns, values)
    .then((witness_data) => {
      console.log("Insertion successful");
      res.status(201).json({
        success: true,
        message: "Witness created",
        data: witness_data.rows[0],
      });
    })
    .catch((error) => {
      console.log(error);
    });
};
module.exports = {
  getWitness,
  getWitnesses,
  createWitness
};

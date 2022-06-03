const Model = require("../models/model").Model;

const getOwner = (req, res) => {
  new Model("sector").select(`*`, "", [], []).then((sectors) => {
    sectors = sectors.rows;
    new Model("owner")
      .select(
        `
      id,
      user_id,
      first_name,
      middle_name,
      last_name,
      birthdate,
      email,
      phone_number,
      business_name,
      business_type,
      sex,
      sector,
      formalized,
      address
      `,
        "",
        [parseInt(req.params.id)],
        ["WHERE id = $1"]
      )
      .then((owner_data) => {
        if (owner_data.rowCount > 0) {
          owner_data.rows.forEach((owner) => {
            const sector = sectors.find((sector) => sector.id == owner.sector);
            owner.sector_id = owner.sector;
            delete owner.sector;
          });
          res.status(200).json({ success: true, data: owner_data.rows[0] });
        } else {
          res.status(200).json({ success: true, data: [] });
        }
      })
      .catch((error) => {
        console.log(error);
      });
  });
};

const getOwners = (req, res) => {
  new Model("sector").select(`*`, "", [], []).then((sectors) => {
    sectors = sectors.rows;
    new Model("owner")
      .select(
        `
      id,
      user_id,
      first_name,
      middle_name,
      last_name,
      birthdate,
      email,
      phone_number,
      business_name,
      business_type,
      sex,
      sector,
      formalized,
      address
      `,
        "",
        [],
        []
      )
      .then((owner_data) => {
        if (req.query.count !== undefined) {
          const count = owner_data.rows.length;
          console.log("Count", count);
          res.status(200).json({ success: true, data: count });
          return;
        }
        if (owner_data.rowCount > 0) {
          owner_data.rows.forEach((owner) => {
            const sector = sectors.find((sector) => sector.id == owner.sector);
            owner.sector_id = owner.sector;
            delete owner.sector;
          });
          res.status(200).json({ success: true, data: owner_data.rows });
        } else {
          res.status(200).json({ success: true, data: [] });
        }
      })
      .catch((error) => {
        console.log(error);
      });
  });
};

const getOwnerByUserId = async (id) => {
  const sectors = await (
    await new Model("sector").select(`*`, "", [], [])
  ).rows;
  const owners = await await new Model("owner").select(
    `
    id,
    first_name,
    middle_name,
    last_name,
    birthdate,
    email,
    phone_number,
    business_name,
    business_type,
    sex,
    sector,
    formalized,
    address
    `,
    "",
    [parseInt(id)],
    ["WHERE user_id = $1"]
  );
  if (owners.rowCount > 0) {
    owners.rows.forEach((owner) => {
      const sector = sectors.find((sector) => sector.id == owner.sector);
      owner.sector_id = owner.sector;
      owner.sector = sector.name;
    });
    return owners.rows[0];
  } else {
    return null;
  }
};

const createOwner = (req, res) => {
  const {
    userId,
    firstName,
    middleName,
    lastName,
    birthdate,
    email,
    phoneNumber,
    businessName,
    businessType,
    sex,
    sector,
    formalized,
    address,
  } = req.body;
  new Model(`owner`)
    .insert(
      [
        `user_id`,
        `first_name`,
        `middle_name`,
        `last_name`,
        `birthdate`,
        `email`,
        `phone_number`,
        `business_name`,
        `business_type`,
        `sex`,
        `sector`,
        `formalized`,
        `address`,
      ],
      [
        parseInt(userId),
        firstName,
        middleName,
        lastName,
        birthdate,
        email,
        phoneNumber,
        businessName,
        businessType,
        sex,
        parseInt(sector),
        formalized,
        address,
      ]
    )
    .then((user_data) => {
      console.log("Insertion successful");
      res.status(201).json({
        success: true,
        message: "Owner created",
        user: user_data.rows[0],
      });
    })
    .catch((error) => {
      console.log(error);
    });
};
module.exports = {
  getOwner,
  getOwners,
  getOwnerByUserId,
  getOwnerByUserId: getOwnerByUserId,
  createOwner,
};

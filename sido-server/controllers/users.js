const Model = require("../models/model").Model;

const getUser = (req, res) => {
  new Model("user")
    .select(
      `user.id AS id, user.name AS name, user.password AS password`,
      "",
      [parseInt(req.params.id)],
      ["WHERE id = $1"]
    )
    .then((user_data) => {
      res.status(200).json({ success: true, data: user_data.rows });
    })
    .catch((error) => {
      console.log(error);
    });
};

const createUser = (user) => {
  console.log("Inserting...");
  const { username, password } = user;
  if (!(username && password)) {
    res.status(400).json({ success: false, message: "Missing fields" });
  } else {
    new Model(`"user"`)
      .insert([`name`, `password`], [username, password])
      .then((user_data) => {
        console.log("Insertion successful");
        return user_data;
      })
      .catch((error) => {
        console.log(error);
      });
  }
};

const getUsers = (req, res) => {
  new Model("user")
    .select(
      `user.id AS id, user.name AS name, user.password AS password`,
      "",
      [],
      []
    )
    .then((user_data) => {
      res.status(200).json({ success: false, data: user_data.rows });
    })
    .catch((error) => {
      console.log(error);
    });
};

module.exports = {
  getUser,
  getUsers,
  createUser,
};

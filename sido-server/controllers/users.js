const { getOwnerByUserId } = require("./owner");
const { getStaffByUserId } = require("./staff");

const Model = require("../models/model").Model;
const USER_ROLE = {
  ADMIN: 1,
  FINANCE: 2,
  TRAINING: 3,
  LOAN: 4,
  BUSINESS: 5,
  USER: 6,
};

const getUserDetails = async (id, role) => {
  let user = "";
  if (role === USER_ROLE.ADMIN) {
    return {
      first_name: "Administrator",
    };
  } else if (
    role === USER_ROLE.FINANCE ||
    role === USER_ROLE.LOAN ||
    role === USER_ROLE.TRAINING ||
    role === USER_ROLE.BUSINESS
  ) {
    await getStaffByUserId(id).then((staff_data) => {
      user = staff_data;
    });
  } else {
    user = await getOwnerByUserId(id);
  }
  return user;
};

const getUser = (req, res) => {
  new Model(`"user"`)
    .select(
      `"user".id AS id, "user".name AS name, "user".password AS password, "user".role AS role`,
      "",
      [parseInt(req.params.id)],
      ["WHERE id = $1"]
    )
    .then(async (user_data) => {
      const user = await getUserDetails(req.params.id, user_data.rows[0].role);
      console.log("User: ", user);
      console.log("User data: ", user_data.rows);
      const data = {
        ...user_data.rows[0],
        ...user,
      };
      res.status(200).json({ success: true, data });
    })
    .catch((error) => {
      console.log(error);
    });
};

const createUser = (user) => {
  console.log("Inserting...");
  const { username, password } = user;
  let { role } = user;
  if (!role) role = USER_ROLE.USER;
  if (!(username && password)) {
    res.status(400).json({ success: false, message: "Missing fields" });
  } else {
    new Model(`"user"`)
      .insert(
        [`name`, `password`, `role`],
        [username, password, parseInt(role)]
      )
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
  new Model(`"user"`)
    .select(
      `"user".id AS id, "user".name AS name, "user".password AS password`,
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
  getUserDetails,
  USER_ROLE,
};

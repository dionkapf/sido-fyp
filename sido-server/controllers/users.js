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
    await getStaffByUserId(id).then(async (staff_data) => {
      console.log("Staff data: ", staff_data);
      const [roles, branches] = await Promise.all([
        new Model(`"role"`).select(
          `"role".name AS name`,
          "",
          [role],
          ["WHERE id = $1"]
        ),
        new Model(`"branch"`).select(
          `"branch".name AS name`,
          "",
          [staff_data.branch],
          ["WHERE id = $1"]
        ),
      ]);
      const role_name = roles.rows[0].name;
      const branch_name = branches.rows[0].name;
      user = {
        role_name,
        branch_name,
        ...staff_data,
      };
    });
  } else {
    user = await getOwnerByUserId(id);
    console.log("Owner: ", user);
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
    return new Model(`"user"`)
      .insert(
        [`name`, `password`, `role`],
        [username, password, parseInt(role)]
      )
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
      if (req.query.count !== undefined) {
        const count = user_data.rows.length;
        console.log("Count", count);
        res.status(200).json({ success: true, data: count });
        return;
      }
      res.status(200).json({ success: false, data: user_data.rows });
    })
    .catch((error) => {
      console.log(error);
    });
};

const getOperators = async (req, res) => {
  let query = [4, 5];
  let values = "WHERE role=$1 OR role=$2";
  if (req.query.role !== undefined) {
    query = [parseInt(req.query.role)];
    values = "WHERE role=$1";
  }

  const users = await new Model(`"user"`).select(
    `"user".id AS id, "user".name AS name, "user".role AS role`,
    "",
    query,
    [values]
  );
  if (req.query.count !== undefined) {
    if (req.query.role !== undefined) {
      count = users.rows.filter((staff) => staff.role == req.query.role).length;
    } else {
      count = users.rows.length;
    }
    console.log("Count", count);
    res.status(200).json({ success: true, data: count });
    return;
  }
  const user_details_promise = await users.rows.map(async (user) => {
    return await getUserDetails(user.id, user.role);
  });
  const user_details = await Promise.all(user_details_promise);
  console.log("User details: ", user_details);
  const data = users.rows.map((user, index) => {
    return {
      ...user,
      ...user_details[index],
    };
  });
  res.status(200).json({ success: true, data });
};

const getExecutives = async (req, res) => {
  const users = await new Model(`"user"`).select(
    `"user".id AS id, "user".name AS name, "user".role AS role`,
    "",
    [2, 3],
    ["WHERE role=$1 OR role=$2"]
  );
  if (req.query.count !== undefined) {
    if (req.query.role !== undefined) {
      count = users.rows.filter((staff) => staff.role == req.query.role).length;
    } else {
      count = users.rows.length;
    }
    console.log("Count", count);
    res.status(200).json({ success: true, data: count });
    return;
  }
  const user_details_promise = await users.rows.map(async (user) => {
    return await getUserDetails(user.id, user.role);
  });
  const user_details = await Promise.all(user_details_promise);
  console.log("User details: ", user_details);
  const data = users.rows.map((user, index) => {
    return {
      ...user,
      ...user_details[index],
    };
  });
  res.status(200).json({ success: true, data });
};

const checkUsernameAvailability = async (req, res) => {
  new Model(`"user"`)
    .select(`"user".name AS name`, "", [], [])
    .then((user_data) => {
      const user_names = user_data.rows.map((user) => user.name);
      console.log("User names: ", user_names);
      console.log("Username: ", req.params.username);
      if (user_names.includes(req.params.username)) {
        res
          .status(200)
          .json({ success: false, message: "Username already taken" });
      } else {
        res.status(200).json({ success: true });
      }
    });
};

module.exports = {
  checkUsernameAvailability,
  getUser,
  getUsers,
  getExecutives,
  getOperators,
  createUser,
  getUserDetails,
  USER_ROLE,
};

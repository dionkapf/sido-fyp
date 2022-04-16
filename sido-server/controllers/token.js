const Model = require("../models/model").Model;

const getToken = (refreshToken) => {
  return new Model(`"refresh_token"`)
    .select(`*`, "", [refreshToken], [`WHERE "refresh_token".token = $1`])
    .catch((error) => {
      console.log(error);
    });
};

const getTokensByUserId = (user_id) => {
  return new Model(`"refresh_token"`)
    .select(`*`, "", [parseInt(user_id)], ["WHERE user_id = $1"])
    .catch((error) => {
      console.log(error);
    });
};

const deleteTokensByUserId = (user_id) => {
  console.log("Deleting tokens by user...");
  new Model(`"refresh_token"`)
    .delete(`user_id`, [parseInt(user_id)])
    .catch((error) => {
      console.error("Error deleting tokens by user: ", error);
    });
};

const getTokens = (req, res) => {
  new Model("token")
    .select(`*`, "", [], [])
    .then((token_data) => {
      res.status(200).json({ success: true, data: token_data.rows });
    })
    .catch((error) => {
      console.log(error);
    });
};

const addToken = (refreshToken, user_id, expiry_date) => {
  console.log("Adding token...");
  new Model(`"refresh_token"`)
    .insert(
      [`token`, `user_id`, `expiry_date`],
      [refreshToken, user_id, expiry_date]
    )
    .then((token_data) => {
      console.log("Token added: ", token_data.rows);
    })
    .catch((error) => {
      console.log(error);
    });
};

module.exports = {
  getToken,
  getTokens,
  addToken,
  deleteTokensByUserId,
  getTokensByUserId,
};

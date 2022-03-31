const { getBranch, getBranches } = require("./branch");

const Model = require("../models/model").Model;

const generateDateColumn = (date, column_name, date_format = "yyyy-mm-dd") => {
  return ` TO_CHAR(${date} :: DATE, ${date_format}) AS ${column_name}`;
};

const getFormalizationRequest = (req, res) => {
  new Model("branch").select(`*`, "", [], []).then((branches) => {
    branches = branches.rows;
    new Model("formalization_request")
      .select(
        `id,
    owner,
    request_date,
    branch,
    status,
    comment`,
        "",
        [parseInt(req.params.id)],
        ["WHERE id = $1"]
      )
      .then((request_data) => {
        console.log("BRANCHES: ", branches);
        request_data.rows.forEach((request) => {
          console.log("BRANCH ID: %d", request.branch);
          const branch = branches.find((branch) => branch.id == request.branch);
          branch.region_id = branch.region;
          delete branch.region;
          request.branch = branch;
          request.owner_id = request.owner;
          delete request.owner;
        });
        res.status(200).json({ success: true, data: request_data.rows[0] });
      })
      .catch((error) => {
        console.log(error);
      });
  });
};

const getFormalizationRequests = (req, res) => {
  new Model("branch").select(`*`, "", [], []).then((branches) => {
    branches = branches.rows;
    new Model("formalization_request")
      .select(
        `id,
    owner,
    request_date,
    branch,
    status,
    comment`,
        "",
        [],
        []
      )
      .then((request_data) => {
        request_data.rows.forEach((request) => {
          const branch = branches.find((branch) => branch.id == request.branch);
          branch.region_id = branch.region;
          delete branch.region;
          request.branch = branch;
          request.owner_id = request.owner;
          delete request.owner;
        });
        res.status(200).json({ success: true, data: request_data.rows });
      })
      .catch((error) => {
        console.log(error);
      });
  });
};

module.exports = {
  getFormalizationRequest,
  getFormalizationRequests,
};

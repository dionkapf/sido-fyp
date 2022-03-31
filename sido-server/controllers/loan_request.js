const Model = require("../models/model").Model;

const getLoanRequest = (req, res) => {
  new Model("branch").select(`*`, "", [], []).then((branch_data) => {
    branches = branch_data.rows;
    new Model("loan_request")
      .select(
        `id,
        loanee,
        branch,
        amount,
        request_date,
        status`,
        "",
        [parseInt(req.params.id)],
        ["WHERE id = $1"]
      )
      .then((request_data) => {
        request_data.rows.forEach((request) => {
          const branch = branches.find((branch) => branch.id == request.branch);
          branch.region_id = branch.region;
          delete branch.region;
          request.branch = branch;
          request.loanee_id = request.loanee;
          delete request.loanee;
        });
        res.status(200).json({ success: false, data: request_data.rows[0] });
      })
      .catch((error) => {
        console.log(error);
      });
  });
};

const getLoanRequests = (req, res) => {
  new Model("branch").select(`*`, "", [], []).then((branch_data) => {
    branches = branch_data.rows;
    new Model("loan_request")
      .select(
        `id,
        loanee,
        branch,
        amount,
        request_date,
        status`,
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
          request.loanee_id = request.loanee;
          delete request.loanee;
        });
        res.status(200).json({ success: false, data: request_data.rows });
      })
      .catch((error) => {
        console.log(error);
      });
  });
};

module.exports = {
  getLoanRequest,
  getLoanRequests,
};

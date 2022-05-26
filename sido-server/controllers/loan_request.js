const { getUser } = require("./users");

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
  if (req.query.amount !== undefined) {
    new Model("loan_request")
      .select(`SUM(amount)`, "", [], [])
      .then((request_data) => {
        console.log("Request data", request_data);
        res.status(200).json({ success: true, data: request_data.rows[0].sum });
        return;
      })
      .catch((error) => {
        console.log(error);
      });
  }
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
      .then(async (request_data) => {
        const req_data = await request_data.rows.map(async (request) => {
          const userRes = await new Model("owner").select(
            `id,
            first_name,
            last_name
            `,
            "",
            [request.loanee],
            ["WHERE id = $1"]
          );
          const user = userRes.rows[0];
          const loanee_name = `${user.first_name} ${user.last_name}`;
          const branch = branches.find((branch) => branch.id == request.branch);
          branch.region_id = branch.region;
          delete branch.region;
          request.branch = branch;
          request.loanee_id = request.loanee;
          request.loanee = loanee_name;
        });
        const requests = await Promise.all(req_data);
        console.log("Req Data", Promise.all(requests));
        if (req.query.count !== undefined) {
          const count = request_data.rows.length;
          console.log("Count", count);
          res.status(200).json({ success: true, data: count });
          return;
        }
        const data = await Promise.all(request_data.rows);
        console.log("Data", data);
        res.status(200).json({ success: false, data: request_data.rows });
      })
      .catch((error) => {
        console.log(error);
      });
  });
};

const getRequestAmount = (req, res) => {
  console.log("Get Request Amount");
  new Model("loan_request")
    .select(`SUM(amount)`, "", [], [])
    .then((request_data) => {
      console.log("Request data", request_data);
      res
        .status(200)
        .json({ success: true, ss: xx, data: request_data.rows[0] });
    })
    .catch((error) => {
      console.log(error);
    });
};

const createLoanRequest = (req, res) => {
  const { loanee, branch, amount, status } = req.body;
  const request_status = status ? status : "pending";
  new Model("loan_request")
    .insert(
      [`loanee`, `branch`, `amount`, `status`],
      [loanee, branch, amount, request_status]
    )
    .then((request_data) => {
      res.status(200).json({ success: true, data: request_data.rows[0] });
    })
    .catch((error) => {
      console.log(error);
    });
};

module.exports = {
  getLoanRequest,
  getLoanRequests,
  getRequestAmount,
  createLoanRequest,
};

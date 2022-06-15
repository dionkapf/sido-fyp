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
        res.status(200).json({ success: true, data: request_data.rows[0] });
      })
      .catch((error) => {
        console.log(error);
      });
  });
};

const getLoanRequests = (req, res) => {
  console.log("Amount is", req.query.amount);
  console.log("Branch is", req.query.branch);
  if (req.query.amount !== undefined) {
    let columns = "SUM(amount)";
    let query = "";
    let values = [];
    if (req.query.branch !== undefined) {
      columns = `branch, ${columns}`;
      query += "GROUP BY loan_request.branch";
    }
    new Model("loan_request")
      .select(columns, query, values, [])
      .then((request_data) => {
        console.log("Request data", request_data.rows);
        res.status(200).json({ success: true, data: request_data.rows });
        return;
      })
      .catch((error) => {
        console.log(error);
      });
  } else {
    console.log("No amount");
    let query = "";
    let values = [];
    if (req.query.branch !== undefined) {
      query += "WHERE loan_request.branch = $1";
      values.push(req.query.branch);
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
          query,
          values,
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
            const branch = branches.find(
              (branch) => branch.id == request.branch
            );
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
          res.status(200).json({ success: true, data: request_data.rows });
        })
        .catch((error) => {
          console.log(error);
        });
    });
  }
};

const getRequestAmount = (req, res) => {
  console.log("Get Request Amount");
  new Model("loan_request")
    .select(`SUM(amount)`, query, values, [])
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

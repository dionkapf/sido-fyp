const { getBranch, getBranches } = require("./branch");

const Model = require("../models/model").Model;

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
        if (request_data.rowCount > 0) {
          request_data.rows.forEach((request) => {
            const branch = branches.find(
              (branch) => branch.id == request.branch
            );
            branch.region_id = branch.region;
            delete branch.region;
            request.branch = branch;
            request.owner_id = request.owner;
            delete request.owner;
          });
          res.status(200).json({ success: true, data: request_data.rows[0] });
        } else {
          res.status(200).json({ success: true, data: [] });
        }
      })
      .catch((error) => {
        console.log(error);
      });
  });
};

const getFormalizationRequests = (req, res) => {
  let query = "";
  let values = [];
  if (req.query.owner !== undefined) {
    if (query === "") {
      query = `WHERE owner = $1`;
    } else {
      query += ` AND owner = $1`;
    }
    values.push(parseInt(req.query.owner));
  }
  if (req.query.branch !== undefined) {
    if (query === "") {
      query = "WHERE branch = $1";
    } else {
      query += " AND branch = $1";
    }
    values.push(parseInt(req.query.branch));
  }
  if (req.query.status !== undefined) {
    if (query === "") {
      query = `WHERE status = $1`;
    } else {
      query += ` AND status = $1`;
    }
    values.push(req.query.status);
  }

  console.log("Query: ", query);
  console.log("Values: ", values);
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
        query,
        values,
        []
      )
      .then((request_data) => {
        if (req.query.count !== undefined) {
          const count = request_data.rows.length;
          console.log("Count", count);
          res.status(200).json({ success: true, data: count });
          return;
        }
        if (request_data.rowCount > 0) {
          request_data.rows.forEach((request) => {
            const branch = branches.find(
              (branch) => branch.id == request.branch
            );
            branch.region_id = branch.region;
            delete branch.region;
            request.branch = branch;
            request.owner_id = request.owner;
            delete request.owner;
          });
          res.status(200).json({ success: true, data: request_data.rows });
        } else {
          res.status(200).json({ success: true, data: [] });
        }
      })
      .catch((error) => {
        console.log(error);
      });
  });
};

const createFormalizationRequest = (req, res) => {
  console.log("Create request");
  const { owner, branch } = req.body;
  console.log("Owner: ", owner);
  console.log("Branch: ", branch);
  const request_date = new Date(Date.now());
  const status = "pending";
  new Model(`formalization_request`)
    .insert(
      [`owner`, `branch`, `request_date`, `status`],
      [parseInt(owner), parseInt(branch), request_date, status]
    )
    .then((request_data) => {
      console.log("Insertion successful");
      res.status(201).json({
        success: true,
        message: "Request created",
        data: request_data.rows[0],
      });
    })
    .catch((error) => {
      console.log(error);
    });
};

const updateFormalizationRequest = (req, res) => {
  const { status, comment } = req.body;
  new Model("formalization_request")
    .update([`status`, `comment`], [status, comment], [parseInt(req.params.id)])
    .then((request_data) => {
      console.log("Update successful");
      res.status(200).json({
        success: true,
        message: "Request updated",
        user: request_data.rows[0],
      });
    })
    .catch((error) => {
      console.log(error);
    });
};

module.exports = {
  getFormalizationRequest,
  getFormalizationRequests,
  createFormalizationRequest,
  updateFormalizationRequest,
};

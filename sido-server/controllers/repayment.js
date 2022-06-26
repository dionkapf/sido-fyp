const Model = require("../models/model").Model;

const getRepayment = (req, res) => {
  new Model("repayment")
    .select(`*`, "", [parseInt(req.params.id)], ["WHERE id = $1"])
    .then(async (repayment_data) => {
      if (repayment_data.rowCount > 0) {
        console.log(repayment_data.rows);
        const loan = await new Model("loan").select(
          `*`,
          "",
          [repayment_data.rows[0].loan],
          ["WHERE id = $1"]
        );
        const request_id = loan.rows[0].request;
        const request = await new Model("loan_request").select(
          `*`,
          "",
          [request_id],
          ["WHERE id = $1"]
        );
        console.log("Req roes", request.rows[0]);
        console.log("Count", request.rowCount);
        if (request.rowCount > 0) {
          repayment_data.rows[0].request = request.rows[0];
        }
        res.status(200).json({ success: true, data: repayment_data.rows[0] });
      } else {
        res.status(200).json({ success: true, data: [] });
      }
    })
    .catch((error) => {
      console.log(error);
    });
};

const getRepaymentsByLoan = (req, res) => {
  new Model("repayment")
    .select(`*`, "", [loan_id], ["WHERE loan = $1"])
    .then(async (repayment_data) => {
      if (repayment_data.rowCount > 0) {
        console.log(repayment_data.rows);
        const loan = await new Model("loan").select(
          `*`,
          "",
          [repayment_data.rows[0].loan],
          ["WHERE id = $1"]
        );
        const request_id = loan.rows[0].request;
        const request = await new Model("loan_request").select(
          `*`,
          "",
          [request_id],
          ["WHERE id = $1"]
        );
        console.log("Req roes", request.rows[0]);
        console.log("Count", request.rowCount);
        if (request.rowCount > 0) {
          repayment_data.rows[0].request = request.rows[0];
        }
        res.status(200).json({ success: true, data: repayment_data.rows[0] });
      } else {
        res.status(200).json({ success: true, data: [] });
      }
    })
    .catch((error) => {
      console.log(error);
    });
};

const getRepayments = (req, res) => {
  let query = [];
  let values = [];
  if (req.query.loan !== undefined) {
    const { loan } = req.query;
    const loan_id = parseInt(loan);
    values.push(loan_id);
    if (query.length == 0) {
      query[0] = `WHERE loan = $1`;
    } else {
      query[0] += `AND loan = $1`;
    }
  }
  if (req.query.amount !== undefined) {
    new Model("repayment")
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
  new Model("repayment")
    .select(`*`, "", values, query)
    .then(async (repayment_data) => {
      if (repayment_data.rowCount > 0) {
        const repayments = await repayment_data.rows.map(async (repayment) => {
          const loan = await new Model("loan").select(
            `*`,
            "",
            [repayment.loan],
            ["WHERE id = $1"]
          );
          const request_id = loan.rows[0].request;
          const request = await new Model("loan_request").select(
            `*`,
            "",
            [request_id],
            ["WHERE id = $1"]
          );
          const loanee = await new Model("owner").select(
            `*`,
            "",
            [request.rows[0].loanee][`WHERE id = $1`]
          );

          console.log("Req roes", request.rows[0]);
          console.log("Count", request.rowCount);
          if (request.rowCount > 0) {
            repayment.request = request.rows[0];
          }
          if (loanee.rowCount > 0) {
            repayment.loanee = loanee.rows[0];
          }

          console.log("Repayment", repayment);
          return repayment;
        });
        const result = await Promise.all(repayments);
        if (req.query.count !== undefined) {
          const count = result.length;
          console.log("Count", count);
          res.status(200).json({ success: true, data: count });
          return;
        }
        res.status(200).json({ success: true, data: result });
      } else {
        res.status(200).json({ success: true, data: [] });
        return;
      }
    })
    .catch((error) => {
      console.log(error);
    });
};

const createRepayment = (req, res) => {
  const { amount, payment_date, receipt_number, loan_id } = req.body;
  new Model("repayment")
    .insert(
      ["amount", "payment_date", "receipt_number", "loan"],
      [amount, payment_date, receipt_number, loan_id]
    )
    .then((repayment_data) => {
      res.status(200).json({ success: true, data: repayment_data.rows[0] });
    })
    .catch((error) => {
      console.log(error);
    });
};

const updateRepayment = (req, res) => {
  const { amount, payment_date, receipt_number } = req.body;
  new Model("repayment")
    .update(
      ["amount", "payment_date", "receipt_number"],
      [parseInt(amount.replace(/\s/g, "")), payment_date, receipt_number],
      [req.params.id]
    )
    .then((repayment_data) => {
      res.status(200).json({ success: true, data: repayment_data.rows[0] });
    })
    .catch((error) => {
      console.log(error);
    });
};

const deleteRepayment = (req, res) => {
  new Model("repayment")
    .delete([`id`], [req.params.id])
    .then((repayment_data) => {
      res.status(200).json({ success: true, data: repayment_data.rows[0] });
    })
    .catch((error) => {
      console.log(error);
    });
};

module.exports = {
  getRepayment,
  getRepayments,
  getRepaymentsByLoan,
  createRepayment,
  updateRepayment,
  deleteRepayment,
};

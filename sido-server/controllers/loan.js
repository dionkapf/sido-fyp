const Model = require("../models/model").Model;

const getLoan = (req, res) => {
  new Model("loan")
    .select(`*`, "", [parseInt(req.params.id)], ["WHERE id = $1"])
    .then((loan_data) => {
      if (loan_data.rowCount > 0) {
        loan = loan_data.rows[0];
        loan.request_id = loan.request;
        loan.witness_1_id = loan.witness_1;
        loan.witness_2_id = loan.witness_2;
        loan.staff_id = loan.staff;
        delete loan.request;
        delete loan.witness_1;
        delete loan.witness_2;
        delete loan.staff;
        res.status(200).json({ success: true, data: loan });
      } else {
        res.status(200).json({ success: true, data: [] });
      }
    })
    .catch((error) => {
      console.log(error);
    });
};

const getLoans = (req, res) => {
  new Model("loan")
    .select(
      `loan.*, loan_request.branch AS branch_id`,
      "",
      [],
      ["INNER JOIN loan_request ON loan.request = loan_request.id"]
    )
    .then((loan_data) => {
      if (loan_data.rowCount > 0) {
        loans = loan_data.rows;
        loans.forEach((loan) => {
          loan.request_id = loan.request;
          loan.witness_1_id = loan.witness_1;
          loan.witness_2_id = loan.witness_2;
          loan.staff_id = loan.staff;
          delete loan.request;
          delete loan.witness_1;
          delete loan.witness_2;
          delete loan.staff;
        });
        if (req.query.count !== undefined) {
          const count = loans.length;
          console.log("Count", count);
          res.status(200).json({ success: true, data: count });
          return;
        }
        res.status(200).json({ success: true, data: loans });
      } else {
        res.status(200).json({ success: true, data: [] });
      }
    })
    .catch((error) => {
      console.log(error);
    });
};

const getLoanDetails = (req, res) => {
  new Model("loan")
    .select(
      `loan.id, 
      loan_request.loanee, 
      owner.first_name || ' ' || owner.last_name as loanee_name,
      loan_request.branch, 
      loan_request.amount, 
      loan_request.request_date, 
      loan.approval_date, 
      loan.deadline,
      w1.first_name || ' ' || w1.last_name as witness_1_name,
      w2.first_name || ' ' || w2.last_name as witness_2_name,
      loan.witness_1, 
      loan.witness_2`,
      "",
      [parseInt(req.params.id)],
      [
        "INNER JOIN loan_request ON loan.request = loan_request.id",
        "INNER JOIN owner ON loan_request.loanee = owner.id",
        "INNER JOIN witness w1 ON loan.witness_1 = w1.id",
        "INNER JOIN witness w2 ON loan.witness_2 = w2.id",
        "AND loan.id = $1",
      ]
    )
    .then((loan_data) => {
      if (loan_data.rowCount > 0) {
        loan = loan_data.rows[0];
        loan.request_id = loan.request;
        loan.witness_1_id = loan.witness_1;
        loan.witness_2_id = loan.witness_2;
        loan.staff_id = loan.staff;
        delete loan.request;
        delete loan.witness_1;
        delete loan.witness_2;
        delete loan.staff;
        res.status(200).json({ success: true, data: loan });
      } else {
        res.status(200).json({ success: true, data: [] });
      }
    })
    .catch((error) => {
      console.log(error);
    });
};

const getLoansDetails = (req, res) => {
  new Model("loan")
    .select(
      `loan.id, 
      loan_request.loanee, 
      owner.first_name || ' ' || owner.last_name as loanee_name,
      loan_request.branch, 
      loan_request.amount, 
      loan_request.request_date, 
      loan.approval_date, 
      loan.deadline,
      w1.first_name || ' ' || w1.last_name as witness_1_name,
      w2.first_name || ' ' || w2.last_name as witness_2_name,
      loan.witness_1, 
      loan.witness_2`,
      "",
      [],
      [
        "INNER JOIN loan_request ON loan.request = loan_request.id",
        "INNER JOIN owner ON loan_request.loanee = owner.id",
        "INNER JOIN witness w1 ON loan.witness_1 = w1.id",
        "INNER JOIN witness w2 ON loan.witness_2 = w2.id",
      ]
    )
    .then((loan_data) => {
      if (loan_data.rowCount > 0) {
        loan_data.rows.forEach((loan) => {
          loan.request_id = loan.request;
          loan.witness_1_id = loan.witness_1;
          loan.witness_2_id = loan.witness_2;
          loan.staff_id = loan.staff;
          delete loan.request;
          delete loan.witness_1;
          delete loan.witness_2;
          delete loan.staff;
        });
        res.status(200).json({ success: true, data: loan_data.rows });
      } else {
        res.status(200).json({ success: true, data: [] });
      }
    })
    .catch((error) => {
      console.log(error);
    });
};

const createLoan = (req, res) => {
  const {
    loanRequestId,
    approvalDate,
    deadline,
    witness1,
    witness2,
    staff,
    amount,
    rate,
  } = req.body;
  new Model("loan")
    .insert(
      [
        `request`,
        `approval_date`,
        `deadline`,
        `witness_1`,
        `witness_2`,
        `staff`,
        `amount`,
        `interest_rate`,
      ],
      [
        loanRequestId,
        approvalDate,
        deadline,
        witness1,
        witness2,
        staff,
        amount,
        rate,
      ]
    )
    .then((loan_data) => {
      res.status(200).json({ success: true, data: loan_data.rows[0] });
    })
    .catch((error) => {
      console.log(error);
    });
};

module.exports = {
  getLoan,
  getLoans,
  getLoanDetails,
  getLoansDetails,
  createLoan,
};

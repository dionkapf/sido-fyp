const Model = require("../models/model").Model;

const getStaff = (req, res) => {
  new Model("branch").select(`*`, "", [], []).then((branches) => {
    branches = branches.rows;
    new Model("role")
      .select(`*`, "", [], [])
      .then((roles) => {
        roles = roles.rows;
        new Model("staff")
          .select(`*`, "", [parseInt(req.params.id)], ["WHERE id = $1"])
          .then((staff_data) => {
            if (staff_data.rowCount > 0) {
              staff_data.rows.forEach((staff) => {
                const branch = branches.find(
                  (branch) => branch.id == staff.branch
                );
                const role = roles.find((role) => role.id == staff.role);

                branch.region_id = branch.region;
                delete branch.region;
                staff.branch = branch;
                staff.role = role;
              });
              res.status(200).json({ success: true, data: staff_data.rows[0] });
            } else {
              res.status(200).json({ success: true, data: [] });
            }
          })
          .catch((error) => {
            console.log(error);
          });
      })
      .catch((error) => {
        console.log(error);
      });
  });
};

const getStaffs = (req, res) => {
  new Model("branch")
    .select(`*`, "", [], [])
    .then((branches) => {
      branches = branches.rows;
      new Model("role")
        .select(`*`, "", [], [])
        .then((roles) => {
          roles = roles.rows;
          new Model("staff")
            .select(`*`, "", [], [])
            .then((staff_data) => {
              if (staff_data.rowCount > 0) {
                staff_data.rows.forEach((staff) => {
                  const branch = branches.find(
                    (branch) => branch.id == staff.branch
                  );
                  const role = roles.find((role) => role.id == staff.role);
                  branch.region_id = branch.region;
                  delete branch.region;
                  staff.branch = branch;
                  staff.role = role;
                });
                res.status(200).json({ success: true, data: staff_data.rows });
              } else {
                res.status(200).json({ success: true, data: [] });
              }
            })
            .catch((error) => {
              console.log(error);
            });
        })
        .catch((error) => {
          console.log(error);
        });
    })
    .catch((error) => {
      console.log(error);
    });
};

module.exports = {
  getStaff,
  getStaffs,
};

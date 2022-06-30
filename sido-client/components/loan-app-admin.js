import { useState, forwardRef } from "react";
import { useRouter } from "next/router";
import { useAuth } from "../context/AuthContext";

import { withStyles, makeStyles } from "@material-ui/core/styles";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Paper from "@material-ui/core/Paper";
import DashboardLayout from "./dashboard-layout";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import ButtonGroup from "@material-ui/core/ButtonGroup";
import Slide from "@material-ui/core/Slide";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import Snackbar from "@material-ui/core/Snackbar";
import MuiAlert from "@material-ui/lab/Alert";
import InputAdornment from "@material-ui/core/InputAdornment";
import { useLoanContext } from "../context/LoanContext";

const Transition = forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

function Alert(props) {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
}

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    "& > *": {
      margin: theme.spacing(1),
    },
  },
  main: {
    display: "flex",
    flex: 1,
    flexDirection: "column",
    justifyContent: "center",
    padding: "2rem",
  },
  title: {
    fontWeight: "bold",
    color: "#333",
    margin: 0,
    lineHeight: 1.15,
    fontSize: "2.5rem",
  },
  subtitle: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "0.5rem 1rem",
    margin: 0,
    lineHeight: 1.15,
    fontSize: "1rem",
  },
  count: {
    padding: "0.7rem",
    color: "white",
    backgroundColor: "#4e94ca",
  },
  collateral_header: {
    textAlign: "center",
  },
  collateral_body: {
    display: "flex",
    justifyContent: "space-evenly",
  },
  collateral_values: {
    "& > *": {
      textDecoration: "none",
      fontWeight: "400",
    },
  },
}));

const StyledTableCell = withStyles((theme) => ({
  head: {
    backgroundColor: theme.palette.primary.dark,
    color: theme.palette.common.white,
  },
}))(TableCell);

export default function LoanAppAdmin({ list, title, description, options }) {
  const columns = Object.keys(list[0]);
  const classes = useStyles();
  const router = useRouter();
  const { user } = useAuth();
  const { loanData, setLoanData } = useLoanContext();
  const [rejectSnack, setRejectSnack] = useState("");
  const [collateral, setCollateral] = useState({});
  const [verifiedAmount, setVerifiedAmount] = useState(0);

  const [acceptOpen, setAcceptOpen] = useState(false);
  // const [loanData, setLoanData] = useState({});

  const handleAcceptOpen = (row) => {
    getCollateral(row);
  };
  const handleAcceptClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setLoanData({});
    setAcceptOpen(false);
  };
  // const accept = () => {
  //   const data = { status: "verified", comment: acceptComment, ...loanData };
  //   delete data.Status;
  //   console.log("data", data);
  //   const res = fetch(
  //     `http://localhost:5000/api/formalization-requests/${loanData.id}`,
  //     {
  //       method: "PUT",
  //       headers: {
  //         "Content-Type": "application/json",
  //       },
  //       body: JSON.stringify(data),
  //     }
  //   );
  //   res.then((res) => {
  //     console.log(res);
  //     handleAcceptClose();
  //     setAcceptSnack(true);
  //     setTimeout(() => {
  //       router.push("/operation/business");
  //     }, 1500);
  //   });
  // };

  const accept = () => {
    // alert("Hoorah");
  };

  const [rejectOpen, setRejectOpen] = useState(false);
  const handleRejectOpen = (row) => {
    alert(JSON.stringify(row));
    setLoanData(row);
    setRejectOpen(true);
  };
  const handleRejectClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setLoanData({});
    setRejectOpen(false);
  };
  const reject = () => {
    const data = { status: "rejected" };
    console.log("data", data);
    const res = fetch(
      `http://localhost:5000/api/loan-requests/${loanData.id}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      }
    );
    res.then((res) => {
      console.log(res);
      handleRejectClose();
      setRejectSnack(true);
      setTimeout(() => {
        router.push("/operation/loan/");
      }, 1500);
    });
  };

  const [acceptSnack, setAcceptSnack] = useState(false);
  const [collateralSnackBar, setCollateralSnackBar] = useState(false);

  const [collateralOpen, setCollateralOpen] = useState(false);

  const handleCollateralOpen = (row) => {
    const loanRequestId = row.id;
    setLoanData(row);
    const staffId = user ? user.id : null;
    // alert(`Loan req no. ${loanRequestId} and User is ${staffId}`);
    const res = fetch(
      `http://localhost:5000/api/collaterals?loan_request=${loanRequestId}`
    );
    res.then((res) => {
      res.json().then((data) => {
        // alert(JSON.stringify(data.data[0]));
        setCollateral(data.data[0]);
        setCollateralOpen(true);
      });
    });
  };

  const getCollateral = async (row) => {
    const loanRequestId = row.id;
    console.log("loanRequestId", loanRequestId);
    console.log("row", row);
    setLoanData(row);
    const staffId = user ? user.id : null;
    // alert(`Loan req no. ${loanRequestId} and User is ${staffId}`);
    const res = fetch(
      `http://localhost:5000/api/collaterals?loan_request=${loanRequestId}`
    );
    res.then((res) => {
      res.json().then((data) => {
        // alert(JSON.stringify(data.data[0]));
        setCollateral(data.data[0]);
        // alert(JSON.stringify(data.data[0]));
        if (data.data[0].status) {
          setLoanData(row);
          alert(JSON.stringify(row));
          router.push("/witness-register");
        } else {
          setCollateralOpen(true);
        }
      });
    });
  };

  const handleCollateralClose = () => {
    setCollateralOpen(false);
    setCollateral({});
  };
  const verifyCollateral = () => {
    if (!user) {
      router.push("/login");
      return;
    }
    const collateralId = collateral.id;
    const data = {
      verifiedStatus: true,
      verifiedWorth: verifiedAmount,
      staff: user.id,
    };
    console.log("Collateral ID:", collateralId);
    // alert(`Collateral ID: ${collateralId}\ndata: ${JSON.stringify(data)}`);
    console.log("data: ", data);
    const res = fetch(`http://localhost:5000/api/collaterals/${collateralId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
    res.then((res) => {
      console.log(res);
      // alert(`Collateral verified, ${JSON.stringify(res)}`);
      handleCollateralClose();
      setCollateralSnackBar(true);
    });
  };
  const unVerifyCollateral = () => {
    if (!user) {
      router.push("/login");
      return;
    }
    const collateralId = collateral.id;
    const data = {
      verifiedStatus: false,
      verifiedWorth: null,
      staff: null,
    };
    console.log("Collateral ID:", collateralId);
    // alert(`Collateral ID: ${collateralId}\ndata: ${JSON.stringify(data)}`);
    console.log("data: ", data);
    const res = fetch(`http://localhost:5000/api/collaterals/${collateralId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
    res.then((res) => {
      console.log(res);
      // alert(`Collateral verified, ${JSON.stringify(res)}`);
      handleCollateralClose();
      setCollateralSnackBar(true);
    });
  };

  console.log("columns", columns);
  return (
    <DashboardLayout title={title} sidebarOptions={options}>
      <main className={classes.main}>
        <h1 className={classes.title}>{title}</h1>
        <div className={classes.subtitle}>
          <Paper variant="outlined" className={classes.count}>
            Returned a total of {list.length} {description}
          </Paper>
        </div>
        <TableContainer component={Paper}>
          <Table aria-label="simple table">
            <TableHead>
              <TableRow>
                {columns.map((column) => {
                  if (column === "id") {
                    return;
                  }
                  if (column === "S/N") return;
                  // (
                  //   <StyledTableCell align="left" key={column}>
                  //     {column}
                  //   </StyledTableCell>
                  // );
                  else if (column === "Actions")
                    return (
                      <StyledTableCell
                        align="left"
                        key={column}
                      ></StyledTableCell>
                    );
                  else
                    return (
                      <StyledTableCell align="right" key={column}>
                        {column}
                      </StyledTableCell>
                    );
                })}
              </TableRow>
            </TableHead>
            <TableBody>
              {list
                .filter((row) => {
                  return row.Status === "pending";
                })
                .map((row) => (
                  <TableRow key={row["S/N"]}>
                    {columns.map((column) => {
                      if (column === "id") {
                        return;
                      }
                      switch (column) {
                        case "S/N":
                          return;
                        // (
                        //   <TableCell
                        //     align="left"
                        //     component="th"
                        //     scope="row"
                        //     key={row.id}
                        //   >
                        //     {row[column]}
                        //   </TableCell>
                        // );
                        case "Phone":
                          const raw_phone = row[column];
                          const phone_number =
                            raw_phone[0] == "0" ? (
                              <a href={`tel:+255${raw_phone.slice(1)}`}>
                                {"+255 " +
                                  raw_phone
                                    .slice(1)
                                    .match(/.{1,3}/g)
                                    .join(" ")}
                              </a>
                            ) : (
                              <a href={`tel:${raw_phone}`}>
                                {raw_phone.match(/.{1,3}/g).join(" ")}
                              </a>
                            );

                          return (
                            <TableCell align="right" key={column}>
                              {phone_number}
                            </TableCell>
                          );
                        case "Email":
                          return (
                            <TableCell align="right" key={column}>
                              <a href={`mailto:${row[column]}`}>
                                {row[column]}
                              </a>
                            </TableCell>
                          );
                        case "Loanee":
                          return (
                            <TableCell align="right" key={column}>
                              <a href={`#`}>{row[column]}</a>
                            </TableCell>
                          );
                        case "Actions":
                          const actions = row[column];
                          return (
                            <TableCell
                              align="right"
                              className={classes.root}
                              key={column}
                            >
                              <ButtonGroup
                                variant="text"
                                color="primary"
                                aria-label="text primary button group"
                              >
                                {actions.map((action) => {
                                  if (action.name === "ACCEPT")
                                    return (
                                      <Button
                                        onClick={() => {
                                          handleAcceptOpen(row);
                                        }}
                                        key={action.name}
                                      >
                                        {action.name}
                                      </Button>
                                    );
                                  if (action.name === "REJECT")
                                    return (
                                      <Button
                                        onClick={() => {
                                          handleRejectOpen(row);
                                        }}
                                        key={action.name}
                                      >
                                        {action.name}
                                      </Button>
                                    );
                                  if (action.name === "COLLATERAL")
                                    return (
                                      <Button
                                        onClick={() => {
                                          handleCollateralOpen(row);
                                        }}
                                        key={action.name}
                                      >
                                        {action.name}
                                      </Button>
                                    );
                                  else
                                    return (
                                      <Button key={action.name}>
                                        {action.name}
                                      </Button>
                                    );
                                })}
                              </ButtonGroup>
                            </TableCell>
                          );
                        default:
                          return (
                            <TableCell align="right" key={column}>
                              {row[column]}
                            </TableCell>
                          );
                      }
                    })}
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </TableContainer>
      </main>
      <Dialog
        open={collateralOpen}
        TransitionComponent={Transition}
        keepMounted
        onClose={handleCollateralClose}
        aria-labelledby="verify-collateral-dialog-title"
        aria-describedby="verify-collateral-dialog-description"
      >
        <DialogTitle id="verify-collateral-dialog-title">
          {loanData &&
            (collateral.status
              ? `${loanData.Loanee}'s ${loanData["Amount Requested"]} loan collateral`
              : `Verify ${loanData.Loanee}'s ${loanData["Amount Requested"]} loan collateral?`)}
        </DialogTitle>
        <DialogContent>
          <DialogContentText
            color="black"
            id="verify-collateral-dialog-description"
          >
            <div className={classes.collateral}>
              <div className={classes.collateral_header}>
                <h1>COLLATERAL</h1>
              </div>
              <div className={classes.collateral_body}>
                <div className={classes.collateral_labels}>
                  <h5>Loanee: </h5>
                  <h5>Branch: </h5>
                  <h5>Collateral: </h5>
                  <h5>Description: </h5>
                  <h5>Declared Value: </h5>
                  <h5>Status: </h5>
                </div>
                {loanData && collateral && (
                  <div className={classes.collateral_values}>
                    <h5>{loanData.Loanee}</h5>
                    <h5>{loanData.Branch}</h5>
                    <h5>{collateral.name}</h5>
                    <h5>{collateral.type}</h5>
                    <h5>
                      {collateral.value &&
                        `TSh ${collateral.value.replace(
                          /\B(?=(\d{3})+(?!\d))/g,
                          " "
                        )}`}
                    </h5>
                    <h5>
                      {collateral && collateral.status
                        ? "Verified"
                        : "Pending verification by officer"}
                    </h5>
                  </div>
                )}
              </div>
            </div>
          </DialogContentText>
          {collateral && collateral.status === false && (
            <TextField
              autoFocus
              margin="dense"
              id="verifiedAmount"
              label="Verified Worth"
              onChange={(e) => setVerifiedAmount(e.target.value)}
              fullWidth
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">TSh</InputAdornment>
                ),
              }}
            />
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCollateralClose} color="primary">
            CLOSE
          </Button>
          {collateral && collateral.status === false && (
            <Button onClick={verifyCollateral} color="primary">
              VERIFY
            </Button>
          )}
          {collateral && collateral.status === true && (
            <Button onClick={unVerifyCollateral} color="primary">
              UNVERIFY
            </Button>
          )}
        </DialogActions>
      </Dialog>
      <Dialog
        open={rejectOpen}
        TransitionComponent={Transition}
        keepMounted
        onClose={handleAcceptClose}
        aria-labelledby="alert-dialog-slide-title"
        aria-describedby="reject-dialog"
      >
        <DialogTitle id="alert-dialog-slide-title">
          {`Reject ${"Owner"}'s loan request?`}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-slide-description">
            {`Deny ${
              loanData ? loanData.Owner : "Owner"
            }'s loan request? Its status will be updated to "Rejected".`}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleRejectClose} color="primary">
            BACK
          </Button>
          <Button onClick={reject} color="primary">
            REJECT
          </Button>
        </DialogActions>
      </Dialog>
      <Snackbar
        open={acceptSnack}
        autoHideDuration={5000}
        onClose={() => setAcceptSnack(false)}
      >
        <Alert onClose={() => setAcceptSnack(false)} severity="info">
          {`Loan request has been rejected.`}
        </Alert>
      </Snackbar>
      <Snackbar
        open={rejectSnack}
        autoHideDuration={5000}
        onClose={() => setAcceptSnack(false)}
      >
        <Alert onClose={() => setAcceptSnack(false)} severity="info">
          {`${
            loanData ? loanData.Owner : "Owner"
          }'s loan request has been rejected.`}
        </Alert>
      </Snackbar>
      <Snackbar
        open={collateralSnackBar}
        autoHideDuration={5000}
        onClose={() => setCollateralSnackBar(false)}
      >
        <Alert onClose={() => setCollateralSnackBar(false)} severity="success">
          {`The collateral has been modified.`}
        </Alert>
      </Snackbar>
    </DashboardLayout>
  );
}

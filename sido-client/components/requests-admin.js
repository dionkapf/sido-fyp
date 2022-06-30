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
import InputAdornment from "@material-ui/core";
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
  request_header: {
    textAlign: "center",
  },
  request_body: {
    display: "flex",
    justifyContent: "space-evenly",
  },
  request_values: {
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

export default function RequestsAdmin({ list, title, description, options }) {
  const { user } = useAuth();
  const columns = Object.keys(list[0]);
  const classes = useStyles();
  const router = useRouter();
  const [comment, setComment] = useState("");
  const [dialogTitle, setDialogTitle] = useState("");
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [rowData, setRowData] = useState({});

  const [verifyData, setVerifyData] = useState({});
  const [mode, setMode] = useState("");
  const [openDialog, setOpenDialog] = useState(false);
  const [successSnack, setSuccessSnack] = useState(false);
  const [infoSnack, setInfoSnack] = useState(false);

  const handleViewOpen = (row) => {
    setRowData(row);
    setMode("view");
    setDialogTitle(
      `${row.Owner}'s request for ${row.owner_data.business_name}`
    );
    setOpenDialog(true);
  };
  const handleVerifyOpen = (row) => {
    setRowData(row);
    setMode("verify");
    setDialogTitle(
      `Verify ${row.Owner}'s request for ${row.owner_data.business_name}?`
    );
    setOpenDialog(true);
  };
  const handleUnverifyOpen = (row) => {
    setRowData(row);
    setMode("unverify");
    setDialogTitle(
      `Reset ${row.Owner}'s request for ${row.owner_data.business_name}?`
    );
    setOpenDialog(true);
  };
  const handleRejectOpen = (row) => {
    setRowData(row);
    setMode("reject");
    setDialogTitle(
      `Reject ${row.Owner}'s request for ${row.owner_data.business_name}?`
    );
    setOpenDialog(true);
  };
  const handleGenerate = async (row) => {
    setRowData(row);
    setMode("generate");
    // alert(JSON.stringify(row.owner_data));
    // alert(row.owner_data.sector_id);
    const sectorRes = await fetch(
      `http://localhost:5000/api/sectors/${row.owner_data.sector_id}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    const sectorRaw = await sectorRes.json();
    const sector = sectorRaw.data;
    const data = {
      owner: { sector, ...row.owner_data },
      staff: user,
    };
    const id = row.id;
    console.log("Full data", data);
    const res = await fetch(
      `http://localhost:5000/api/formalization-requests/${id}/create-doc`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      }
    );
    const docResponse = await res.json();
    console.log("Doc response", docResponse);
    if (docResponse.success) {
      // alert(
      //   `File is called: ${docResponse.file_name}\nFile is in: ${docResponse.file_path}`
      // );
      router.push(`http://localhost:5000/download/${docResponse.file_name}`);
      //     setSnackbarMessage("Document generated successfully");
      //     setSuccessSnack(true);
      //     // router.push(
      //     //   `http://localhost:5000/api/formalization-requests/${id}/doc`
      //     // );
    } else {
      // alert(`${JSON.stringify(docResponse)}`);
      //     setSnackbarMessage("Error generating document");
      //     setTimeout(() => {
      //       setInfoSnack(true);
      //     }, 1000);
    }
  };
  const handleCloseDialog = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setOpenDialog(false);
  };

  const verify = () => {
    const data = { status: "verified", comment: comment };
    const request_id = parseInt(rowData.id);
    // alert(`Verified: ${JSON.stringify(data)} request ID: ${request_id}`);

    if (user) {
      if (user.role == 3) {
        const res = fetch(
          `http://localhost:5000/api/formalization-requests/${request_id}`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
          }
        );
        res.then((res) => {
          handleCloseDialog();
          setSnackbarMessage(`${rowData.Owner}'s request has been verified`);
          setSuccessSnack(true);
          setTimeout(() => {
            router.push("/executive/training/requests");
          }, 1500);
        });
      } else if (user && user.role == 5) {
        const res = fetch(
          `http://localhost:5000/api/formalization-requests/${request_id}`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
          }
        );
        res.then((res) => {
          handleCloseDialog();
          setSnackbarMessage(`${rowData.Owner}'s request has been verified`);
          setSuccessSnack(true);
          setTimeout(() => {
            router.push("/operation/business/requests");
          }, 1500);
        });
      } else {
        router.push("/login");
      }
    } else {
      router.push("/login");
    }
  };
  const reset = () => {
    const data = { status: "pending", comment: null };
    const request_id = parseInt(rowData.id);
    if (user) {
      if (user.role == 3) {
        const res = fetch(
          `http://localhost:5000/api/formalization-requests/${request_id}`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
          }
        );
        res.then((res) => {
          handleCloseDialog();
          setSnackbarMessage(`${rowData.Owner}'s request has been reset`);
          setInfoSnack(true);
          setTimeout(() => {
            router.push("//executive/training/requests");
          }, 1500);
        });
      } else if (user.role == 5) {
        // alert("IN");
        const res = fetch(
          `http://localhost:5000/api/formalization-requests/${request_id}`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
          }
        );
        res.then((res) => {
          handleCloseDialog();
          setSnackbarMessage(`${rowData.Owner}'s request has been reset`);
          setInfoSnack(true);
          setTimeout(() => {
            router.push("/operation/business/requests");
          }, 1500);
        });
      } else {
        router.push("/login");
      }
    } else {
      router.push("/login");
    }
  };
  const reject = () => {
    const data = { status: "rejected", comment: comment };
    const request_id = parseInt(rowData.id);
    // alert(`Rejected: ${JSON.stringify(data)} request ID: ${request_id}`);

    if (user) {
      if (user.role == 3) {
        const res = fetch(
          `http://localhost:5000/api/formalization-requests/${request_id}`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
          }
        );
        res.then((res) => {
          // alert("Res", JSON.stringify(res.data));
          handleCloseDialog();
          setSnackbarMessage(`${rowData.Owner}'s request has been rejected`);
          setInfoSnack(true);
          setTimeout(() => {
            router.push("/executive/training/requests");
          }, 1500);
        });
      } else if (user && user.role == 5) {
        const res = fetch(
          `http://localhost:5000/api/formalization-requests/${request_id}`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
          }
        );
        res.then((res) => {
          // alert("Res", JSON.stringify(res.data));
          handleCloseDialog();
          setSnackbarMessage(`${rowData.Owner}'s request has been rejected`);
          setInfoSnack(true);
          setTimeout(() => {
            router.push("/operation/business/requests");
          }, 1500);
        });
      } else {
        router.push("/login");
      }
    } else {
      router.push("/login");
    }
  };

  console.log("columns", columns);
  console.log("List", list);
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
                  if (column === "id" || column.includes("_data")) {
                    return;
                  }
                  if (column === "S/N")
                    return (
                      <StyledTableCell align="left" key={column}>
                        {column}
                      </StyledTableCell>
                    );
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
              {list.map((row) => (
                <TableRow key={row["S/N"]}>
                  {columns.map((column) => {
                    if (column === "id" || column.includes("_data")) {
                      return;
                    }
                    switch (column) {
                      case "S/N":
                        return (
                          <TableCell
                            align="left"
                            component="th"
                            scope="row"
                            key={row.id}
                          >
                            {row[column]}
                          </TableCell>
                        );
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
                            <a href={`mailto:${row[column]}`}>{row[column]}</a>
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
                                if (action.name === "View")
                                  return (
                                    <Button
                                      onClick={() => {
                                        handleViewOpen(row);
                                      }}
                                      key={action.name}
                                    >
                                      {action.name}
                                    </Button>
                                  );
                                if (
                                  action.name === "Verify" &&
                                  row.Status == "pending"
                                )
                                  return (
                                    <Button
                                      onClick={() => {
                                        handleVerifyOpen(row);
                                      }}
                                      key={action.name}
                                    >
                                      {action.name}
                                    </Button>
                                  );
                                if (
                                  action.name === "Unverify" &&
                                  row.Status != "pending"
                                )
                                  return (
                                    <Button
                                      onClick={() => {
                                        handleUnverifyOpen(row);
                                      }}
                                      key={action.name}
                                    >
                                      RESET
                                    </Button>
                                  );
                                if (
                                  action.name === "Reject" &&
                                  row.Status == "pending"
                                )
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
                                if (
                                  action.name === "Generate" &&
                                  row.Status == "verified"
                                )
                                  return (
                                    <Button
                                      onClick={() => {
                                        // alert("Making it happen");
                                        handleGenerate(row);
                                      }}
                                      key={action.name}
                                    >
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
        open={openDialog}
        TransitionComponent={Transition}
        keepMounted
        onClose={handleCloseDialog}
        aria-labelledby="view-dialog-title"
        aria-describedby="view-dialog-description"
      >
        <DialogTitle id="view-dialog">{dialogTitle}</DialogTitle>
        <DialogContent>
          <DialogContentText color="black" id="view-dialog-description">
            <div>
              <div className={classes.request_body}>
                <div className={classes.request_labels}>
                  <h5>Owner: </h5>
                  <h5>Business: </h5>
                  <h5>Sector: </h5>
                  <h5>Description: </h5>
                  <h5>Address: </h5>
                  <h5>Phone Number: </h5>
                  <h5>Email Address: </h5>
                  <h5>Date Requested: </h5>
                  <h5>Status: </h5>
                  {rowData && rowData.comment_data && <h5>Comment: </h5>}
                </div>
                {rowData && rowData.owner_data && (
                  <div className={classes.request_values}>
                    <h5>{rowData.Owner}</h5>
                    <h5>{rowData.Business}</h5>
                    <h5>{rowData.Sector}</h5>
                    <h5>{rowData.owner_data.business_type}</h5>
                    <h5>{rowData.owner_data.address}</h5>
                    <h5>
                      {"+255 " +
                        rowData.owner_data.phone_number
                          .slice(0)
                          .match(/.{1,3}/g)
                          .join(" ")}
                    </h5>
                    <h5>{rowData.owner_data.email}</h5>
                    <h5>{rowData["Date Requested"]}</h5>
                    <h5>{rowData.Status}</h5>
                    <h5>{rowData && rowData.comment_data}</h5>
                  </div>
                )}
              </div>
            </div>
          </DialogContentText>
          {["verify", "reject"].includes(mode) && (
            <TextField
              autoFocus
              margin="dense"
              id="comment"
              label="Comment"
              onChange={(e) => setComment(e.target.value)}
              fullWidth
            />
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} color="primary">
            Close
          </Button>
          {mode == "verify" && (
            <Button onClick={verify} color="primary">
              Verify
            </Button>
          )}
          {mode == "unverify" && (
            <Button onClick={reset} color="primary">
              Reset
            </Button>
          )}
          {mode == "reject" && (
            <Button onClick={reject} color="primary">
              Reject
            </Button>
          )}
        </DialogActions>
      </Dialog>
      <Snackbar
        open={successSnack}
        autoHideDuration={5000}
        onClose={() => setSuccessSnack(false)}
      >
        <Alert onClose={() => setSuccessSnack(false)} severity="success">
          {snackbarMessage}
        </Alert>
      </Snackbar>
      <Snackbar
        open={infoSnack}
        autoHideDuration={5000}
        onClose={() => setInfoSnack(false)}
      >
        <Alert onClose={() => setInfoSnack(false)} severity="info">
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </DashboardLayout>
  );
}

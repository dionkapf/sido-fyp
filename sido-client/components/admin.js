import { useState, forwardRef } from "react";
import { useRouter } from "next/router";

import { withStyles, makeStyles } from "@material-ui/core/styles";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Paper from "@material-ui/core/Paper";
import DashboardLayout from "../components/dashboard-layout";
import TextField from "@material-ui/core/TextField";
import styles from "../styles/Hello.module.scss";
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
}));

const StyledTableCell = withStyles((theme) => ({
  head: {
    backgroundColor: theme.palette.primary.dark,
    color: theme.palette.common.white,
  },
}))(TableCell);

export default function Admin({ list, title, description, options }) {
  const columns = Object.keys(list[0]);
  const classes = useStyles();
  const router = useRouter();
  const [verifyComment, setVerifyComment] = useState("");
  const [rejectComment, setRejectComment] = useState("");

  const [verifyOpen, setVerifyOpen] = useState(false);
  const [verifyData, setVerifyData] = useState({});
  const handleVerifyOpen = (row) => {
    setVerifyData(row);
    setVerifyOpen(true);
  };
  const handleVerifyClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setVerifyOpen(false);
  };
  const verify = () => {
    const data = { status: "verified", comment: verifyComment, ...verifyData };
    delete data.Status;
    console.log("data", data);
    const res = fetch(
      `http://localhost:5000/api/formalization-requests/${verifyData.id}`,
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
      handleVerifyClose();
      setVerifySnack(true);
      setTimeout(() => {
        router.push("/operation/business");
      }, 1500);
    });
  };
  const [rejectOpen, setRejectOpen] = useState(false);
  const [rejectData, setRejectData] = useState({});
  const handleRejectOpen = (row) => {
    setRejectData(row);
    setRejectOpen(true);
  };
  const handleRejectClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setRejectOpen(false);
  };
  const reject = () => {
    const data = { status: "rejected", comment: rejectComment, ...rejectData };
    delete data.Status;
    console.log("data", data);
    const res = fetch(
      `http://localhost:5000/api/formalization-requests/${rejectData.id}`,
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
        router.push("/operation/business");
      }, 1500);
    });
  };

  const [verifySnack, setVerifySnack] = useState(false);
  const [rejectSnack, setRejectSnack] = useState(false);

  const [open, setOpen] = useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };
  console.log("columns", columns);
  return (
    <DashboardLayout title={title} sidebarOptions={options}>
      <main className={styles.main}>
        <h1 className={styles.title}>{title}</h1>
        <div className={styles.subtitle}>
          <Paper variant="outlined" className={styles.count}>
            Returned a total of {list.length} {description}
          </Paper>
          <Button onClick={handleClickOpen}>XX</Button>
          <TextField id="record-search" label="Search" type="search" />
        </div>
        <TableContainer component={Paper}>
          <Table aria-label="simple table">
            <TableHead>
              <TableRow>
                {columns.map((column) => {
                  if (column === "id") {
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
                    if (column === "id") {
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
                                if (action.name === "Verify")
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
                                if (action.name === "Reject")
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
                                else
                                  return (
                                    <Button key={action.name} href={action.url}>
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
        open={open}
        TransitionComponent={Transition}
        keepMounted
        onClose={handleClose}
        aria-labelledby="alert-dialog-slide-title"
        aria-describedby="alert-dialog-slide-description"
      >
        <DialogTitle id="alert-dialog-slide-title">
          {"Use Google's location service?"}
        </DialogTitle>
        <DialogContent>
          <DialogContentText color="black" id="alert-dialog-slide-description">
            Let Google help apps determine location. This means sending
            anonymous location data to Google, even when no apps are running.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Cancel
          </Button>
          <Button onClick={handleClose} color="primary">
            Edit
          </Button>
        </DialogActions>
      </Dialog>
      <Dialog
        open={verifyOpen}
        TransitionComponent={Transition}
        keepMounted
        onClose={handleVerifyClose}
        aria-labelledby="alert-dialog-slide-title"
        aria-describedby="verify-dialog"
      >
        <DialogTitle id="alert-dialog-slide-title">
          {`Verify ${verifyData.Owner}'s formalization request?`}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-slide-description">
            {`Confirm ${verifyData.Owner}'s formalization request? Its status will be updated to "Verified" and will be processed in the ${verifyData.branch} branch.`}
          </DialogContentText>
          <TextField
            autoFocus
            margin="dense"
            id="comment"
            label="Comment"
            onChange={(e) => setVerifyComment(e.target.value)}
            fullWidth
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleVerifyClose} color="primary">
            BACK
          </Button>
          <Button onClick={verify} color="primary">
            VERIFY
          </Button>
        </DialogActions>
      </Dialog>
      <Dialog
        open={rejectOpen}
        TransitionComponent={Transition}
        keepMounted
        onClose={handleVerifyClose}
        aria-labelledby="alert-dialog-slide-title"
        aria-describedby="reject-dialog"
      >
        <DialogTitle id="alert-dialog-slide-title">
          {`Reject ${rejectData.Owner}'s formalization request?`}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-slide-description">
            {`Deny ${rejectData.Owner}'s formalization request? Its status will be updated to "Rejected" and a comment will be sent to the owner.`}
          </DialogContentText>
          <TextField
            autoFocus
            margin="dense"
            id="comment"
            label="Comment"
            onChange={(e) => setRejectComment(e.target.value)}
            fullWidth
          />
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
        open={verifySnack}
        autoHideDuration={5000}
        onClose={() => setVerifySnack(false)}
      >
        <Alert onClose={() => setVerifySnack(false)} severity="success">
          {`${verifyData.Owner}'s formalization request has been rejected.`}
        </Alert>
      </Snackbar>
      <Snackbar
        open={rejectSnack}
        autoHideDuration={5000}
        onClose={() => setRejectSnack(false)}
      >
        <Alert onClose={() => setRejectSnack(false)} severity="info">
          {`${rejectData.Owner}'s formalization request has been verified.`}
        </Alert>
      </Snackbar>
    </DashboardLayout>
  );
}

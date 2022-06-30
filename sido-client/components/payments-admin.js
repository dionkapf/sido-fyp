import { useState, forwardRef } from "react";
import { useRouter } from "next/router";
import { useAuth } from "../context/AuthContext";
import { useFormik } from "formik";

import { withStyles, makeStyles } from "@material-ui/core/styles";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Paper from "@material-ui/core/Paper";
import Fab from "@material-ui/core/Fab";
import AddIcon from "@material-ui/icons/Add";
import InputAdornment from "@material-ui/core/InputAdornment";
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
import * as Yup from "yup";

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
  fab: {
    position: "fixed",
    bottom: theme.spacing(2),
    right: theme.spacing(2),
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
  form_body: {
    display: "flex",
    border: "0px",
    justifyContent: "space-evenly",
    flexDirection: "column",
    "& > *": {
      margin: "0.5rem",
    },
  },
  form_values: {
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

const validationSchema = Yup.object({
  amount: Yup.number()
    .required("Required")
    .positive("Must be a positive number")
    .integer("Must be a valid number")
    .min(1000, "Minimum repayment amount is TSh 1000/-")
    .max(15000000, "Maximum repayment amount is TSh 15 000 000/-"),
  paymentDate: Yup.date()
    .required("Required")
    .max(new Date(), "Repayment date must have passed"),
  receiptNumber: Yup.string().required("Required"),
});

export default function PaymentsAdmin({
  id,
  list,
  title,
  description,
  options,
  loanee,
}) {
  const { user } = useAuth();
  const isListEmpty = list.length === 0;
  const columns = !isListEmpty ? Object.keys(list[0]) : null;
  const classes = useStyles();
  const router = useRouter();
  const [dialogTitle, setDialogTitle] = useState("");
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [rowId, setRowId] = useState(null);
  const [initData, setInitData] = useState({
    amount: "",
    paymentDate: new Date().toISOString().slice(0, 10),
    receiptNumber: "",
  });

  const [mode, setMode] = useState("");
  const [openDialog, setOpenDialog] = useState(false);
  const [confirmDialog, setConfirmDialog] = useState(false);
  const [successSnack, setSuccessSnack] = useState(false);
  const [infoSnack, setInfoSnack] = useState(false);

  const formik = useFormik({
    initialValues: {
      amount: initData.amount,
      paymentDate: initData.paymentDate,
      receiptNumber: initData.receiptNumber,
    },
    enableReinitialze: true,
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      const data = {
        amount: values.amount.replace(/\s/g, ""),
        payment_date: values.paymentDate,
        receipt_number: values.receiptNumber,
        loan_id: id,
      };
      switch (mode) {
        case "add":
          // alert(`Adding repayment: ${JSON.stringify(data)}`);
          const addRes = await fetch(`http://localhost:5000/api/repayments/`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
          });
          // alert(addRes.status);
          if (addRes.status === 200) {
            setSuccessSnack(true);
            setSnackbarMessage("Repayment added successfully");
            setOpenDialog(false);
            setInitData({
              amount: "",
              paymentDate: new Date().toISOString().slice(0, 10),
              receiptNumber: "",
            });
            setMode("");
            setConfirmDialog(false);
            setTimeout(() => {
              setSuccessSnack(false);
              router.push(`/operation/loan/payments/${id}`);
            }, 3000);
          } else {
            setInfoSnack(true);
            setSnackbarMessage("Error adding repayment");
            setTimeout(() => {
              setInfoSnack(false);
            }, 3000);
          }

          break;
        case "edit":
          // alert(`Editing repayment: ${JSON.stringify(data)}`);
          // alert(`Our row: ${rowId}`);
          const updateRes = await fetch(
            `http://localhost:5000/api/repayments/${rowId}`,
            {
              method: "PUT",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify(data),
            }
          );
          console.log("Update Response: ", updateRes);
          if (updateRes.status === 200) {
            // alert("Successfully updated repayment");
            handleCloseDialog();
            setSuccessSnack(true);
            setSnackbarMessage("Repayment updated successfully");
            setTimeout(() => {
              setSuccessSnack(false);
              router.push(`/operation/loan/payments/${id}`);
            }, 3000);
          }
          break;

        default:
          // alert(`Unknown mode: ${mode}`);
          break;
      }
    },
  });

  const handleAddOpen = () => {
    formik.values.amount = "";
    formik.values.paymentDate = new Date().toISOString().slice(0, 10);
    formik.values.receiptNumber = "";
    setMode("add");
    const fullName = `${loanee.first_name} ${loanee.last_name}`;
    setDialogTitle(`Add new payment for ${fullName}'s loan?`);
    setOpenDialog(true);
  };
  const handleEditOpen = (row) => {
    setRowId(row.id);
    // alert(`Row: ${JSON.stringify(row)}`);
    formik.values.amount = row.Amount;
    formik.values.paymentDate = new Date(row["Payment Date"])
      .toISOString()
      .slice(0, 10);
    formik.values.receiptNumber = row["Receipt Number"];
    setMode("edit");
    const fullName = `${loanee.first_name} ${loanee.last_name}`;
    setDialogTitle(`Make changes to ${fullName}'s repayment?`);
    setOpenDialog(true);
  };
  const handleDeleteOpen = (row) => {
    setRowId(row.id);
    formik.values.amount = row.Amount;
    formik.values.paymentDate = new Date(row["Payment Date"])
      .toISOString()
      .slice(0, 10);
    formik.values.receiptNumber = row["Receipt Number"];
    setMode("delete");
    const fullName = `${loanee.first_name} ${loanee.last_name}`;
    setDialogTitle(`Remove ${fullName}'s repayment?`);
    setOpenDialog(true);
  };
  const handleCloseDialog = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setOpenDialog(false);
  };
  const handleCloseConfirmDialog = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setConfirmDialog(false);
  };

  const remove = async () => {
    // alert(`Removing repayment: ${rowId}`);
    const res = await fetch(`http://localhost:5000/api/repayments/${rowId}`, {
      method: "DELETE",
    });
    if (res.status === 200) {
      setSnackbarMessage("Repayment deleted successfully");
      setSuccessSnack(true);
      handleCloseDialog();
      handleCloseConfirmDialog();
      setOpenDialog(false);
      setTimeout(() => {
        setSuccessSnack(false);
        router.push(`/operation/loan/payments/${id}`);
      }, 3000);
    } else {
      setInfoSnack(true);
      setSnackbarMessage("Error deleting repayment");
      setTimeout(() => {
        setInfoSnack(false);
      }, 3000);
    }
  };

  console.log("columns", columns);
  console.log("List", list);
  return (
    <DashboardLayout title={title} sidebarOptions={options}>
      <main className={classes.main}>
        <h1 className={classes.title}>{title}</h1>
        <div className={classes.subtitle}>
          {!isListEmpty && (
            <Paper variant="outlined" className={classes.count}>
              Returned a total of {list.length} {description}
            </Paper>
          )}
          {isListEmpty && (
            <Paper variant="outlined" className={classes.count}>
              {description}
            </Paper>
          )}
        </div>
        <Fab
          className={classes.fab}
          color="primary"
          onClick={() => {
            handleAddOpen();
          }}
          aria-label="add-payment"
        >
          <AddIcon />
        </Fab>
        <TableContainer component={Paper}>
          <Table aria-label="simple table">
            <TableHead>
              {!isListEmpty && (
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
              )}
            </TableHead>
            {!isListEmpty && (
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
                                  if (action.name === "Edit")
                                    return (
                                      <Button
                                        onClick={() => {
                                          handleEditOpen(row);
                                        }}
                                        key={action.name}
                                      >
                                        {action.name}
                                      </Button>
                                    );
                                  if (action.name === "Delete")
                                    return (
                                      <Button
                                        onClick={() => {
                                          handleDeleteOpen(row);
                                        }}
                                        key={action.name}
                                      >
                                        {action.name}
                                      </Button>
                                    );
                                  if (action.name === "Loans")
                                    return (
                                      <Button
                                        key={action.name}
                                        href={action.url}
                                      >
                                        Loan
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
            )}
            {isListEmpty && (
              <TableBody>
                <TableCell align="left" component="th" scope="row" key={0}>
                  No repayments have been made for this loan. Please add a
                  repayment to continue.
                </TableCell>
              </TableBody>
            )}
          </Table>
        </TableContainer>
      </main>
      <Dialog
        open={openDialog}
        TransitionComponent={Transition}
        keepMounted
        onClose={handleCloseDialog}
        aria-labelledby="payment-dialog-title"
        aria-describedby="payment-dialog-description"
      >
        <DialogTitle id="payment-dialog">{dialogTitle}</DialogTitle>
        <form onSubmit={formik.handleSubmit} className={classes.paper}>
          <DialogContent className={classes.form_body}>
            <TextField
              required
              autoFocus
              disabled={mode === "delete"}
              id="amount"
              name="amount"
              label="Paid Amount"
              variant="outlined"
              onChange={formik.handleChange}
              value={formik.values.amount}
              error={formik.touched.amount && Boolean(formik.errors.amount)}
              helperText={formik.touched.amount && formik.errors.amount}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">TSh</InputAdornment>
                ),
              }}
            />
            <TextField
              required
              disabled={mode === "delete"}
              id="paymentDate"
              name="paymentDate"
              label="Payment Date"
              type="date"
              variant="outlined"
              onChange={formik.handleChange}
              value={formik.values.paymentDate}
              error={
                formik.touched.paymentDate && Boolean(formik.errors.paymentDate)
              }
              helperText={
                formik.touched.paymentDate && formik.errors.paymentDate
              }
              InputLabelProps={{ shrink: true }}
              defaultValue={formik.values.paymentDate}
            />
            <TextField
              required
              disabled={mode === "delete"}
              id="receiptNumber"
              name="receiptNumber"
              label="Receipt Number"
              variant="outlined"
              onChange={formik.handleChange}
              value={formik.values.receiptNumber}
              defaultValue={formik.values.type}
              error={
                formik.touched.receiptNumber &&
                Boolean(formik.errors.receiptNumber)
              }
              helperText={
                formik.touched.receiptNumber && formik.errors.receiptNumber
              }
              InputLabelProps={{ shrink: true }}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseDialog} color="primary">
              Close
            </Button>
            {mode == "add" && (
              <Button onClick={formik.handleSubmit} color="primary">
                Add
              </Button>
            )}
            {mode == "edit" && (
              <Button onClick={formik.handleSubmit} color="primary">
                Edit
              </Button>
            )}
            {mode == "delete" && (
              <Button
                onClick={(row) => {
                  // setRowId(row.id);
                  setConfirmDialog(true);
                }}
                color="primary"
              >
                Delete
              </Button>
            )}
          </DialogActions>
        </form>
      </Dialog>
      <Dialog
        open={confirmDialog}
        TransitionComponent={Transition}
        keepMounted
        onClose={handleCloseConfirmDialog}
        aria-labelledby="confirm-dialog-title"
        aria-describedby="confirm-dialog-description"
      >
        <DialogTitle id="confirm-dialog">{"Confirm deletion?"}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            This action is irreversible and will erase the payment entry from
            the system.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseConfirmDialog} color="primary">
            Close
          </Button>
          {
            <Button onClick={remove} color="primary">
              Delete
            </Button>
          }
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

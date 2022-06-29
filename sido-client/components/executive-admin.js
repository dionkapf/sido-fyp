import { useState, forwardRef } from "react";
import { useRouter } from "next/router";
import { useFormik } from "formik";

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
import InputAdornment from "@material-ui/core/InputAdornment";
import PhoneIcon from "@material-ui/icons/Phone";
import Slide from "@material-ui/core/Slide";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import Snackbar from "@material-ui/core/Snackbar";
import MuiAlert from "@material-ui/lab/Alert";
import Grid from "@material-ui/core/Grid";
import SpeedDial from "@material-ui/lab/SpeedDial";
import SpeedDialIcon from "@material-ui/lab/SpeedDialIcon";
import SpeedDialAction from "@material-ui/lab/SpeedDialAction";
import AttachMoneyIcon from "@material-ui/icons/AttachMoney";
import BusinessCenterIcon from "@material-ui/icons/BusinessCenter";
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

  speedDial: {
    position: "fixed",
    bottom: theme.spacing(2),
    right: theme.spacing(2),
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

const actions = [
  { icon: <AttachMoneyIcon />, name: "FSM" },
  { icon: <BusinessCenterIcon />, name: "TM" },
];

const AddValidationSchema = Yup.object({
  firstName: Yup.string().required("Required"),
  lastName: Yup.string().required("Required"),
  birthDate: Yup.string().required("Required"),
  email: Yup.string()
    .required("Required")
    .email("Must be valid a email address"),
  phoneNumber: Yup.string().matches(
    /([0-9]{9,10})/,
    "Must be a valid phone number"
  ),
  username: Yup.string()
    .required("Required")
    .test("username-available", "Username is already taken", async (value) => {
      const response = await fetch(`http://localhost:5000/user/${value}`);
      const { success } = await response.json();
      return success;
    }),
  password: Yup.string()
    .required("Required")
    .min(8, "Must be at least 8 characters")
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])(?=.{8,})/,
      "Must contain at least one lowercase letter, one uppercase letter, one number and one special character"
    ),
  confirmPassword: Yup.string().oneOf(
    [Yup.ref("password"), null],
    "Passwords must match"
  ),
});
const EditvalidationSchema = Yup.object({
  firstName: Yup.string().required("Required"),
  lastName: Yup.string().required("Required"),
  birthDate: Yup.string().required("Required"),
  email: Yup.string()
    .required("Required")
    .email("Must be valid a email address"),
  phoneNumber: Yup.string().matches(
    /([0-9]{9,10})/,
    "Must be a valid phone number"
  ),
});

const credValidationSchema = Yup.object({
  password: Yup.string()
    .required("Required")
    .min(8, "Must be at least 8 characters")
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])(?=.{8,})/,
      "Must contain at least one lowercase letter, one uppercase letter, one number and one special character"
    ),
  confirmPassword: Yup.string().oneOf(
    [Yup.ref("password"), null],
    "Passwords must match"
  ),
});

const StyledTableCell = withStyles((theme) => ({
  head: {
    backgroundColor: theme.palette.primary.dark,
    color: theme.palette.common.white,
    textAlign: "right",
    paddingRight: theme.spacing(1),
  },
  body: {
    padding: theme.spacing(1),
  },
}))(TableCell);

const StyledTableRow = withStyles((theme) => ({
  root: {
    "&:hover": {
      backgroundColor: theme.palette.action.hover,
    },
  },
}))(TableRow);

export default function ExecutiveAdmin({
  list,
  title,
  description,
  options,
  branches,
}) {
  const isListEmpty = list.length === 0;
  const columns = !isListEmpty ? Object.keys(list[0]) : null;
  const classes = useStyles();
  const router = useRouter();
  const formik = useFormik({
    initialValues: {
      username: "",
      password: "",
      confirmPassword: "",
      role: "",
      firstName: "",
      middleName: "",
      lastName: "",
      birthDate: "",
      email: "",
      branch: "",
      phoneNumber: "",
    },
    enableReinitialze: true,
    validationSchema:
      mode === "add" ? AddValidationSchema : EditvalidationSchema,
    onSubmit: async (values) => {
      const userData = {
        username: values.username,
        password: values.password,
        confirmPassword: values.confirmPassword,
        role: values.role,
      };
      const staffData = {
        firstName: values.firstName,
        middleName: values.middleName,
        lastName: values.lastName,
        birthDate: values.birthDate,
        email: values.email,
        branch: values.branch,
        phoneNumber: values.phoneNumber,
      };
      switch (mode) {
        case "add":
          const addStatus = addUser(userData, staffData);
          if (addStatus) {
            setSnackbarMessage("User added successfully");
            setSuccessSnack(true);
          } else {
            setSnackbarMessage("User could not be added");
            setInfoSnack(true);
          }
          setOpenDialog(false);
          setTimeout(() => {
            router.push("/admin/executive-users");
          }, 1500);
          break;
        case "edit":
          const editStatus = editUser(staffData);
          if (editStatus) {
            setSnackbarMessage("User updated successfully");
            setSuccessSnack(true);
          } else {
            setSnackbarMessage("User could not be updated");
            setInfoSnack(true);
          }
          setOpenDialog(false);
          setTimeout(() => {
            router.push("/admin/executive-users");
          }, 1500);
          break;
        default:
          break;
      }
      const msg = `${mode} user ${rowId}\n ${JSON.stringify(values, null, 2)}`;
      console.log(msg);
    },
  });
  const credFormik = useFormik({
    initialValues: {
      username: "",
      password: "",
      confirmPassword: "",
    },
    enableReinitialze: true,
    validationSchema: credValidationSchema,
    onSubmit: async (values) => {
      // credSubmit
      // alert(JSON.stringify(values, null, 2));
      // alert(`User id -> ${rowId}`);
      const credData = {
        username: values.username,
        password: values.password,
        confirmPassword: values.confirmPassword,
      };
      const changeStatus = changeCredentials(credData);
      if (changeStatus) {
        setSnackbarMessage("User updated successfully");
        setSuccessSnack(true);
      } else {
        setSnackbarMessage("User could not be updated");
        setInfoSnack(true);
      }
      handleCredCloseDialog();
    },
  });

  const [speedDialHidden, setSpeedDialHidden] = useState(false);
  const [speedDialOpen, setSpeedDialOpen] = useState(false);
  const handleSpeedDialVisibility = () => {
    setSpeedDialHidden((prevHidden) => !prevHidden);
  };
  const handleSpeedDialOpen = () => {
    setSpeedDialOpen(true);
  };
  const handleSpeedDialClose = () => {
    setSpeedDialOpen(false);
  };

  const [dialogTitle, setDialogTitle] = useState("");
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [mode, setMode] = useState("");
  const [rowId, setRowId] = useState(null);
  const [resetUsername, setResetUsername] = useState("");
  const [openDialog, setOpenDialog] = useState(false);
  const [openCredDialog, setOpenCredDialog] = useState(false);
  const [confirmDialog, setConfirmDialog] = useState(false);
  const [successSnack, setSuccessSnack] = useState(false);
  const [infoSnack, setInfoSnack] = useState(false);

  const handleAddOpen = (role) => {
    setMode("add");
    formik.values.username = "";
    formik.values.password = "";
    formik.values.confirmPassword = "";
    formik.values.role = role;
    formik.values.firstName = "";
    formik.values.middleName = "";
    formik.values.lastName = "";
    formik.values.birthDate = "";
    formik.values.email = "";
    formik.values.branch = "";
    formik.values.phoneNumber = "";
    const role_name =
      role == 2 ? "Financial Services Manager" : "Training Manager";
    setDialogTitle(`Add a new ${role_name} user`);
    setOpenDialog(true);
  };
  const handleEditOpen = (row) => {
    setRowId(parseInt(row.staff_data.id));
    console.log(row);
    formik.values.username = row.staff_data.name;
    formik.values.password = "";
    formik.values.confirmPassword = "";
    formik.values.firstName = row.staff_data.first_name;
    formik.values.middleName = row.staff_data.middle_name
      ? row.staff_data.middle_name
      : "";
    formik.values.lastName = row.staff_data.last_name;
    formik.values.birthDate = row.staff_data.birthdate.slice(0, 10);
    formik.values.role = row.staff_data.role;
    formik.values.email = row.staff_data.email;
    formik.values.phoneNumber = row.staff_data.phone_number;
    formik.values.branch = row.staff_data.branch;
    setMode("edit");
    setDialogTitle(`Edit ${row.Name}'s account`);
    setOpenDialog(true);
  };
  const handleDeleteOpen = (row) => {
    setMode("delete");
    alert(`User id -> ${JSON.stringify(row)}`);
    setResetUsername(row.staff_data.name);
    setRowId(parseInt(row.staff_data.user_id));
    setDialogTitle(`Reset ${row.Name}'s account?`);
    setConfirmDialog(true);
  };
  const handleCredOpen = (row) => {
    setRowId(parseInt(row.staff_data.user_id));
    setMode("cred");
    credFormik.values.username = row.staff_data.name;
    setDialogTitle(`Change ${row.Name}'s  login credentials?`);
    setOpenCredDialog(true);
  };

  const handleCloseDialog = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    formik.resetForm();
    setOpenDialog(false);
  };
  const handleCredCloseDialog = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    credFormik.values.password = "";
    credFormik.values.confirmPassword = "";
    setOpenCredDialog(false);
  };
  const handleCloseConfirmDialog = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setConfirmDialog(false);
  };

  const addUser = async (userData, staffData) => {
    const userRes = await fetch(`http://localhost:5000/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(userData),
    });
    const userResponse = await userRes.json();
    console.log("User response", userResponse.user);
    staffData.userId = userResponse.user.id;
    const staffRes = await fetch(`http://localhost:5000/api/staff`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(staffData),
    });
    const staffResponse = await staffRes.json();

    console.log(
      `Registration Complete\n ${JSON.stringify({
        user: userResponse.user,
        owner: staffResponse.data,
      })}`
    );
    return true;
  };

  const resetUser = async () => {
    alert(`${mode} ${resetUsername} ${rowId}`);
    const defaultPassword =
      "@123456" +
      resetUsername[0].toUpperCase() +
      resetUsername.slice(1) +
      "22";
    const credData = {
      username: resetUsername,
      password: defaultPassword,
      confirmPassword: defaultPassword,
    };
    const changeStatus = changeCredentials(credData);
    if (changeStatus) {
      setSnackbarMessage("User reset successfully");
      setSuccessSnack(true);
    } else {
      setSnackbarMessage("User could not be reset");
      setInfoSnack(true);
    }
    handleCredCloseDialog();
  };
  const changeCredentials = async (credData) => {
    const userRes = await fetch(`http://localhost:5000/users/${rowId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(credData),
    });
    const userResponse = await userRes.json();

    console.log(
      `Update Complete\n ${JSON.stringify({
        user: userResponse.data,
      })}`
    );
    return true;
  };

  const editUser = async (staffData) => {
    console.log("Staff", staffData);
    const staffRes = await fetch(`http://localhost:5000/api/staff/${rowId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(staffData),
    });
    const staffResponse = await staffRes.json();

    console.log(
      `Update Complete\n ${JSON.stringify({
        staff: staffResponse.data,
      })}`
    );
    return true;
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
        <SpeedDial
          ariaLabel="admin-add-user-speeddial"
          color="primary"
          className={classes.speedDial}
          hidden={speedDialHidden}
          icon={<SpeedDialIcon />}
          onClose={handleSpeedDialClose}
          onOpen={handleSpeedDialOpen}
          open={speedDialOpen}
        >
          {actions.map((action) => (
            <SpeedDialAction
              key={action.name}
              color="primary"
              icon={action.icon}
              tooltipTitle={action.name}
              tooltipOpen
              onClick={() => {
                if (action.name === "TM") {
                  handleAddOpen(3);
                } else if (action.name === "FSM") {
                  handleAddOpen(2);
                }
              }}
            />
          ))}
        </SpeedDial>
        <TableContainer component={Paper}>
          <Table aria-label="executive users table">
            <TableHead>
              <StyledTableRow>
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
              </StyledTableRow>
            </TableHead>
            <TableBody>
              {list.map((row) => (
                <StyledTableRow key={row["S/N"]}>
                  {columns.map((column) => {
                    if (column === "id" || column.includes("_data")) {
                      return;
                    }
                    switch (column) {
                      case "S/N":
                        return (
                          <StyledTableCell
                            align="left"
                            component="th"
                            scope="row"
                            key={row.id}
                          >
                            {row[column]}
                          </StyledTableCell>
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
                          ) : raw_phone[0] != "+" ? (
                            <a href={`tel:+255${raw_phone.slice(1)}`}>
                              {"+255 " +
                                raw_phone
                                  .slice(0)
                                  .match(/.{1,3}/g)
                                  .join(" ")}
                            </a>
                          ) : (
                            <a href={`tel:${raw_phone}`}>
                              {raw_phone.match(/.{1,3}/g).join(" ")}
                            </a>
                          );

                        return (
                          <StyledTableCell align="right" key={column}>
                            {phone_number}
                          </StyledTableCell>
                        );
                      case "Email":
                        return (
                          <StyledTableCell align="right" key={column}>
                            <a href={`mailto:${row[column]}`}>{row[column]}</a>
                          </StyledTableCell>
                        );
                      case "Loanee":
                        return (
                          <StyledTableCell align="right" key={column}>
                            <a href={`#`}>{row[column]}</a>
                          </StyledTableCell>
                        );
                      case "Actions":
                        const actions = row[column];
                        return (
                          <StyledTableCell
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
                                        console.log("Edit row", row);
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
                                        console.log("Delete row: ", row);
                                      }}
                                      key={action.name}
                                    >
                                      Reset
                                    </Button>
                                  );
                                if (action.name === "Cred")
                                  return (
                                    <Button
                                      onClick={() => {
                                        handleCredOpen(row);
                                        console.log(
                                          "Change password row: ",
                                          row
                                        );
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
                          </StyledTableCell>
                        );
                      default:
                        return (
                          <StyledTableCell align="right" key={column}>
                            {row[column]}
                          </StyledTableCell>
                        );
                    }
                  })}
                </StyledTableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </main>
      <Dialog
        open={openDialog}
        maxWidth="md"
        fullWidth={true}
        TransitionComponent={Transition}
        keepMounted
        onClose={handleCloseDialog}
        aria-labelledby="executive-dialog-slide-title"
        aria-describedby="executive-dialog-slide-description"
      >
        <DialogTitle id="executive-dialog-slide-title">
          {dialogTitle}
        </DialogTitle>
        <form onSubmit={formik.handleSubmit} className={classes.paper}>
          <DialogContent style={{ overflow: "hidden" }}>
            <Grid container spacing={3}>
              <Grid item xs={6} className={classes.form_body}>
                <TextField
                  required
                  autoFocus
                  autoComplete="off"
                  disabled={mode !== "add"}
                  id="username"
                  name="username"
                  label="Username"
                  variant="outlined"
                  onChange={formik.handleChange}
                  value={formik.values.username}
                  error={
                    formik.touched.username && Boolean(formik.errors.username)
                  }
                  helperText={formik.touched.username && formik.errors.username}
                />
                <TextField
                  required
                  autoComplete="new-password"
                  disabled={mode !== "add"}
                  id="password"
                  name="password"
                  label="Password"
                  type="password"
                  variant="outlined"
                  onChange={formik.handleChange}
                  value={formik.values.password}
                  error={
                    formik.touched.password && Boolean(formik.errors.password)
                  }
                  helperText={formik.touched.password && formik.errors.password}
                />
                <TextField
                  required
                  disabled={mode !== "add"}
                  id="confirmPassword"
                  name="confirmPassword"
                  label="Confirm Password"
                  type="password"
                  variant="outlined"
                  onChange={formik.handleChange}
                  value={formik.values.confirmPassword}
                  error={
                    formik.touched.confirmPassword &&
                    Boolean(formik.errors.confirmPassword)
                  }
                  helperText={
                    formik.touched.confirmPassword &&
                    formik.errors.confirmPassword
                  }
                />
                <TextField
                  required
                  disabled={mode === "delete"}
                  id="email"
                  name="email"
                  label="Email Address"
                  variant="outlined"
                  onChange={formik.handleChange}
                  value={formik.values.email}
                  defaultValue={formik.values.email}
                  error={formik.touched.email && Boolean(formik.errors.email)}
                  helperText={formik.touched.email && formik.errors.email}
                />
                <TextField
                  required
                  disabled={mode === "delete"}
                  id="phoneNumber"
                  name="phoneNumber"
                  type="tel"
                  label="Phone Number"
                  variant="outlined"
                  onChange={formik.handleChange}
                  value={formik.values.phoneNumber}
                  defaultValue={formik.values.phoneNumber}
                  error={
                    formik.touched.phoneNumber &&
                    Boolean(formik.errors.phoneNumber)
                  }
                  helperText={
                    formik.touched.phoneNumber && formik.errors.phoneNumber
                  }
                  InputLabelProps={{
                    shrink: true,
                  }}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <PhoneIcon />
                        {"\t+255"}
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>
              <Grid item xs={6} className={classes.form_body}>
                <TextField
                  required
                  disabled={mode === "delete"}
                  id="firstName"
                  name="firstName"
                  label="First Name"
                  variant="outlined"
                  onChange={formik.handleChange}
                  value={formik.values.firstName}
                  defaultValue={formik.values.firstName}
                  error={
                    formik.touched.firstName && Boolean(formik.errors.firstName)
                  }
                  helperText={
                    formik.touched.firstName && formik.errors.firstName
                  }
                />
                <TextField
                  disabled={mode === "delete"}
                  id="middleName"
                  name="middleName"
                  label="Middle Name"
                  variant="outlined"
                  onChange={formik.handleChange}
                  value={formik.values.middleName}
                  defaultValue={formik.values.middleName}
                />
                <TextField
                  required
                  disabled={mode === "delete"}
                  id="lastName"
                  name="lastName"
                  label="Last Name"
                  variant="outlined"
                  onChange={formik.handleChange}
                  value={formik.values.lastName}
                  defaultValue={formik.values.lastName}
                  error={
                    formik.touched.lastName && Boolean(formik.errors.lastName)
                  }
                  helperText={formik.touched.lastName && formik.errors.lastName}
                />
                <TextField
                  required
                  disabled={mode === "delete"}
                  id="birthDate"
                  name="birthDate"
                  type="date"
                  label="Date of Birth"
                  variant="outlined"
                  onChange={formik.handleChange}
                  value={formik.values.birthDate}
                  defaultValue={formik.values.birthDate}
                  error={
                    formik.touched.birthDate && Boolean(formik.errors.birthDate)
                  }
                  helperText={
                    formik.touched.birthDate && formik.errors.birthDate
                  }
                  InputLabelProps={{
                    shrink: true,
                  }}
                />

                <Select
                  required
                  name="branch"
                  id="branch"
                  label="Branch"
                  variant="outlined"
                  displayEmpty
                  onChange={formik.handleChange}
                  value={formik.values.branch}
                >
                  <MenuItem value="" disabled>
                    <em>Select a branch</em>
                  </MenuItem>
                  {branches.map((branch) => (
                    <MenuItem key={branch.id} value={branch.id}>
                      {branch.name}
                    </MenuItem>
                  ))}
                </Select>
              </Grid>
            </Grid>
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
          </DialogActions>
        </form>
      </Dialog>
      <Dialog
        open={openCredDialog}
        maxWidth="xs"
        fullWidth={true}
        TransitionComponent={Transition}
        keepMounted
        onClose={handleCredCloseDialog}
        aria-labelledby="credentials-dialog-slide-title"
        aria-describedby="credentials-dialog-slide-description"
      >
        <DialogTitle id="credentials-dialog-slide-title">
          {dialogTitle}
        </DialogTitle>
        <form onSubmit={credFormik.handleSubmit} className={classes.paper}>
          <DialogContent className={classes.form_body}>
            <TextField
              required
              autoFocus
              autoComplete="off"
              disabled
              id="username"
              name="username"
              label="Username"
              variant="outlined"
              onChange={credFormik.handleChange}
              value={credFormik.values.username}
              error={
                credFormik.touched.username &&
                Boolean(credFormik.errors.username)
              }
              helperText={
                credFormik.touched.username && credFormik.errors.username
              }
            />
            <TextField
              required
              autoComplete="new-password"
              id="password"
              name="password"
              label="Password"
              type="password"
              variant="outlined"
              onChange={credFormik.handleChange}
              value={credFormik.values.password}
              error={
                credFormik.touched.password &&
                Boolean(credFormik.errors.password)
              }
              helperText={
                credFormik.touched.password && credFormik.errors.password
              }
            />
            <TextField
              required
              autoComplete="new-password"
              id="confirmPassword"
              name="confirmPassword"
              label="Confirm Password"
              type="password"
              variant="outlined"
              onChange={credFormik.handleChange}
              value={credFormik.values.confirmPassword}
              error={
                credFormik.touched.confirmPassword &&
                Boolean(credFormik.errors.confirmPassword)
              }
              helperText={
                credFormik.touched.confirmPassword &&
                credFormik.errors.confirmPassword
              }
            />
          </DialogContent>

          <DialogActions>
            <Button onClick={handleCredCloseDialog} color="primary">
              Close
            </Button>
            <Button onClick={credFormik.handleSubmit} color="primary">
              Change
            </Button>
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
        <DialogTitle id="confirm-dialog">{dialogTitle}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            This action is irreversible and will reset the user&apos;s password.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseConfirmDialog} color="primary">
            Close
          </Button>
          {
            <Button onClick={resetUser} color="primary">
              Reset
            </Button>
          }
        </DialogActions>
      </Dialog>
      <Snackbar
        open={successSnack}
        autoHideDuration={1000}
        onClose={() => setSuccessSnack(false)}
      >
        <Alert onClose={() => setSuccessSnack(false)} severity="success">
          {snackbarMessage}
        </Alert>
      </Snackbar>
      <Snackbar
        open={infoSnack}
        autoHideDuration={1000}
        onClose={() => setInfoSnack(false)}
      >
        <Alert onClose={() => setInfoSnack(false)} severity="info">
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </DashboardLayout>
  );
}

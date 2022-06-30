import React, { useState, forwardRef } from "react";
import { useFormik } from "formik";
import { useRouter } from "next/router";
import { makeStyles } from "@material-ui/core/styles";

import TextField from "@material-ui/core/TextField";
import Grid from "@material-ui/core/Grid";
import SpeedDial from "@material-ui/lab/SpeedDial";
import SpeedDialIcon from "@material-ui/lab/SpeedDialIcon";
import EditIcon from "@material-ui/icons/Edit";
import EditOutlinedIcon from "@material-ui/icons/EditOutlined";
import SpeedDialAction from "@material-ui/lab/SpeedDialAction";
import MenuAppBar from "./menuappbar";
import Container from "@material-ui/core/Container";
import Button from "@material-ui/core/Button";
import FormControl from "@material-ui/core/FormControl";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Radio from "@material-ui/core/Radio";
import RadioGroup from "@material-ui/core/RadioGroup";
import InputAdornment from "@material-ui/core/InputAdornment";
import PhoneIcon from "@material-ui/icons/Phone";
import Slide from "@material-ui/core/Slide";
import Select from "@material-ui/core/Select";
import FormLabel from "@material-ui/core/FormLabel";
import MenuItem from "@material-ui/core/MenuItem";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import Checkbox from "@material-ui/core/Checkbox";
import DialogTitle from "@material-ui/core/DialogTitle";
import MuiAlert from "@material-ui/lab/Alert";
import ProfileCard from "./profile-card";
import LockIcon from "@material-ui/icons/Lock";
import PersonIcon from "@material-ui/icons/Person";
import Backdrop from "@material-ui/core/Backdrop";
import CircularProgress from "@material-ui/core/CircularProgress";
import Footer from "./footer";
import Snackbar from "@material-ui/core/Snackbar";
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
    flexWrap: "wrap",
    flexDirection: "row",
    justifyContent: "center",
    "& > *": {
      margin: theme.spacing(10),
      padding: theme.spacing(1),
      width: theme.spacing(50),
      height: "fit-content",
      minHeight: theme.spacing(63),
    },
  },
  backdrop: {
    zIndex: theme.zIndex.drawer + 1,
    color: "#fff",
  },
  speedDial: {
    position: "fixed",
    bottom: theme.spacing(2),
    right: theme.spacing(2),
  },
  form_body: {
    display: "flex",
    border: "0px",
    justifyContent: "flex-start",
    flexDirection: "column",
    "& > *": {
      margin: "0.5rem",
    },
  },
}));

export default function ProfilePanel({ user, branches, sectors }) {
  const classes = useStyles();
  const router = useRouter();
  const [isOwner, setIsOwner] = useState(user && user.role == 6 ? true : false);
  const [open, setOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [successSnack, setSuccessSnack] = useState(false);
  const [infoSnack, setInfoSnack] = useState(false);
  const [ownerDialog, setOwnerDialog] = useState(false);
  const [staffDialog, setStaffDialog] = useState(false);
  const [credDialog, setCredDialog] = useState(false);

  const handleCloseStaffDialog = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    staffFormik.values.username = "";
    staffFormik.values.firstName = "";
    staffFormik.values.middleName = "";
    staffFormik.values.lastName = "";
    staffFormik.values.email = "";
    staffFormik.values.phoneNumber = "";
    staffFormik.values.branch = "";
    staffFormik.values.birthDate = "";
    setStaffDialog(false);
  };
  const handleCloseOwnerDialog = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    ownerFormik.values.firstName = "";
    ownerFormik.values.middleName = "";
    ownerFormik.values.lastName = "";
    ownerFormik.values.sex = "";
    ownerFormik.values.birthDate = "";
    ownerFormik.values.email = "";
    ownerFormik.values.phoneNumber = "";
    ownerFormik.values.address = "";
    ownerFormik.values.businessName = "";
    ownerFormik.values.businessType = "";
    ownerFormik.values.sector = "";
    ownerFormik.values.formalized = "";
    setOwnerDialog(false);
  };
  const handleCloseCredDialog = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    credFormik.values.username = "";
    credFormik.values.password = "";
    credFormik.values.oldPassword = "";
    credFormik.values.confirmPassword = "";
    setCredDialog(false);
  };

  const handleStaffOpen = () => {
    // alert(`Staff: ${JSON.stringify(user)}`);
    staffFormik.values.username = user.username;
    staffFormik.values.firstName = user.first_name;
    staffFormik.values.middleName = user.middle_name;
    staffFormik.values.lastName = user.last_name;
    staffFormik.values.email = user.email;
    staffFormik.values.phoneNumber = user.phone_number;
    staffFormik.values.branch = user.branch;
    staffFormik.values.birthDate = user.birthdate.slice(0, 10);
    setStaffDialog(true);
  };
  const handleOwnerOpen = () => {
    // alert(`Staff: ${JSON.stringify(user)}`);
    ownerFormik.values.firstName = user.first_name;
    ownerFormik.values.middleName = user.middle_name;
    ownerFormik.values.lastName = user.last_name;
    ownerFormik.values.sex = user.sex;
    ownerFormik.values.birthDate = user.birthdate.slice(0, 10);
    ownerFormik.values.email = user.email;
    ownerFormik.values.phoneNumber = user.phone_number;
    ownerFormik.values.address = user.address;
    ownerFormik.values.businessName = user.business_name;
    ownerFormik.values.businessType = user.business_type;
    ownerFormik.values.sector = user.sector_id;
    ownerFormik.values.formalized = user.formalized;
    setOwnerDialog(true);
  };

  const handleCredOpen = () => {
    credFormik.values.username = user.username;
    setCredDialog(true);
  };

  const changePassword = async (credData) => {
    const userRes = await fetch(
      `http://localhost:5000/users/change-password/${user.user_id}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(credData),
      }
    );
    const userResponse = await userRes.json();

    console.log(
      `Update Complete\n ${JSON.stringify({
        user: userResponse.data,
      })}`
    );
    return true;
  };
  const updateOwner = async (ownerData) => {
    // alert(`Owner: ${user.id}`);
    const ownerRes = await fetch(
      `http://localhost:5000/api/owners/${user.id}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(ownerData),
      }
    );
    const ownerResponse = await ownerRes.json();

    console.log(
      `Owner Updated\n ${JSON.stringify({
        user: ownerResponse.data,
      })}`
    );
    return true;
  };
  const updateStaff = async (staffData) => {
    // alert(`Owner: ${user.id}`);
    const staffRes = await fetch(
      `http://localhost:5000/api/staff/${user.id}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(staffData),
      }
    );
    const staffResponse = await staffRes.json();

    console.log(
      `Staff Updated\n ${JSON.stringify({
        staffResponse,
      })}`
    );
    return staffResponse.success;
  };

  const fields = [
    {
      label: "First Name",
      value: "John",
    },
    {
      label: "Last Name",
      value: "Doe",
    },
    {
      label: "Email",
      value: "x@x.com",
    },
    {
      label: "Phone",
      value: "123-456-7890",
    },
    {
      label: "Role",
      value: "Admin",
    },
  ];
  const actions = [
    { icon: <PersonIcon />, name: "Edit Profile", code: "profile" },
    { icon: <LockIcon />, name: "Change Password", code: "password" },
  ];

  const credValidationSchema = Yup.object({
    oldPassword: Yup.string()
      .required("Required")
      .min(8, "Must be at least 8 characters")
      .matches(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])(?=.{8,})/,
        "Must contain at least one lowercase letter, one uppercase letter, one number and one special character"
      ),
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

  const staffValidationSchema = Yup.object({
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
  const credFormik = useFormik({
    initialValues: {
      username: "",
      oldPassword: "",
      password: "",
      confirmPassword: "",
    },
    enableReinitialze: true,
    validationSchema: credValidationSchema,
    onSubmit: async (values) => {
      const credData = {
        username: values.username,
        oldPassword: values.oldPassword,
        password: values.password,
        confirmPassword: values.confirmPassword,
      };
      // alert(`Credentials: ${JSON.stringify(credData)}`);
      const changeStatus = changePassword(credData);
      if (changeStatus) {
        setSnackbarMessage("Password changed successfully");
        setSuccessSnack(true);
        handleCredCloseDialog();
        setTimeout(() => {
          router.push("/login");
        }, 1500);
      } else {
        setSnackbarMessage("User could not be updated");
        setInfoSnack(true);
      }
    },
  });
  const staffFormik = useFormik({
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
    validationSchema: staffValidationSchema,
    onSubmit: async (values) => {
      const staffData = {
        firstName: values.firstName,
        middleName: values.middleName,
        lastName: values.lastName,
        birthDate: values.birthDate,
        email: values.email,
        branch: values.branch,
        phoneNumber: values.phoneNumber,
      };
      const updateStatua = updateStaff(staffData);
      if (updateStatua) {
        setSnackbarMessage("Profile updated successfully");
        setSuccessSnack(true);
        handleCloseStaffDialog();
        setTimeout(() => {
          router.push("/profile");
        }, 1500);
      } else {
        setSnackbarMessage("User could not be updated");
        setInfoSnack(true);
      }
      setOpenDialog(false);
      setTimeout(() => {
        router.push("/admin/executive-users");
      }, 1500);
      console.log(msg);
    },
  });
  const ownerFormik = useFormik({
    initialValues: {
      firstName: "",
      middleName: "",
      lastName: "",
      sex: "",
      birthDate: "",
      email: "",
      phoneNumber: "",
      address: "",
      businessName: "",
      businessType: "",
      sector: "",
      formalized: "",
    },
    enableReinitialze: true,
    validationSchema: staffValidationSchema,
    onSubmit: async (values) => {
      const ownerData = {
        firstName: values.firstName,
        middleName: values.middleName,
        lastName: values.lastName,
        birthdate: values.birthDate,
        email: values.email,
        phoneNumber: values.phoneNumber,
        businessName: values.businessName,
        businessType: values.businessType,
        sex: values.sex,
        sector: values.sector,
        formalized: values.formalized,
        address: values.address,
      };
      // alert(`Owner: ${JSON.stringify(ownerData)}`);
      console.log(`Owner: ${JSON.stringify(ownerData)}`);
      const updateStatus = updateOwner(ownerData);
      if (updateStatus) {
        setSnackbarMessage("Profile updated successfully");
        setSuccessSnack(true);
        handleCloseOwnerDialog();
        setTimeout(() => {
          router.push("/profile");
        }, 1500);
      } else {
        setSnackbarMessage("Profile could not be updated");
        setInfoSnack(true);
      }
      setOpenDialog(false);
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

  let userData = [];
  let businessData = [];
  if (!user) {
    return (
      <Backdrop
        className={classes.backdrop}
        open={open}
        onClick={() => {
          setOpen(false);
        }}
      >
        <CircularProgress color="inherit" />
      </Backdrop>
    );
  }
  if (!isOwner) {
    // Not an owner -> a Staff
    const full_name = user.middle_name
      ? `${user.first_name} ${user.middle_name} ${user.last_name}`
      : `${user.first_name} ${user.last_name}`;
    const birthday = new Date(user.birthdate).toLocaleString("en-gb", {
      day: "numeric",
      year: "numeric",
      month: "long",
    });
    const phone_number =
      user.phone_number[0] == "0"
        ? "+255 " +
          user.phone_number
            .slice(1)
            .match(/.{1,3}/g)
            .join(" ")
        : user.phone_number.match(/.{1,3}/g).join(" ");
    userData = [
      {
        label: "Full Name",
        value: full_name,
      },
      {
        label: "Role",
        value: user.role_name,
      },
      {
        label: "Branch",
        value: user.branch_name,
      },
      {
        label: "Email",
        value: user.email,
      },
      {
        label: "Phone",
        value: phone_number,
      },
      {
        label: "Date of Birth",
        value: birthday,
      },
    ];
    businessData = null;
  } else {
    const full_name = user.middle_name
      ? `${user.first_name} ${user.middle_name} ${user.last_name}`
      : `${user.first_name} ${user.last_name}`;
    const birthday = new Date(user.birthdate).toLocaleString("en-gb", {
      day: "numeric",
      year: "numeric",
      month: "long",
    });
    const phone_number =
      user.phone_number[0] == "0"
        ? "+255 " +
          user.phone_number
            .slice(1)
            .match(/.{1,3}/g)
            .join(" ")
        : user.phone_number.match(/.{1,3}/g).join(" ");
    const userSex = (sex) => {
      switch (sex) {
        case "M":
          return "Male";
        case "F":
          return "Female";
        default:
          return "Other";
      }
    };
    const form_status = user.formalized
      ? "Formal business"
      : "Informal business";
    userData = [
      {
        label: "Full Name",
        value: full_name,
      },
      {
        label: "Sex",
        value: userSex(user.sex),
      },
      {
        label: "Date of Birth",
        value: birthday,
      },
      {
        label: "Address",
        value: user.address,
      },
      {
        label: "Email",
        value: user.email,
      },
      {
        label: "Phone",
        value: phone_number,
      },
    ];
    businessData = [
      {
        label: "Business Name",
        value: user.business_name,
      },
      {
        label: "Sector",
        value: user.sector,
      },
      {
        label: "Business Type",
        value: user.business_type,
      },
      {
        label: "Formalization Status",
        value: form_status,
      },
    ];
  }

  return (
    <>
      <MenuAppBar />
      <Container className={classes.root}>
        <ProfileCard fields={userData} type={"personal"} />
        {isOwner && <ProfileCard fields={businessData} type={"business"} />}
      </Container>
      <SpeedDial
        ariaLabel="profile-edit-user-speeddial"
        color="primary"
        className={classes.speedDial}
        hidden={speedDialHidden}
        icon={
          <SpeedDialIcon icon={<EditIcon />} openIcon={<EditOutlinedIcon />} />
        }
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
              if (action.code === "profile") {
                if (isOwner) {
                  handleOwnerOpen();
                } else {
                  handleStaffOpen();
                }
              } else if (action.code === "password") {
                handleCredOpen();
              }
            }}
          />
        ))}
      </SpeedDial>
      <Dialog
        open={staffDialog}
        maxWidth="md"
        fullWidth={true}
        TransitionComponent={Transition}
        keepMounted
        onClose={handleCloseStaffDialog}
        aria-labelledby="staff-dialog-slide-title"
        aria-describedby="staff-dialog-slide-description"
      >
        <DialogTitle id="staff-dialog-slide-title">
          Edit your profile
        </DialogTitle>
        <form onSubmit={staffFormik.handleSubmit} className={classes.paper}>
          <DialogContent style={{ overflow: "hidden" }}>
            <Grid container spacing={3}>
              <Grid item xs={6} className={classes.form_body}>
                <TextField
                  required
                  autoFocus
                  autoComplete="off"
                  disabled
                  id="username"
                  name="username"
                  label="Username"
                  variant="outlined"
                  onChange={staffFormik.handleChange}
                  value={staffFormik.values.username}
                  error={
                    staffFormik.touched.username &&
                    Boolean(staffFormik.errors.username)
                  }
                  helperText={
                    staffFormik.touched.username && staffFormik.errors.username
                  }
                />
                <TextField
                  required
                  id="firstName"
                  name="firstName"
                  label="First Name"
                  variant="outlined"
                  onChange={staffFormik.handleChange}
                  value={staffFormik.values.firstName}
                  defaultValue={staffFormik.values.firstName}
                  error={
                    staffFormik.touched.firstName &&
                    Boolean(staffFormik.errors.firstName)
                  }
                  helperText={
                    staffFormik.touched.firstName &&
                    staffFormik.errors.firstName
                  }
                />
                <TextField
                  id="middleName"
                  name="middleName"
                  label="Middle Name"
                  variant="outlined"
                  onChange={staffFormik.handleChange}
                  value={staffFormik.values.middleName}
                  defaultValue={staffFormik.values.middleName}
                />
                <TextField
                  required
                  id="lastName"
                  name="lastName"
                  label="Last Name"
                  variant="outlined"
                  onChange={staffFormik.handleChange}
                  value={staffFormik.values.lastName}
                  defaultValue={staffFormik.values.lastName}
                  error={
                    staffFormik.touched.lastName &&
                    Boolean(staffFormik.errors.lastName)
                  }
                  helperText={
                    staffFormik.touched.lastName && staffFormik.errors.lastName
                  }
                />
              </Grid>
              <Grid item xs={6} className={classes.form_body}>
                <TextField
                  required
                  id="email"
                  name="email"
                  label="Email Address"
                  variant="outlined"
                  onChange={staffFormik.handleChange}
                  value={staffFormik.values.email}
                  defaultValue={staffFormik.values.email}
                  error={
                    staffFormik.touched.email &&
                    Boolean(staffFormik.errors.email)
                  }
                  helperText={
                    staffFormik.touched.email && staffFormik.errors.email
                  }
                />
                <TextField
                  required
                  id="phoneNumber"
                  name="phoneNumber"
                  type="tel"
                  label="Phone Number"
                  variant="outlined"
                  onChange={staffFormik.handleChange}
                  value={staffFormik.values.phoneNumber}
                  defaultValue={staffFormik.values.phoneNumber}
                  error={
                    staffFormik.touched.phoneNumber &&
                    Boolean(staffFormik.errors.phoneNumber)
                  }
                  helperText={
                    staffFormik.touched.phoneNumber &&
                    staffFormik.errors.phoneNumber
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

                <TextField
                  required
                  id="birthDate"
                  name="birthDate"
                  type="date"
                  label="Date of Birth"
                  variant="outlined"
                  onChange={staffFormik.handleChange}
                  value={staffFormik.values.birthDate}
                  defaultValue={staffFormik.values.birthDate}
                  error={
                    staffFormik.touched.birthDate &&
                    Boolean(staffFormik.errors.birthDate)
                  }
                  helperText={
                    staffFormik.touched.birthDate &&
                    staffFormik.errors.birthDate
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
                  onChange={staffFormik.handleChange}
                  value={staffFormik.values.branch}
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
            <Button onClick={handleCloseStaffDialog} color="primary">
              Close
            </Button>
            <Button onClick={staffFormik.handleSubmit} color="primary">
              Edit
            </Button>
          </DialogActions>
        </form>
      </Dialog>
      <Dialog
        open={ownerDialog}
        maxWidth="md"
        fullWidth={true}
        TransitionComponent={Transition}
        keepMounted
        onClose={handleCloseOwnerDialog}
        aria-labelledby="owner-dialog-slide-title"
        aria-describedby="owner-dialog-slide-description"
      >
        <DialogTitle id="owner-dialog-slide-title">
          Edit your profile
        </DialogTitle>
        <form onSubmit={ownerFormik.handleSubmit} className={classes.paper}>
          <DialogContent style={{ overflow: "hidden" }}>
            <Grid container spacing={3}>
              <Grid item xs={4} className={classes.form_body}>
                <TextField
                  required
                  id="firstName"
                  name="firstName"
                  label="First Name"
                  variant="outlined"
                  onChange={ownerFormik.handleChange}
                  value={ownerFormik.values.firstName}
                  defaultValue={ownerFormik.values.firstName}
                  error={
                    ownerFormik.touched.firstName &&
                    Boolean(ownerFormik.errors.firstName)
                  }
                  helperText={
                    ownerFormik.touched.firstName &&
                    ownerFormik.errors.firstName
                  }
                />
                <TextField
                  id="middleName"
                  name="middleName"
                  label="Middle Name"
                  variant="outlined"
                  onChange={ownerFormik.handleChange}
                  value={ownerFormik.values.middleName}
                  defaultValue={ownerFormik.values.middleName}
                />
                <TextField
                  required
                  id="lastName"
                  name="lastName"
                  label="Last Name"
                  variant="outlined"
                  onChange={ownerFormik.handleChange}
                  value={ownerFormik.values.lastName}
                  defaultValue={ownerFormik.values.lastName}
                  error={
                    ownerFormik.touched.lastName &&
                    Boolean(ownerFormik.errors.lastName)
                  }
                  helperText={
                    ownerFormik.touched.lastName && ownerFormik.errors.lastName
                  }
                />
                <FormControl component="fieldset">
                  <FormLabel component="legend">Sex</FormLabel>
                  <RadioGroup
                    aria-label="sex"
                    name="sex"
                    className={classes.sex}
                    value={
                      ownerFormik.values.sex !== ""
                        ? ownerFormik.values.sex
                        : "F"
                    }
                    onChange={ownerFormik.handleChange}
                  >
                    <FormControlLabel
                      value="F"
                      control={<Radio />}
                      label="Female"
                    />
                    <FormControlLabel
                      value="M"
                      control={<Radio />}
                      label="Male"
                    />
                    <FormControlLabel
                      value="O"
                      control={<Radio />}
                      label="Other"
                    />
                  </RadioGroup>
                </FormControl>
              </Grid>
              <Grid item xs={4} className={classes.form_body}>
                <TextField
                  required
                  fullWidth
                  id="birthDate"
                  name="birthDate"
                  type="date"
                  label="Date of Birth"
                  variant="outlined"
                  onChange={ownerFormik.handleChange}
                  value={ownerFormik.values.birthDate}
                  defaultValue={ownerFormik.values.birthDate}
                  error={
                    ownerFormik.touched.birthDate &&
                    Boolean(ownerFormik.errors.birthDate)
                  }
                  helperText={
                    ownerFormik.touched.birthDate &&
                    ownerFormik.errors.birthDate
                  }
                  InputLabelProps={{
                    shrink: true,
                  }}
                />
                <TextField
                  required
                  fullWidth
                  id="email"
                  name="email"
                  label="Email Address"
                  variant="outlined"
                  onChange={ownerFormik.handleChange}
                  value={ownerFormik.values.email}
                  defaultValue={ownerFormik.values.email}
                  error={
                    ownerFormik.touched.email &&
                    Boolean(ownerFormik.errors.email)
                  }
                  helperText={
                    ownerFormik.touched.email && ownerFormik.errors.email
                  }
                />
                <TextField
                  required
                  fullWidth
                  id="phoneNumber"
                  name="phoneNumber"
                  type="tel"
                  label="Phone Number"
                  variant="outlined"
                  onChange={ownerFormik.handleChange}
                  value={ownerFormik.values.phoneNumber}
                  defaultValue={ownerFormik.values.phoneNumber}
                  error={
                    ownerFormik.touched.phoneNumber &&
                    Boolean(ownerFormik.errors.phoneNumber)
                  }
                  helperText={
                    ownerFormik.touched.phoneNumber &&
                    ownerFormik.errors.phoneNumber
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
                <TextField
                  fullWidth
                  multiline
                  rows={4}
                  margin="normal"
                  id="address"
                  name="address"
                  label="Address"
                  variant="outlined"
                  value={ownerFormik.values.address}
                  error={
                    ownerFormik.touched.address &&
                    Boolean(ownerFormik.errors.address)
                  }
                  helperText={
                    ownerFormik.touched.address && ownerFormik.errors.address
                  }
                  onChange={ownerFormik.handleChange}
                  InputLabelProps={{
                    shrink: true,
                  }}
                />
              </Grid>
              <Grid item xs={4} className={classes.form_body}>
                <TextField
                  required
                  id="businessName"
                  name="businessName"
                  label="Business Name"
                  variant="outlined"
                  onChange={ownerFormik.handleChange}
                  value={ownerFormik.values.businessName}
                  defaultValue={ownerFormik.values.businessName}
                  error={
                    ownerFormik.touched.businessName &&
                    Boolean(ownerFormik.errors.businessName)
                  }
                  helperText={
                    ownerFormik.touched.businessName &&
                    ownerFormik.errors.businessName
                  }
                />
                <TextField
                  required
                  id="businessType"
                  name="businessType"
                  label="Business Type"
                  variant="outlined"
                  onChange={ownerFormik.handleChange}
                  value={ownerFormik.values.businessType}
                  defaultValue={ownerFormik.values.businessType}
                  error={
                    ownerFormik.touched.businessType &&
                    Boolean(ownerFormik.errors.businessType)
                  }
                  helperText={
                    ownerFormik.touched.businessType &&
                    ownerFormik.errors.businessType
                  }
                />
                <Select
                  required
                  name="sector"
                  id="sector"
                  label="sector"
                  variant="outlined"
                  displayEmpty
                  onChange={ownerFormik.handleChange}
                  value={ownerFormik.values.sector}
                >
                  <MenuItem value="" disabled>
                    <em>Select a sector</em>
                  </MenuItem>
                  {sectors.map((sector) => (
                    <MenuItem key={sector.id} value={sector.id}>
                      {sector.name}
                    </MenuItem>
                  ))}
                </Select>
                <FormControlLabel
                  margin="normal"
                  control={
                    <Checkbox
                      margin="normal"
                      checked={ownerFormik.values.formalized}
                      onChange={ownerFormik.handleChange}
                      name="formalized"
                    />
                  }
                  label="Formalized"
                />
              </Grid>
            </Grid>
          </DialogContent>

          <DialogActions>
            <Button onClick={handleCloseOwnerDialog} color="primary">
              Close
            </Button>
            <Button onClick={ownerFormik.handleSubmit} color="primary">
              Edit
            </Button>
          </DialogActions>
        </form>
      </Dialog>

      <Dialog
        open={credDialog}
        maxWidth="xs"
        fullWidth={true}
        TransitionComponent={Transition}
        keepMounted
        onClose={handleCloseCredDialog}
        aria-labelledby="credentials-dialog-slide-title"
        aria-describedby="credentials-dialog-slide-description"
      >
        <DialogTitle id="credentials-dialog-slide-title">
          {`Change your password`}
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
              id="oldPassword"
              name="oldPassword"
              label="Old Password"
              type="password"
              variant="outlined"
              onChange={credFormik.handleChange}
              value={credFormik.values.oldPassword}
              error={
                credFormik.touched.oldPassword &&
                Boolean(credFormik.errors.oldPassword)
              }
              helperText={
                credFormik.touched.oldPassword && credFormik.errors.oldPassword
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
            <Button onClick={handleCloseCredDialog} color="primary">
              Close
            </Button>
            <Button onClick={credFormik.handleSubmit} color="primary">
              Change
            </Button>
          </DialogActions>
        </form>
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
      <Footer />
    </>
  );
}

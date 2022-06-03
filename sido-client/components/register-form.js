import React from "react";
import { Formik } from "formik";
import * as Yup from "yup";

import Avatar from "@material-ui/core/Avatar";
import Button from "@material-ui/core/Button";
import { Fab } from "@material-ui/core";
import Radio from "@material-ui/core/Radio";
import RadioGroup from "@material-ui/core/RadioGroup";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import FormControl from "@material-ui/core/FormControl";
import FormLabel from "@material-ui/core/FormLabel";
import InputAdornment from "@material-ui/core/InputAdornment";

import CssBaseline from "@material-ui/core/CssBaseline";
import TextField from "@material-ui/core/TextField";
import Grid from "@material-ui/core/Grid";
import PersonAddIcon from "@material-ui/icons/PersonAdd";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";
import Container from "@material-ui/core/Container";
import { useRouter } from "next/router";
import { useRegisterContext } from "../context/RegisterContext";

const useStyles = makeStyles((theme) => ({
  paper: {
    marginTop: theme.spacing(1),
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main,
  },
  form: {
    width: "100%", // Fix IE 11 issue.
    marginTop: theme.spacing(1),
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
  },
  sex: {
    display: "flex",
    flexWrap: "wrap",
    flexDirection: "row",
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
}));

export default function RegisterForm() {
  const classes = useStyles();
  const router = useRouter();
  const { account, setAccount, owner, setOwner } = useRegisterContext();
  const initAccount = account ? account : "";
  const initOwner = owner ? owner : "";

  return (
    <Container component="main" maxWidth="lg">
      <CssBaseline />
      <div className={classes.paper}>
        <Avatar className={classes.avatar}>
          <PersonAddIcon />
        </Avatar>
        <Typography component="h1" variant="h5">
          Register a new account
        </Typography>
        <Formik
          initialValues={{
            first_name: initOwner.first_name,
            middle_name: initOwner.middle_name,
            last_name: initOwner.last_name,
            birthdate: initOwner.birthdate,
            sex: initOwner.sex,
            email: initOwner.email,
            address: initOwner.address,
            phone_number: initOwner.phone_number,
            username: initAccount.username,
            password: initAccount.password,
            confirm_password: initAccount.confirm_password,
          }}
          validationSchema={Yup.object({
            first_name: Yup.string().required("Required"),
            last_name: Yup.string().required("Required"),
            birthdate: Yup.string().required("Required"),
            sex: Yup.mixed().oneOf(["M", "F", "O"]).defined(),
            email: Yup.string()
              .required("Required")
              .email("Must be valid a email address"),
            phone_number: Yup.string().matches(
              /([0-9]{9,10})/,
              "Must be a valid phone number"
            ),
            username: Yup.string()
              .required("Required")
              .test(
                "username-available",
                "Username is already taken",
                async (value) => {
                  const response = await fetch(
                    `http://localhost:5000/user/${value}`
                  );
                  const { success } = await response.json();
                  return success;
                }
              ),
            password: Yup.string()
              .required("Required")
              .min(8, "Must be at least 8 characters")
              .matches(
                /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])(?=.{8,})/,
                "Must contain at least one lowercase letter, one uppercase letter, one number and one special character"
              ),
            confirm_password: Yup.string().oneOf(
              [Yup.ref("password"), null],
              "Passwords must match"
            ),
          })}
          onSubmit={(values, { setSubmitting }) => {
            // // alert(`Starting...`);
            setAccount({
              username: values.username,
              password: values.password,
              confirm_password: values.confirm_password,
            });
            setOwner({
              first_name: values.first_name,
              middle_name: values.middle_name,
              last_name: values.last_name,
              birthdate: values.birthdate,
              sex: values.sex,
              email: values.email,
              address: values.address,
              phone_number: values.phone_number,
            });
            console.log("Account details", account.username);
            console.log("Owner details", owner);
            // // alert(`Owner ${JSON.stringify(owner)}`);
            // // alert("Success!");
            router.push("/register-business");
          }}
        >
          {(formik) => (
            <form onSubmit={formik.handleSubmit} className={classes.form}>
              <Grid container spacing={2}>
                <Grid item xs={4}>
                  <TextField
                    variant="outlined"
                    margin="normal"
                    required
                    fullWidth
                    id="username"
                    label="Username"
                    name="username"
                    autoFocus
                    autocomplete="off"
                    error={
                      formik.touched.username && Boolean(formik.errors.username)
                    }
                    helperText={
                      formik.touched.username && formik.errors.username
                    }
                    onChange={formik.handleChange}
                  />
                  <TextField
                    variant="outlined"
                    margin="normal"
                    required
                    fullWidth
                    name="password"
                    label="Password"
                    type="password"
                    id="password"
                    autoComplete="new-password"
                    error={
                      formik.touched.password && Boolean(formik.errors.password)
                    }
                    helperText={
                      formik.touched.password && formik.errors.password
                    }
                    onChange={formik.handleChange}
                  />
                  <TextField
                    variant="outlined"
                    margin="normal"
                    required
                    fullWidth
                    name="confirm_password"
                    label="Confirm Password"
                    type="password"
                    id="confirm_password"
                    error={
                      formik.touched.confirm_password &&
                      Boolean(formik.errors.confirm_password)
                    }
                    helperText={
                      formik.touched.confirm_password &&
                      formik.errors.confirm_password
                    }
                    onChange={formik.handleChange}
                  />
                </Grid>
                <Grid item xs={4}>
                  <TextField
                    required
                    fullWidth
                    margin="normal"
                    id="first_name"
                    name="first_name"
                    label="First Name"
                    variant="outlined"
                    error={
                      formik.touched.first_name &&
                      Boolean(formik.errors.first_name)
                    }
                    helperText={
                      formik.touched.first_name && formik.errors.first_name
                    }
                    onChange={formik.handleChange}
                  />
                  <TextField
                    fullWidth
                    margin="normal"
                    id="middle_name"
                    name="middle_name"
                    label="Middle Name"
                    variant="outlined"
                    error={
                      formik.touched.middle_name &&
                      Boolean(formik.errors.middle_name)
                    }
                    helperText={
                      formik.touched.middle_name && formik.errors.middle_name
                    }
                    onChange={formik.handleChange}
                  />
                  <TextField
                    required
                    fullWidth
                    margin="normal"
                    id="last_name"
                    name="last_name"
                    label="Last Name"
                    variant="outlined"
                    error={
                      formik.touched.last_name &&
                      Boolean(formik.errors.last_name)
                    }
                    helperText={
                      formik.touched.last_name && formik.errors.last_name
                    }
                    onChange={formik.handleChange}
                  />
                  <TextField
                    required
                    fullWidth
                    margin="normal"
                    id="birthdate"
                    name="birthdate"
                    type="date"
                    label="Date of Birth"
                    variant="outlined"
                    error={
                      formik.touched.birthdate &&
                      Boolean(formik.errors.birthdate)
                    }
                    helperText={
                      formik.touched.birthdate && formik.errors.birthdate
                    }
                    InputLabelProps={{ shrink: true }}
                    onChange={formik.handleChange}
                  />
                  <FormControl component="fieldset">
                    <FormLabel component="legend">Sex</FormLabel>
                    <RadioGroup
                      aria-label="sex"
                      name="sex"
                      className={classes.sex}
                      value={formik.values.sex !== "" ? formik.values.sex : "F"}
                      onChange={formik.handleChange}
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
                <Grid item xs={4}>
                  <TextField
                    fullWidth
                    margin="normal"
                    id="email"
                    name="email"
                    type="email"
                    label="Email Address"
                    variant="outlined"
                    error={formik.touched.email && Boolean(formik.errors.email)}
                    helperText={formik.touched.email && formik.errors.email}
                    onChange={formik.handleChange}
                  />
                  <TextField
                    fullWidth
                    multiline
                    rows={4}
                    margin="normal"
                    id="address"
                    name="address"
                    label="Postal Address"
                    variant="outlined"
                    error={
                      formik.touched.address && Boolean(formik.errors.address)
                    }
                    helperText={formik.touched.address && formik.errors.address}
                    onChange={formik.handleChange}
                  />
                  <TextField
                    fullWidth
                    margin="normal"
                    id="phone_number"
                    name="phone_number"
                    label="Phone Number"
                    variant="outlined"
                    error={
                      formik.touched.phone_number &&
                      Boolean(formik.errors.phone_number)
                    }
                    helperText={
                      formik.touched.phone_number && formik.errors.phone_number
                    }
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">+255</InputAdornment>
                      ),
                    }}
                    onChange={formik.handleChange}
                  />
                </Grid>
              </Grid>

              <Button
                type="submit"
                margin="normal"
                variant="contained"
                color="primary"
                className={classes.submit}
              >
                CONTINUE
              </Button>
            </form>
          )}
        </Formik>
      </div>
    </Container>
  );
}

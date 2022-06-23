import React from "react";
import { Formik } from "formik";
import * as Yup from "yup";

import Avatar from "@material-ui/core/Avatar";
import Button from "@material-ui/core/Button";
import Radio from "@material-ui/core/Radio";
import RadioGroup from "@material-ui/core/RadioGroup";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import FormControl from "@material-ui/core/FormControl";
import FormLabel from "@material-ui/core/FormLabel";
import InputAdornment from "@material-ui/core/InputAdornment";
import Card from "@material-ui/core/Card";
import CardActions from "@material-ui/core/CardActions";
import CardContent from "@material-ui/core/CardContent";
import CssBaseline from "@material-ui/core/CssBaseline";
import TextField from "@material-ui/core/TextField";
import Grid from "@material-ui/core/Grid";
import PersonAddIcon from "@material-ui/icons/PersonAdd";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";
import Container from "@material-ui/core/Container";
import { useRouter } from "next/router";
import { useRegisterContext } from "../context/RegisterContext";
import { useLoanContext } from "../context/LoanContext";

const useStyles = makeStyles((theme) => ({
  header: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  witnesses: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    "& > *": {
      margin: theme.spacing(1),
    },
  },
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

export default function WitnessRegister() {
  const classes = useStyles();
  const router = useRouter();
  const { account, setAccount, owner, setOwner } = useRegisterContext();
  const { witness1, witness2, setWitness1, setWitness2, loanData } =
    useLoanContext();
  const initAccount = account ? account : "";
  const initWitness1 = witness1 ? witness1 : "";
  const initWitness2 = witness2 ? witness2 : "";

  return (
    <Container component="main" maxWidth="lg">
      <CssBaseline />
      <div className={classes.paper}>
        <Formik
          initialValues={{
            first_name1: initWitness1.first_name,
            middle_name1: initWitness1.middle_name,
            last_name1: initWitness1.last_name,
            birthdate1: initWitness1.birthdate,
            sex1: initWitness1.sex,
            email1: initWitness1.email,
            address1: initWitness1.address,
            phone_number1: initWitness1.phone_number,
            first_name2: initWitness2.first_name,
            middle_name2: initWitness2.middle_name,
            last_name2: initWitness2.last_name,
            birthdate2: initWitness2.birthdate,
            sex2: initWitness2.sex,
            email2: initWitness2.email,
            address2: initWitness2.address,
            phone_number2: initWitness2.phone_number,
          }}
          validationSchema={Yup.object({
            first_name1: Yup.string().required("Required"),
            middle_name1: Yup.string().required("Required"),
            last_name1: Yup.string().required("Required"),
            birthdate1: Yup.string().required("Required"),
            sex1: Yup.mixed().oneOf(["M", "F", "O"]).defined(),
            email1: Yup.string()
              .required("Required")
              .email("Must be valid a email address"),
            phone_number1: Yup.string().matches(
              /([0-9]{9,10})/,
              "Must be a valid phone number"
            ),
            first_name2: Yup.string().required("Required"),
            middle_name2: Yup.string().required("Required"),
            last_name2: Yup.string().required("Required"),
            birthdate2: Yup.string().required("Required"),
            sex2: Yup.mixed().oneOf(["M", "F", "O"]).defined(),
            email2: Yup.string()
              .required("Required")
              .email("Must be valid a email address"),
            phone_number2: Yup.string().matches(
              /([0-9]{9,10})/,
              "Must be a valid phone number"
            ),
          })}
          onSubmit={(values, { setSubmitting }) => {
            alert(`Starting...`);
            setWitness1({
              first_name: values.first_name1,
              middle_name: values.middle_name1,
              last_name: values.last_name1,
              birthdate: values.birthdate1,
              sex: values.sex1,
              email: values.email1,
              address: values.address1,
              phone_number: values.phone_number1,
            });
            setWitness2({
              first_name: values.first_name2,
              middle_name: values.middle_name2,
              last_name: values.last_name2,
              birthdate: values.birthdate2,
              sex: values.sex2,
              email: values.email2,
              address: values.address2,
              phone_number: values.phone_number2,
            });
            console.log("One details", witness1);
            console.log("Two details", witness2);
            alert(`Witness 1 ${JSON.stringify(witness1)}`);
            alert(`Witness 2 ${JSON.stringify(witness2)}`);
            alert(`Loan:  ${JSON.stringify(loanData)}`);
            alert("Success!");
            router.push("/disburse-loan");
          }}
        >
          {(formik) => (
            <form onSubmit={formik.handleSubmit} className={classes.form}>
              <div className={classes.witnesses}>
                <Card className={classes.root}>
                  <CardContent>
                    <div className={classes.header}>
                      <Avatar className={classes.avatar}>
                        <PersonAddIcon />
                      </Avatar>
                      <Typography variant="h5" component="h2">
                        Witness 1
                      </Typography>
                    </div>

                    <TextField
                      required
                      fullWidth
                      margin="normal"
                      id="first_name1"
                      name="first_name1"
                      label="First Name"
                      variant="outlined"
                      error={
                        formik.touched.first_name1 &&
                        Boolean(formik.errors.first_name1)
                      }
                      helperText={
                        formik.touched.first_name1 && formik.errors.first_name1
                      }
                      onChange={formik.handleChange}
                    />
                    <TextField
                      required
                      fullWidth
                      margin="normal"
                      id="middle_name1"
                      name="middle_name1"
                      label="Middle Name"
                      variant="outlined"
                      error={
                        formik.touched.middle_name1 &&
                        Boolean(formik.errors.middle_name1)
                      }
                      helperText={
                        formik.touched.middle_name1 &&
                        formik.errors.middle_name1
                      }
                      onChange={formik.handleChange}
                    />
                    <TextField
                      required
                      fullWidth
                      margin="normal"
                      id="last_name1"
                      name="last_name1"
                      label="Last Name"
                      variant="outlined"
                      error={
                        formik.touched.last_name1 &&
                        Boolean(formik.errors.last_name1)
                      }
                      helperText={
                        formik.touched.last_name1 && formik.errors.last_name1
                      }
                      onChange={formik.handleChange}
                    />
                    <TextField
                      required
                      fullWidth
                      margin="normal"
                      id="birthdate1"
                      name="birthdate1"
                      type="date"
                      label="Date of Birth"
                      variant="outlined"
                      error={
                        formik.touched.birthdate1 &&
                        Boolean(formik.errors.birthdate1)
                      }
                      helperText={
                        formik.touched.birthdate1 && formik.errors.birthdate1
                      }
                      InputLabelProps={{ shrink: true }}
                      onChange={formik.handleChange}
                    />
                    <FormControl component="fieldset">
                      <FormLabel component="legend">Sex</FormLabel>
                      <RadioGroup
                        aria-label="sex"
                        id="sex1"
                        name="sex1"
                        className={classes.sex}
                        value={
                          formik.values.sex1 !== "" ? formik.values.sex1 : "F"
                        }
                        error={
                          formik.touched.sex1 && Boolean(formik.errors.sex1)
                        }
                        helperText={formik.touched.sex1 && formik.errors.sex1}
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
                    <TextField
                      fullWidth
                      margin="normal"
                      id="email1"
                      name="email1"
                      type="email"
                      label="Email Address"
                      variant="outlined"
                      error={
                        formik.touched.email1 && Boolean(formik.errors.email1)
                      }
                      helperText={formik.touched.email1 && formik.errors.email1}
                      onChange={formik.handleChange}
                    />
                    <TextField
                      fullWidth
                      margin="normal"
                      id="phone_number1"
                      name="phone_number1"
                      label="Phone Number"
                      variant="outlined"
                      error={
                        formik.touched.phone_number1 &&
                        Boolean(formik.errors.phone_number1)
                      }
                      helperText={
                        formik.touched.phone_number1 &&
                        formik.errors.phone_number1
                      }
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">+255</InputAdornment>
                        ),
                      }}
                      onChange={formik.handleChange}
                    />
                  </CardContent>
                </Card>
                <Card className={classes.root}>
                  <CardContent>
                    <div className={classes.header}>
                      <Avatar className={classes.avatar}>
                        <PersonAddIcon />
                      </Avatar>
                      <Typography variant="h5" component="h2">
                        Witness 2
                      </Typography>
                    </div>

                    <TextField
                      required
                      fullWidth
                      margin="normal"
                      id="first_name2"
                      name="first_name2"
                      label="First Name"
                      variant="outlined"
                      error={
                        formik.touched.first_name2 &&
                        Boolean(formik.errors.first_name2)
                      }
                      helperText={
                        formik.touched.first_name2 && formik.errors.first_name2
                      }
                      onChange={formik.handleChange}
                    />
                    <TextField
                      required
                      fullWidth
                      margin="normal"
                      id="middle_name2"
                      name="middle_name2"
                      label="Middle Name"
                      variant="outlined"
                      error={
                        formik.touched.middle_name2 &&
                        Boolean(formik.errors.middle_name2)
                      }
                      helperText={
                        formik.touched.middle_name2 &&
                        formik.errors.middle_name2
                      }
                      onChange={formik.handleChange}
                    />
                    <TextField
                      required
                      fullWidth
                      margin="normal"
                      id="last_name2"
                      name="last_name2"
                      label="Last Name"
                      variant="outlined"
                      error={
                        formik.touched.last_name2 &&
                        Boolean(formik.errors.last_name2)
                      }
                      helperText={
                        formik.touched.last_name2 && formik.errors.last_name2
                      }
                      onChange={formik.handleChange}
                    />
                    <TextField
                      required
                      fullWidth
                      margin="normal"
                      id="birthdate2"
                      name="birthdate2"
                      type="date"
                      label="Date of Birth"
                      variant="outlined"
                      error={
                        formik.touched.birthdate2 &&
                        Boolean(formik.errors.birthdate2)
                      }
                      helperText={
                        formik.touched.birthdate2 && formik.errors.birthdate2
                      }
                      InputLabelProps={{ shrink: true }}
                      onChange={formik.handleChange}
                    />
                    <FormControl component="fieldset">
                      <FormLabel component="legend">Sex</FormLabel>
                      <RadioGroup
                        aria-label="sex"
                        id="sex2"
                        name="sex2"
                        className={classes.sex}
                        value={
                          formik.values.sex2 !== "" ? formik.values.sex2 : "F"
                        }
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
                    <TextField
                      fullWidth
                      margin="normal"
                      id="email2"
                      name="email2"
                      type="email"
                      label="Email Address"
                      variant="outlined"
                      error={
                        formik.touched.email2 && Boolean(formik.errors.email2)
                      }
                      helperText={formik.touched.email2 && formik.errors.email2}
                      onChange={formik.handleChange}
                    />
                    <TextField
                      fullWidth
                      margin="normal"
                      id="phone_number2"
                      name="phone_number2"
                      label="Phone Number"
                      variant="outlined"
                      error={
                        formik.touched.phone_number2 &&
                        Boolean(formik.errors.phone_number2)
                      }
                      helperText={
                        formik.touched.phone_number2 &&
                        formik.errors.phone_number2
                      }
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">+255</InputAdornment>
                        ),
                      }}
                      onChange={formik.handleChange}
                    />
                  </CardContent>
                </Card>
              </div>
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

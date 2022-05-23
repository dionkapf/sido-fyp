import React from "react";
import { useFormik } from "formik";
import { useLoanRequest } from "../context/LoanRequestContext";
import { useRouter } from "next/router";
import { makeStyles } from "@material-ui/core/styles";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import InputAdornment from "@material-ui/core/InputAdornment";
import * as Yup from "yup";

const validationSchema = Yup.object({
  worth: Yup.number()
    .required("Required")
    .positive("Must be a positive number")
    .integer("Must be an integer")
    .min(50000, "Must be worth at least TSh 50 000"),
});

const useStyles = makeStyles((theme) => ({
  paper: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    padding: "10px",
    "& > *": {
      margin: theme.spacing(1),
      minWidth: "100%",
    },
  },

  form: {
    marginTop: theme.spacing(1),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
}));

export default function AddCollateral() {
  const classes = useStyles();
  const router = useRouter();
  const { loanRequest, setLoanRequest, collateral, setCollateral } =
    useLoanRequest();

  const formik = useFormik({
    initialValues: {
      name: "",
      type: "",
      worth: "",
    },
    validationSchema: validationSchema,
    onSubmit: (values) => {
      setCollateral(values);
      console.log("Collateral added", values);
      router.push("/loan-request-confirm");
    },
  });

  return (
    <form onSubmit={formik.handleSubmit} className={classes.paper}>
      <TextField
        required
        autoFocus
        id="name"
        name="name"
        label="Item Name"
        variant="outlined"
        onChange={formik.handleChange}
        defaultValue={formik.values.name}
      />
      <TextField
        required
        id="type"
        name="type"
        label="Description"
        variant="outlined"
        onChange={formik.handleChange}
        defaultValue={formik.values.type}
      />
      <TextField
        required
        id="worth"
        name="worth"
        label="Worth"
        variant="outlined"
        onChange={formik.handleChange}
        value={formik.values.worth}
        error={formik.touched.worth && Boolean(formik.errors.worth)}
        helperText={formik.touched.worth && formik.errors.worth}
        InputProps={{
          startAdornment: <InputAdornment position="start">TSh</InputAdornment>,
        }}
      />
      <Button
        type="submit"
        fullWidth
        variant="contained"
        color="primary"
        className={classes.submit}
      >
        ADD COLLATERAL
      </Button>
    </form>
  );
}

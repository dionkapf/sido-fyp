import React from "react";
import { useFormik } from "formik";
import { useAuth } from "../context/AuthContext";
import { makeStyles } from "@material-ui/core/styles";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import InputAdornment from "@material-ui/core/InputAdornment";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import * as Yup from "yup";

const validationSchema = Yup.object({
  amount: Yup.number()
    .required("Required")
    .positive("Must be a positive number")
    .integer("Must be an integer")
    .min(1, "Must be greater than 0")
    .max(15000000, "Must be less than TSh 15 000 000"),
});

const useStyles = makeStyles((theme) => ({
  paper: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    border: "0.15rem solid",
    borderColor: theme.palette.primary.main,
    borderRadius: "10px",
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

export default function LoanRequest({ branches }) {
  const classes = useStyles();
  const { user, setUser, isLoading, setIsLoading } = useAuth();
  const ownerName = user ? `${user.first_name} ${user.last_name}` : "null";
  const formik = useFormik({
    initialValues: {
      user: ownerName,
      amount: "",
      branch: "",
    },
    validationSchema,
    onSubmit: (values) => {
      alert(JSON.stringify(values, null, 2));
    },
  });

  // console.log("branches in comp", branches);
  return (
    <form onSubmit={formik.handleSubmit} className={classes.paper}>
      <TextField
        disabled
        id="user"
        name="user"
        label="Business Owner"
        variant="outlined"
        onChange={formik.handleChange}
        defaultValue={formik.values.user}
      />
      <TextField
        required
        id="amount"
        name="amount"
        label="Amount"
        variant="outlined"
        onChange={formik.handleChange}
        value={formik.values.amount}
        InputProps={{
          startAdornment: <InputAdornment position="start">TZS</InputAdornment>,
        }}
        error={formik.touched.amount && Boolean(formik.errors.amount)}
        helperText={formik.errors.amount}
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
      <Button
        type="submit"
        fullWidth
        variant="contained"
        color="primary"
        className={classes.submit}
      >
        CONTINUE
      </Button>
    </form>
  );
}

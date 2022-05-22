import React from "react";
import { useFormik } from "formik";
import { useAuth } from "../context/AuthContext";
import { useRouter } from "next/router";
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
    .min(100000, "Loans start at TSh 100 000")
    .max(15000000, "You can only borrow up to TSh 15 000 000"),
  branch: Yup.string().required("Required"),
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

export default function LoanRequest({ branches }) {
  const classes = useStyles();
  const router = useRouter();
  const { user, setUser, isLoading, setIsLoading } = useAuth();
  const ownerName = user ? `${user.first_name} ${user.last_name}` : "null";
  const id = user ? user.id : "null";
  const formik = useFormik({
    initialValues: {
      loanee: id,
      branch: "",
      amount: "",
      status: "pending",
    },
    validationSchema: validationSchema,
    onSubmit: (values) => {
      const request = JSON.stringify(values, null, 2);
      localStorage.setItem("loanRequest", request);
      router.push("/register-collateral");
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
        defaultValue={ownerName}
      />
      <TextField
        required
        autoFocus
        id="amount"
        name="amount"
        label="Amount"
        variant="outlined"
        onChange={formik.handleChange}
        value={formik.values.amount}
        error={formik.touched.amount && Boolean(formik.errors.amount)}
        helperText={formik.touched.amount && formik.errors.amount}
        InputProps={{
          startAdornment: <InputAdornment position="start">TSh</InputAdornment>,
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

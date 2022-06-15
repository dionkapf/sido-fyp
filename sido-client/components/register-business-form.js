import React from "react";
import { Formik } from "formik";
import { Yup } from "yup";

import Avatar from "@material-ui/core/Avatar";
import Button from "@material-ui/core/Button";
import Checkbox from "@material-ui/core/Checkbox";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import FormControl from "@material-ui/core/FormControl";
import FormLabel from "@material-ui/core/FormLabel";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";

import CssBaseline from "@material-ui/core/CssBaseline";
import TextField from "@material-ui/core/TextField";
import BusinessCenterIcon from "@material-ui/icons/BusinessCenter";
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

export default function RegisterBusinessForm({ sectors }) {
  const classes = useStyles();
  const router = useRouter();
  const { business, setBusiness, owner } = useRegisterContext();
  const initBusinessName = business ? business.name : "";
  const initBusinessType = business ? business.type : "";
  const initSector = business ? business.sector : "";
  const initFormalized = business ? business.formalized : false;

  return (
    <Container component="main" maxWidth="xs">
      <CssBaseline />
      <div className={classes.paper}>
        <Avatar className={classes.avatar}>
          <BusinessCenterIcon />
        </Avatar>
        <Typography component="h1" variant="h5">
          Register your business
        </Typography>
        <Formik
          initialValues={{
            business_name: initBusinessName,
            sector: initSector,
            business_type: initBusinessType,
            formalized: initFormalized,
          }}
          onSubmit={async (values, { setSubmitting }) => {
values.sector_details = sectors.find(
              (sector) => sector.id === values.sector
            );
            await setBusiness(values);
            // // alert(`Business ${JSON.stringify(business)}`);
            // // alert(`Owner ${JSON.stringify(owner)}`);
            console.log("Business is now: ", business);
            router.push("/confirm-registration");
          }}
        >
          {(formik) => (
            <form onSubmit={formik.handleSubmit} className={classes.form}>
              <TextField
                required
                fullWidth
                autoFocus
                margin="normal"
                id="business_name"
                name="business_name"
                label="Business Name"
                variant="outlined"
                onChange={formik.handleChange}
              />
              <TextField
                required
                fullWidth
                margin="normal"
                id="business_type"
                name="business_type"
                label="Business Description"
                variant="outlined"
                onChange={formik.handleChange}
              />
              <Select
                required
                fullWidth
                margin="normal"
                name="sector"
                id="sector"
                label="Sector"
                variant="outlined"
                displayEmpty
                onChange={formik.handleChange}
                value={formik.values.sector}
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
                    checked={formik.values.formalized}
                    onChange={formik.handleChange}
                    name="formalized"
                  />
                }
                label="My business is already formalized"
              />
              <Button
                fullWidth
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

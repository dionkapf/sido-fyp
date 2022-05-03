import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Paper from "@material-ui/core/Paper";
import Typography from "@material-ui/core/Typography";
import PersonIcon from "@material-ui/icons/Person";
import BusinessCenterIcon from "@material-ui/icons/BusinessCenter";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";

const useStyles = makeStyles((theme) => ({
  root: {
    margin: theme.spacing(1),
    padding: theme.spacing(5),
    width: theme.spacing(100),
    height: "fit-content",
  },
  header: {
    display: "flex",
    justifyContent: "flex-start",
    alignItems: "center",
    "& > *": {
      margin: theme.spacing(1),
    },
  },
}));

export default function ProfileCard({ fields, type }) {
  const icon =
    type == "business" ? (
      <BusinessCenterIcon fontSize="large" />
    ) : (
      <PersonIcon fontSize="large" />
    );
  const title = type == "business" ? "Business Details" : "Personal Details";
  const classes = useStyles();

  return (
    <Paper className={classes.root}>
      <div className={classes.header}>
        {icon}
        <h1>{title}</h1>
      </div>
      <TableContainer>
        <Table component={Paper} aria-label="simple table">
          <TableBody>
            {fields.map((field) => (
              <TableRow key={field.label}>
                <TableCell variant="head">{field.label}</TableCell>
                <TableCell>{field.value}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Paper>
  );
}

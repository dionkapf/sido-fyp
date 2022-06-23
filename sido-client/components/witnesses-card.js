import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Paper from "@material-ui/core/Paper";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import Divider from "@material-ui/core/Divider";
import { useLoanContext } from "../context/LoanContext";

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
    flexWrap: "wrap",
    justifyContent: "space-around",
    width: theme.spacing(100),
    padding: theme.spacing(3),
    "& > div": {
      margin: theme.spacing(1),
      height: "fit-content",
      minWidth: "40%",
    },
  },
  header: {
    display: "flex",
    justifyContent: "flex-start",
    alignItems: "center",
    "& > *": {
      margin: theme.spacing(1),
    },
  },
  list: {
    width: "100%",
    maxWidth: 360,
    backgroundColor: theme.palette.background.paper,
  },
}));
function formatKeyNames(string) {
  return (string.charAt(0).toUpperCase() + string.slice(1)).replace(/_/g, " ");
}
export default function WitnessesCard() {
  const classes = useStyles();
  const { witness1, witness2, loanData } = useLoanContext();
  return (
    <Paper className={classes.root}>
      <div>
        <div className={classes.header}>
          <h1>Witness 1</h1>
        </div>
        <List className={classes.list}>
          {witness1 &&
            Object.keys(witness1).map((key) => (
              <>
                <ListItem>
                  {!["sex", "address"].includes(key) && (
                    <ListItemText
                      primary={witness1[key]}
                      secondary={formatKeyNames(key)}
                    />
                  )}
                  {key === "sex" && (
                    <ListItemText
                      primary={
                        witness1[key] == "M"
                          ? "Male"
                          : witness1[key] == "F"
                          ? "Female"
                          : "Other"
                      }
                      secondary={formatKeyNames(key)}
                    />
                  )}
                </ListItem>
                <Divider component="li" />
              </>
            ))}
        </List>
      </div>

      <Divider orientation="vertical" flexItem />
      <div>
        <div className={classes.header}>
          <h1>Witness 2</h1>
        </div>
        <List className={classes.list}>
          {witness2 &&
            Object.keys(witness2).map((key) => (
              <>
                <ListItem>
                  {!["sex", "address"].includes(key) && (
                    <ListItemText
                      primary={witness2[key]}
                      secondary={formatKeyNames(key)}
                    />
                  )}
                  {key === "sex" && (
                    <ListItemText
                      primary={
                        witness2[key] == "M"
                          ? "Male"
                          : witness2[key] == "F"
                          ? "Female"
                          : "Other"
                      }
                      secondary={formatKeyNames(key)}
                    />
                  )}
                </ListItem>
                <Divider component="li" />
              </>
            ))}
        </List>
        {/* <List>
          {witness2 &&
            Object.keys(witness2).map((key) => (
              <>
                {key === "sex" && (
                  <ListItemText
                    primary={
                      witness2[key] == "M"
                        ? "Male"
                        : witness2[key] == "F"
                        ? "Female"
                        : "Other"
                    }
                    secondary={formatKeyNames(key)}
                  />
                )}
                {!["sex", "address"].includes(key) && (
                  <ListItemText
                    primary={witness2[key]}
                    secondary={formatKeyNames(key)}
                  />
                )}

                <Divider component="li" />
              </>
            ))}
        </List> */}
      </div>
    </Paper>
  );
}

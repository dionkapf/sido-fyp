import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Paper from "@material-ui/core/Paper";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import Divider from "@material-ui/core/Divider";

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

function formatMoney(x) {
  return `TSh ${x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ")}`;
}
function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}
export default function RequestCard({ requestData, collateralData }) {
  const classes = useStyles();
  return (
    <Paper className={classes.root}>
      <div>
        <div className={classes.header}>
          <h1>Loan Request</h1>
        </div>
        <List className={classes.list}>
          {requestData &&
            Object.keys(requestData)
              .filter((key) => key === "ownerName")
              .map((key) => (
                <>
                  <ListItem key={key}>
                    <ListItemText
                      primary={requestData[key]}
                      secondary="Loanee"
                    />
                  </ListItem>
                  <Divider component="li" />
                </>
              ))}
          {requestData &&
            Object.keys(requestData)
              .filter((key) => key === "branch")
              .map((key) => (
                <>
                  <ListItem key={key}>
                    <ListItemText
                      primary={requestData.branch_details.name}
                      secondary="Branch"
                    />
                  </ListItem>
                  <Divider component="li" />
                </>
              ))}
          {requestData &&
            Object.keys(requestData)
              .filter((key) => key === "amount")
              .map((key) => (
                <>
                  <ListItem key={key}>
                    <ListItemText
                      primary={formatMoney(requestData[key])}
                      secondary="Amount"
                    />
                  </ListItem>
                  <Divider component="li" />
                </>
              ))}
          {requestData &&
            Object.keys(requestData)
              .filter(
                (key) =>
                  ![
                    "ownerName",
                    "loanee",
                    "amount",
                    "branch_details",
                    "branch",
                  ].includes(key)
              )
              .map((key) => (
                <>
                  <ListItem>
                    <ListItemText
                      primary={requestData[key]}
                      secondary={capitalizeFirstLetter(key)}
                    />
                  </ListItem>
                  <Divider component="li" />
                </>
              ))}
        </List>
      </div>

      <Divider orientation="vertical" flexItem />
      <div>
        <div className={classes.header}>
          <h1>Collateral</h1>
        </div>
        <List>
          {collateralData &&
            Object.keys(collateralData)
              .filter((key) => key !== "worth")
              .map((key) => (
                <>
                  <ListItem>
                    <ListItemText
                      primary={collateralData[key]}
                      secondary={capitalizeFirstLetter(key)}
                    />
                  </ListItem>
                  <Divider component="li" />
                </>
              ))}
          {collateralData &&
            Object.keys(collateralData)
              .filter((key) => key === "worth")
              .map((key) => (
                <>
                  <ListItem key={key}>
                    <ListItemText
                      primary={formatMoney(collateralData[key])}
                      secondary="Worth"
                    />
                  </ListItem>
                  <Divider component="li" />
                </>
              ))}
        </List>
      </div>
    </Paper>
  );
}

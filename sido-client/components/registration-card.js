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
function formatKeyNames(string) {
  return (string.charAt(0).toUpperCase() + string.slice(1)).replace(/_/g, " ");
}
export default function RegistrationCard({
  accountData,
  ownerData,
  businessData,
}) {
  const classes = useStyles();
  return (
    <Paper className={classes.root}>
      <div>
        <div className={classes.header}>
          <h1>Owner</h1>
        </div>
        <List className={classes.list}>
          {accountData && (
            <>
              <ListItem key={accountData.username}>
                <ListItemText
                  primary={accountData.username}
                  secondary="Username"
                />
              </ListItem>
              <Divider component="li" />
            </>
          )}
          {ownerData &&
            Object.keys(ownerData).map((key) => (
              <>
                <ListItem>
                  <ListItemText
                    primary={ownerData[key]}
                    secondary={formatKeyNames(key)}
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
          <h1>Business</h1>
        </div>
        <List>
          {businessData &&
            Object.keys(businessData)
              .filter(
                (key) =>
                  !["formalized", "sector_details", "sector"].includes(key)
              )
              .map((key) => (
                <>
                  <ListItem>
                    <ListItemText
                      primary={businessData[key]}
                      secondary={formatKeyNames(key)}
                    />
                  </ListItem>
                  <Divider component="li" />
                </>
              ))}
          {businessData &&
            Object.keys(businessData)
              .filter((key) => key === "formalized")
              .map((key) => (
                <>
                  <ListItem key={key}>
                    <ListItemText
                      primary={businessData[key] ? "Yes" : "No"}
                      secondary="Formalized business?"
                    />
                  </ListItem>
                  <Divider component="li" />
                </>
              ))}
          {businessData &&
            Object.keys(businessData)
              .filter((key) => key === "sector")
              .map((key) => (
                <>
                  <ListItem key={key}>
                    <ListItemText
                      primary={businessData.sector_details.name}
                      secondary="Sector"
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

import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Card from "@material-ui/core/Card";
import CardActions from "@material-ui/core/CardActions";
import CardContent from "@material-ui/core/CardContent";
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";
import { useRouter } from "next/router";

const useStyles = makeStyles({
  root: {
    minWidth: 275,
    maxWidth: 450,
    minHeight: 150,
  },
  title: {
    fontSize: 30,
  },
  subtitle: {
    display: "flex",
    justifyContent: "space-around",
    alignItems: "center",
    margin: "0",
  },
  toright: {
    textAlign: "right",
  },
  result: {
    fontSize: 45,
    lineHeight: 1,
  },
  pos: {
    marginBottom: 12,
  },
});

export default function MoneyCard({ data }) {
  const { title, count } = data;
  const classes = useStyles();
  const router = useRouter();

  return (
    <Card className={classes.root}>
      <CardContent>
        <Typography className={classes.title}>{title}</Typography>
        <div className={classes.subtitle}>
          <Typography className={classes.result}>{count}</Typography>
        </div>
      </CardContent>
    </Card>
  );
}

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
  },
  title: {
    fontSize: 50,
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
    fontSize: 100,
    lineHeight: 1,
  },
  pos: {
    marginBottom: 12,
  },
});

export default function SimpleCard({ data }) {
  const { title, description, count } = data;
  const link = data.link ? data.link : null;
  console.log("Link: ", link);
  const classes = useStyles();
  const router = useRouter();

  return (
    <Card className={classes.root}>
      <CardContent>
        <Typography className={classes.title}>{title}</Typography>
        <div className={classes.subtitle}>
          <Typography className={classes.result}>{count}</Typography>
          <Typography className={classes.toright} variant="h6" component="p">
            {description}
          </Typography>
        </div>
      </CardContent>
      <CardActions>
        {link && (
          <Button
            onClick={() => {
              router.push(`${link}`);
            }}
            size="medium"
          >
            DETAILS
          </Button>
        )}
      </CardActions>
    </Card>
  );
}

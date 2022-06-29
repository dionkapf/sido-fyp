import Head from "next/head";
import styles from "../styles/Home.module.css";
import { useRouter } from "next/router";
import Footer from "../components/footer";
import { useAuth } from "../context/AuthContext";
import { useEffect, useRef } from "react";
import MenuAppBar from "../components/menuappbar";
import Card from "@material-ui/core/Card";
import CardActions from "@material-ui/core/CardActions";
import CardActionArea from "@material-ui/core/CardActionArea";
import CardMedia from "@material-ui/core/CardMedia";
import CardContent from "@material-ui/core/CardContent";
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core";

export async function getServerSideProps() {
  const res = await fetch(`http://localhost:5000/api/branches`);
  const data = await res.json();
  const branches = data.data;
  return { props: { branches } };
}

const useStyles = makeStyles((theme) => ({
  main: {
    minHeight: "75vh",
    padding: "2rem 0",
    flex: "1",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
  },
  media: {
    height: 200,
  },
  container: {
    padding: "0 0rem",
  },
  root: {
    minWidth: 275,
  },
  bullet: {
    display: "inline-block",
    margin: "0 2px",
    transform: "scale(0.8)",
  },
  title: {
    fontSize: 14,
  },
  pos: {
    marginBottom: 12,
  },
}));

export default function LoanInfo({ branches }) {
  const { user } = useAuth();
  const router = useRouter();
  const classes = useStyles();
  return (
    <div className={classes.container}>
      <Head>
        <title>Start formalization</title>
        <meta name="description" content="Rasmisha App" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <MenuAppBar />
      <main className={classes.main}>
        <Card className={classes.root}>
          <CardMedia
            className={classes.media}
            image="/loan-info.jpg"
            title="Loan Application Info"
          />
          <CardContent>
            <Typography variant="h5" component="h2">
              Information for applying for a loan
            </Typography>
            <Typography variant="body2" component="p">
              1. Ensure you have your national ID (NIDA) card or number
              available.
            </Typography>
            <Typography variant="body2" component="p">
              2. Ensure you have a valid phone number registered under your NIDA
              number.
            </Typography>
            <Typography variant="body2" component="p">
              3. Review the assets you have and ensure you have a clear picture
              of your assets. Estimate the value of your assets based on the
              purchase price.
            </Typography>
            <Typography variant="body2" component="p">
              4. Assess your loan amount and ensure you have the necessary
              collateral.
            </Typography>
            <br />
            <Typography variant="body2" component="p">
              If you are ready to start formalization and you do not have a
              RASMISHA account, please click on REGISTER below to create one.
            </Typography>
            <Typography variant="body2" component="p">
              If you have a RASMISHA account, please click on LOGIN below to
              login to your account.
            </Typography>
          </CardContent>

          <CardActions>
            {user && (
              <Button
                color="primary"
                onClick={() => {
                  router.push("/apply-loan");
                }}
              >
                CONTINUE
              </Button>
            )}
            {!user && (
              <Button
                color="primary"
                onClick={() => {
                  router.push("/register");
                }}
              >
                REGISTER
              </Button>
            )}
            {!user && (
              <Button
                color="primary"
                onClick={() => {
                  router.push("/login");
                }}
              >
                LOGIN
              </Button>
            )}
          </CardActions>
        </Card>
      </main>

      <Footer />
    </div>
  );
}

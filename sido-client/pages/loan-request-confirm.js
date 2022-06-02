import { useState } from "react";
import Head from "next/head";
import { useRouter } from "next/router";
import { useLoanRequest } from "../context/LoanRequestContext";
import Footer from "../components/footer";
import Button from "@material-ui/core/Button";
import CheckIcon from "@material-ui/icons/Check";
import ArrowBackIcon from "@material-ui/icons/ArrowBack";
import MenuAppBar from "../components/menuappbar";
import { makeStyles } from "@material-ui/core";
import RequestCard from "../components/request-card";
import Snackbar from "@material-ui/core/Snackbar";
import MuiAlert from "@material-ui/lab/Alert";

function Alert(props) {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
}

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
  container: {
    padding: "0 0rem",
  },
  title: {
    margin: "0",
    lineHeight: "1.15",
    fontSize: "4rem",
  },
  margin: {
    margin: theme.spacing(1),
  },
  extendedIcon: {
    marginRight: theme.spacing(1),
  },
}));

export default function LoanRequestConfirm() {
  const [open, setOpen] = useState(false);
  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }

    setOpen(false);
  };

  const { loanRequest, collateral } = useLoanRequest();
  const router = useRouter();
  const classes = useStyles();

  const handleConfirm = async () => {
    const requestBody = (({ loanee, branch, amount, status }) => ({
      loanee,
      branch,
      amount,
      status,
    }))(loanRequest);

    const loanRequestRes = await fetch(
      `http://localhost:5000/api/loan-requests`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody),
      }
    );
    const loanRequestResponse = await loanRequestRes.json();
    const loanRequestId = loanRequestResponse.data.id;
    collateral.loan_request = loanRequestId;
    console.log("collateral", collateral);
    const collateralRes = await fetch(`http://localhost:5000/api/collaterals`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(collateral),
    });
    const collateralResponse = await collateralRes.json();

    console.log(
      `Loan Request Confirmed\n ${JSON.stringify({
        request: loanRequestResponse.data,
        collateral: collateralResponse.data,
      })}`
    );
    setOpen(true);
    setTimeout(() => {
      router.push("/");
    }, 3000);
  };
  const handleBack = () => {
    history.go(-2);
  };

  return (
    <div className={classes.container}>
      <Head>
        <title>Confirm Request</title>
        <meta name="description" content="SIDO Loan and Formalise App" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <MenuAppBar />
      <main className={classes.main}>
        <h3 className={classes.title}>LOAN REQUEST DETAILS</h3>
        <RequestCard requestData={loanRequest} collateralData={collateral} />
        <div>
          <Button
            variant="outlined"
            color="primary"
            aria-label="add"
            className={classes.margin}
            onClick={handleBack}
          >
            <ArrowBackIcon className={classes.extendedIcon} />
            Return
          </Button>
          <Button
            variant="contained"
            color="primary"
            aria-label="add"
            className={classes.margin}
            onClick={handleConfirm}
          >
            <CheckIcon className={classes.extendedIcon} />
            Confirm Request
          </Button>
        </div>
        <Snackbar open={open} autoHideDuration={8000} onClose={handleClose}>
          <Alert onClose={handleClose} severity="success">
            Loan Request Sent
          </Alert>
        </Snackbar>
      </main>
      <Footer />
    </div>
  );
}

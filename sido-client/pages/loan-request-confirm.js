import Head from "next/head";
import { useRouter } from "next/router";
import { useLoanRequest } from "../context/LoanRequestContext";
import Footer from "../components/footer";
import Fab from "@material-ui/core/Fab";
import CheckIcon from "@material-ui/icons/Check";
import ArrowBackIcon from "@material-ui/icons/ArrowBack";
import MenuAppBar from "../components/menuappbar";
import { makeStyles } from "@material-ui/core";
import RequestCard from "../components/request-card";

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
  const { loanRequest, collateral } = useLoanRequest();
  const router = useRouter();
  const classes = useStyles();
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
          <Fab
            variant="extended"
            color="primary"
            aria-label="add"
            className={classes.margin}
          >
            <ArrowBackIcon className={classes.extendedIcon} />
            Return
          </Fab>
          <Fab
            variant="extended"
            color="primary"
            aria-label="add"
            className={classes.margin}
          >
            <CheckIcon className={classes.extendedIcon} />
            Confirm Request
          </Fab>
        </div>
      </main>
      <Footer />
    </div>
  );
}

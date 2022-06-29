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
import RegistrationCard from "../components/registration-card";
import Snackbar from "@material-ui/core/Snackbar";
import MuiAlert from "@material-ui/lab/Alert";
import { useRegisterContext } from "../context/RegisterContext";

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

export default function ConfirmRegistration() {
  const [open, setOpen] = useState(false);
  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }

    setOpen(false);
  };
  const { account, owner, business } = useRegisterContext();
  const router = useRouter();
  const classes = useStyles();

  const handleConfirm = async () => {
    const role = account ? (account.role ? account.role : "6") : "6";
    const userBody = (({ username, password, confirm_password }) => ({
      username,
      password,
      confirmPassword: confirm_password,
    }))(account);
    userBody.role = role;
    // alert(JSON.stringify(business));
    const ownerDetails = (({
      first_name,
      middle_name,
      last_name,
      birthdate,
      email,
      phone_number,
      business_name,
      business_type,
      sex,
      sector,
      address,
    }) => ({
      firstName: first_name,
      middleName: middle_name,
      lastName: last_name,
      birthdate,
      email,
      phoneNumber: phone_number,
      businessName: business_name,
      businessType: business_type,
      sex,
      sector,
      address,
    }))(owner);
    const businessDetails = (({
      business_name,
      business_type,
      sector,
      formalized,
    }) => ({
      businessName: business_name,
      businessType: business_type,
      sector,
      formalized: formalized.toString(),
    }))(business);
    const ownerBody = {
      ...ownerDetails,
      ...businessDetails,
    };
    // alert(`Owner Stuff ${JSON.stringify(ownerBody)}`);
    const userRes = await fetch(`http://localhost:5000/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(userBody),
    });
    const userResponse = await userRes.json();
    // alert(JSON.stringify(userResponse));
    console.log("User response", userResponse.user);
    const userId = userResponse.user.id;

    ownerBody.userId = userId;
    console.log("owner", ownerBody);
    const ownerRes = await fetch(`http://localhost:5000/api/owners`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(ownerBody),
    });
    const ownerResponse = await ownerRes.json();

    console.log(
      `Registration Complete\n ${JSON.stringify({
        user: userResponse.user,
        owner: ownerResponse.data,
      })}`
    );
    setOpen(true);
    setTimeout(() => {
      router.push("/login");
    }, 3000);
  };
  const handleBack = () => {
    history.go(-2);
  };

  return (
    <div className={classes.container}>
      <Head>
        <title>Confirm Registration</title>
        <meta name="description" content="Rasmisha App" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <MenuAppBar />
      <main className={classes.main}>
        <h3 className={classes.title}>CONFIRM REGISTRATION</h3>
        <RegistrationCard
          accountData={account}
          ownerData={owner}
          businessData={business}
        />
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
            Confirm
          </Button>
        </div>
        <Snackbar open={open} autoHideDuration={8000} onClose={handleClose}>
          <Alert onClose={handleClose} severity="success">
            Registration Complete! Redirecting to login page
          </Alert>
        </Snackbar>
      </main>
      <Footer />
    </div>
  );
}

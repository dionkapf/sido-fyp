import { useState, forwardRef } from "react";
import Head from "next/head";
import { useRouter } from "next/router";
import { useLoanContext } from "../context/LoanContext";
import Footer from "../components/footer";
import Button from "@material-ui/core/Button";
import CheckIcon from "@material-ui/icons/Check";
import ArrowBackIcon from "@material-ui/icons/ArrowBack";
import MenuAppBar from "../components/menuappbar";
import { makeStyles } from "@material-ui/core";
import WitnessesCard from "../components/witnesses-card";
import Snackbar from "@material-ui/core/Snackbar";
import MuiAlert from "@material-ui/lab/Alert";
import TextField from "@material-ui/core/TextField";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import InputAdornment from "@material-ui/core/InputAdornment";
import Slide from "@material-ui/core/Slide";
import { useRegisterContext } from "../context/RegisterContext";
import { useAuth } from "../context/AuthContext";

const Transition = forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

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

export default function DisburseLoan() {
  const [disburse, setDisburse] = useState(false);
  const disburseClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }

    setDisburse(false);
  };

  const [open, setOpen] = useState(false);
  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }

    setOpen(false);
  };
  const { account, owner, business } = useRegisterContext();
  const { user } = useAuth();
  const { witness1, witness2, loanData } = useLoanContext();
  const [amount, setAmount] = useState(0);
  const [deadline, setDeadline] = useState(null);
  const [rate, setRate] = useState(0);
  const router = useRouter();
  const classes = useStyles();

  const handleConfirmOld = async () => {
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
    }, 1500);
  };

  const handleConfirm = async () => {
    // alert("Confirm");
    // alert(`Loan Data: ${JSON.stringify(loanData)}`);
    // alert(`Loan ID: ${loanData.id}`);
    const finalLoanData = {
      loanRequestId: loanData ? parseInt(loanData.id) : -1,
      approvalDate: new Date(Date.now()).toLocaleString("en-gb", {
        day: "numeric",
        year: "numeric",
        month: "long",
      }),
      deadline,
      witness1: -1,
      witness2: -1,
      staff: user ? user.id : -1,
      amount,
      rate,
    };

    const res = await fetch(`http://localhost:5000/api/witnesses`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(witness1),
    });
    const witness1Response = await res.json();
    console.log(`Witness 1: ${JSON.stringify(witness1Response)}`);
    finalLoanData.witness1 = witness1Response.data.id;
    const res2 = await fetch(`http://localhost:5000/api/witnesses`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(witness2),
    });
    const witness2Response = await res2.json();
    console.log(`Witness 2: ${JSON.stringify(witness2Response)}`);
    finalLoanData.witness2 = witness2Response.data.id;
    // alert(`Final Loan Data: ${JSON.stringify(finalLoanData)}`);
    const res3 = await fetch(`http://localhost:5000/api/loans`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(finalLoanData),
    });
    const response = await res3.json();
    console.log(`Response: ${JSON.stringify(response)}`);
    disburseClose();
    setOpen(true);
    setTimeout(() => {
      router.push("/operation/loan");
    }, 3000);
  };

  const handleBack = () => {
    // history.go(-1);
    // alert(JSON.stringify(witness1));
    // alert(JSON.stringify(witness2));
    console.log(JSON.stringify(witness1));
  };

  return (
    <div className={classes.container}>
      <Head>
        <title>Disburse Loan</title>
        <meta name="description" content="Rasmisha App" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <MenuAppBar />
      <main className={classes.main}>
        <h3 className={classes.title}>Witness Details</h3>
        <WitnessesCard />
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
            onClick={() => {
              setDisburse(true);
            }}
          >
            <CheckIcon className={classes.extendedIcon} />
            CONTINUE TO DISBURSEMENT
          </Button>
        </div>
        <Snackbar open={open} autoHideDuration={8000} onClose={handleClose}>
          <Alert onClose={handleClose} severity="success">
            Loan has been disbursed successfully!
          </Alert>
        </Snackbar>
        <Dialog
          open={disburse}
          TransitionComponent={Transition}
          keepMounted
          maxWidth="xs"
          onClose={disburseClose}
          aria-labelledby="alert-dialog-slide-title"
          aria-describedby="disburse-dialog"
        >
          <DialogTitle id="alert-dialog-slide-title">
            {`Confirm Owner's loan request?`}
          </DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-slide-description">
              {`This dialog is for confirming the loan is being accepted for it's merit and we need to take stock and appreciate that.`}
            </DialogContentText>
            <TextField
              autoFocus
              margin="dense"
              id="amount"
              label="Amount Disbursed"
              onChange={(e) => setAmount(e.target.value)}
              fullWidth
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">TSh</InputAdornment>
                ),
              }}
            />
            <TextField
              autoFocus
              margin="dense"
              id="deadline"
              label="Deadline"
              type="date"
              InputLabelProps={{ shrink: true }}
              onChange={(e) => setDeadline(e.target.value)}
              fullWidth
            />
            <TextField
              autoFocus
              margin="dense"
              id="rate"
              label="Interest Rate"
              onChange={(e) => setRate(e.target.value)}
              fullWidth
              InputProps={{
                endAdornment: <InputAdornment position="end">%</InputAdornment>,
              }}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={disburseClose} color="primary">
              BACK
            </Button>
            <Button onClick={handleConfirm} color="primary">
              CONFIRM
            </Button>
          </DialogActions>
        </Dialog>
      </main>
      <Footer />
    </div>
  );
}

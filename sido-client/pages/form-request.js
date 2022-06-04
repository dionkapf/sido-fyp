import { useEffect, useState } from "react";
import Head from "next/head";
import { useRouter } from "next/router";
import { useFormik } from "formik";

import { useAuth } from "../context/AuthContext";
import MenuAppBar from "../components/menuappbar";
import Footer from "../components/footer";

import { makeStyles } from "@material-ui/styles";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";
import Avatar from "@material-ui/core/Avatar";
import BusinessCenterIcon from "@material-ui/icons/BusinessCenter";
import Snackbar from "@material-ui/core/Snackbar";
import MuiAlert from "@material-ui/lab/Alert";

function Alert(props) {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
}

const useStyles = makeStyles((theme) => ({
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main,
  },
  container: {
    padding: "0 0rem",
  },
  main: {
    minHeight: "75vh",
    padding: "4rem 0",
    flex: 1,
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
  },
  "title a": {
    color: "#0070f3",
    textDecoration: "none",
  },
  "title a:hover, title a:focus,title a:active": {
    textDecoration: "underline",
  },
  title: {
    margin: "0",
    lineHeight: "1.15",
    fontSize: "4rem",
  },

  "title, description": {
    textAlign: "center",
  },
  description: {
    margin: "1rem 0",
    lineHeight: "1.5",
    fontSize: "1.5rem",
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
}));

export async function getServerSideProps() {
  const getUserRequests = await fetch(
    `http://localhost:5000/api/formalization-requests`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        credentials: "include",
      },
    }
  );
  const rawRequests = await getUserRequests.json();
  const requests = rawRequests.data;

  const res = await fetch(`http://localhost:5000/api/branches`);
  const data = await res.json();
  const branches = data.data;
  return { props: { branches, requests } };
}

export default function FormRequest({ branches, requests }) {
  const classes = useStyles();
  const { user, setUser, isLoading, setIsLoading } = useAuth();
  const userId = user ? parseInt(user.id) : null;
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [pending, setPending] = useState(false);
  const [snack, setSnack] = useState(false);
  const [request, setRequest] = useState(null);
  const userRequest = requests.find((request) => request.owner_id === userId);
  // const pendingRequest = false;
  const pendingRequest = userRequest !== null ? true : false;
  console.log("Pending...", pendingRequest);
  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleReturn = () => {
    setOpen(false);
    router.push("/");
  };

  const handleSubmit = async () => {
    const data = JSON.stringify(request);
    console.log("Owner: ", request.owner);
    console.log("Branch: ", request.branch);
    console.log("Data: ", data);
    const response = await fetch(
      `http://localhost:5000/api/formalization-requests`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: data,
      }
    );
    const { data: resData } = await response.json();
    console.log("resData", resData);
    handleClose();
    openSnack();
    setTimeout(() => {
      router.push("/");
    }, 2000);
  };

  const closeSnack = () => {
    if (reason === "clickaway") {
      return;
    }

    setSnack(false);
  };

  const openSnack = () => {
    setSnack(true);
  };

  const formik = useFormik({
    initialValues: {
      branch: "",
    },
    onSubmit: async (values) => {
      const branch_name = branches.find(
        (branch) => branch.id === values.branch
      ).name;
      await setRequest({
        owner: user.id,
        branch: values.branch,
        branch_name: branch_name,
        owner_name: `${user.first_name} ${user.last_name}`,
      });
      handleClickOpen();
    },
  });

  useEffect(() => {
    if (!user) {
      console.log("User is not logged in");
      router.push("/login");
    } else if (user.formalized) {
      alert("Your business is formalized already!");
      router.push("/");
    } else if (pendingRequest) {
      setPending(true);
    }
  }, [user, router, pendingRequest]);

  return (
    <div className={classes.container}>
      <Head>
        <title>Rasmilishe</title>
        <meta name="description" content="SIDO Loan and Formalise App" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <MenuAppBar />
      {!pendingRequest && (
        <>
          <main className={classes.main}>
            {/* <div>{`${pendingRequest}`}</div>
          <div>{`${userRequest}`}</div>
          <div>{`${requests[0].owner_id}`}</div>
          <div>{JSON.stringify(requests)}</div>
          <div>{JSON.stringify(user)}</div> */}
            <Avatar className={classes.avatar}>
              <BusinessCenterIcon />
            </Avatar>
            <Typography
              component="h1"
              variant="h5"
              className={classes.description}
            >
              Formalize your business
            </Typography>
            <form onSubmit={formik.handleSubmit}>
              <Select
                required
                fullWidth
                name="branch"
                id="branch"
                label="Branch"
                variant="outlined"
                displayEmpty
                onChange={formik.handleChange}
                value={formik.values.branch}
              >
                <MenuItem value="" disabled>
                  <em>Select a branch</em>
                </MenuItem>
                {branches.map((branch) => (
                  <MenuItem key={branch.id} value={branch.id}>
                    {branch.name}
                  </MenuItem>
                ))}
              </Select>
              <Button
                type="submit"
                fullWidth
                variant="contained"
                color="primary"
                className={classes.submit}
              >
                CONTINUE
              </Button>
            </form>
          </main>
          <Footer />
        </>
      )}

      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="request-confirmation-title"
        aria-describedby="request-confirmation-description"
      >
        <DialogTitle id="request-confirmation-title">
          {"Send formalization Request?"}
        </DialogTitle>
        <DialogContent>
          <DialogContentText
            id="request-confirmation-description"
            color="black"
          >
            You are about to send a formalization request to the SIDO branch in
            {request && ` ${request.branch_name}`}.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            CANCEL
          </Button>
          <Button onClick={handleSubmit} color="primary" autoFocus>
            CONFIRM
          </Button>
        </DialogActions>
      </Dialog>
      <Dialog
        open={pending}
        onClose={handleReturn}
        aria-labelledby="request-pending-title"
        aria-describedby="request-pending-description"
      >
        <DialogContent>
          <DialogContentText id="request-pending-description" color="black">
            You have already requested for formalization. Your request is{" "}
            {pendingRequest && userRequest && userRequest.status}.
            {pendingRequest && userRequest && userRequest.comment}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleReturn} color="primary" autoFocus>
            CONTINUE
          </Button>
        </DialogActions>
      </Dialog>
      <Snackbar open={snack} autoHideDuration={6000} onClose={closeSnack}>
        <Alert onClose={closeSnack} severity="success">
          Request sent! You will be notified when your business is formalized.
        </Alert>
      </Snackbar>
    </div>
  );
}

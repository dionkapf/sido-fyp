import React, { useState } from "react";
import Avatar from "@material-ui/core/Avatar";
import Button from "@material-ui/core/Button";
import CssBaseline from "@material-ui/core/CssBaseline";
import TextField from "@material-ui/core/TextField";
import Link from "@material-ui/core/Link";
import Grid from "@material-ui/core/Grid";
import LockOutlinedIcon from "@material-ui/icons/LockOutlined";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";
import Container from "@material-ui/core/Container";
import { useRouter } from "next/router";
import { useAuth } from "../context/AuthContext";

const useStyles = makeStyles((theme) => ({
  paper: {
    marginTop: theme.spacing(8),
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main,
  },
  form: {
    width: "100%", // Fix IE 11 issue.
    marginTop: theme.spacing(1),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
}));

export default function SignIn() {
  const classes = useStyles();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [validation, setValidation] = useState(false);
  const router = useRouter();
  const { user, setUser, setIsLoading } = useAuth();

  React.useEffect(() => {
    setIsLoading(false);
  }, [setIsLoading]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = JSON.stringify({ username, password });
    const response = await fetch(`http://localhost:5000/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: data,
    });
    const { user: resUser } = await response.json();
    console.log("User from res", resUser);
    if (resUser == null || resUser == undefined || response.success == false) {
      setValidation(true);
      return;
    }
    localStorage.setItem("user", JSON.stringify(resUser));
    setUser(resUser);
    setIsLoading(false);
    console.log("User after login", user);
    switch (resUser.role) {
      case 1:
        router.push("/admin");
        break;
      case 2:
        router.push("/executive/fsm");
        break;
      case 3:
        router.push("/executive/training");
        break;

      case 4:
        router.push("/operation/loan");
        break;
      case 5:
        router.push("/operation/business");
        break;

      case 6:
      default:
        router.push("/");
        break;
    }
  };

  return (
    <Container component="main" maxWidth="xs">
      <CssBaseline />
      <div className={classes.paper}>
        <Avatar className={classes.avatar}>
          <LockOutlinedIcon />
        </Avatar>
        <Typography component="h1" variant="h5">
          Sign in
        </Typography>
        <form
          className={classes.form}
          noValidate
          onSubmit={handleSubmit}
          method="POST"
        >
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            id="username"
            label="Username"
            name="username"
            autoFocus
            error={validation}
            helperText={validation ? "Invalid username or password" : ""}
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            name="password"
            label="Password"
            type="password"
            id="password"
            autoComplete="current-password"
            value={password}
            error={validation}
            helperText={validation ? "Invalid username or password" : ""}
            onChange={(e) => setPassword(e.target.value)}
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            className={classes.submit}
          >
            Sign In
          </Button>
          <Grid container>
            <Grid item>
              <Link href="/register" variant="body2">
                {"Don't have an account? Sign Up"}
              </Link>
            </Grid>
          </Grid>
        </form>
      </div>
    </Container>
  );
}

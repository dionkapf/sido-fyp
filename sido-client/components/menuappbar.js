import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import IconButton from "@material-ui/core/IconButton";
import Button from "@material-ui/core/Button";
import AccountCircle from "@material-ui/icons/AccountCircle";
import MenuItem from "@material-ui/core/MenuItem";
import Menu from "@material-ui/core/Menu";
import { useAuth } from "../context/AuthContext";
import Router, { useRouter } from "next/router";
import Link from "next/link";

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  menuButton: {
    marginRight: theme.spacing(2),
  },
  title: {
    flexGrow: 1,
    borderRadius: "0px",
  },
  homeLink: {
    fontSize: "1.5rem",
    fontWeight: "bold",
    textDecoration: "none",
    color: "inherit",
    "&:hover": {
      color: "white",
    },
  },
}));

export default function MenuAppBar() {
  const classes = useStyles();
  const { user, setUser } = useAuth();
  const role = user ? user.role : null;
  const { isLoading, setIsLoading } = useAuth();
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  const router = useRouter();
  const isLoginPage = router.pathname === "/login";
  console.log("Navbar user", user);
  console.log("Navbar isLoginPage", isLoginPage);
  const homeHref = (role) => {
    console.log("Navbar homeHref", role);
    switch (role) {
      case 1:
        return "/admin";

      case 2:
      case 3:
        return "/executive";

      case 4:
      case 5:
        return "/operation";

      default:
        return "/";
    }
  };

  const handleChange = (event) => {
    setAuth(event.target.checked);
  };

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleProfile = async () => {
    const res = await fetch("http://localhost:5000/login/me");
    const data = await res.json();
    console.log("data", data);
  };

  const handleLogOut = async (event) => {
    console.log("Logging out...");
    setUser(null);
    localStorage.removeItem("user");
    setIsLoading(true);
    await Router.push("/login");
  };
  const handleLogIn = async (event) => {
    await Router.push("/login");
  };
  return (
    <div className={classes.root}>
      <AppBar position="static">
        <Toolbar>
          <Typography className={classes.title}>
            <Link href={homeHref(role)} passHref>
              <a className={classes.homeLink}>SIDO APP</a>
            </Link>
          </Typography>

          {user && !isLoginPage && !isLoading && (
            <div>
              <Button
                aria-label="account of current user"
                aria-controls="menu-appbar"
                aria-haspopup="true"
                onClick={handleMenu}
                color="inherit"
              >
                <AccountCircle />
                <Typography variant="h6" className={classes.title}>
                  {user.first_name === "Administrator"
                    ? "Administrator"
                    : user.first_name + " " + user.last_name}
                </Typography>
              </Button>
              <Menu
                id="menu-appbar"
                anchorEl={anchorEl}
                anchorOrigin={{
                  vertical: "top",
                  horizontal: "right",
                }}
                keepMounted
                transformOrigin={{
                  vertical: "top",
                  horizontal: "right",
                }}
                open={open}
                onClose={handleClose}
              >
                <MenuItem onClick={handleProfile}>Profile</MenuItem>
                <MenuItem onClick={handleLogOut}>Log Out</MenuItem>
              </Menu>
            </div>
          )}
          {!user && !isLoginPage && !isLoading && (
            <div>
              <IconButton
                aria-label="account of current user"
                aria-controls="menu-appbar"
                aria-haspopup="true"
                onClick={handleLogIn}
                color="inherit"
              >
                <Typography variant="h6" className={classes.title}>
                  LOGIN
                </Typography>
              </IconButton>
            </div>
          )}
        </Toolbar>
      </AppBar>
    </div>
  );
}

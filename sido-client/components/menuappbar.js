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
import { useLoanRequest } from "../context/LoanRequestContext";
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
  const { loanRequest, collateral } = useLoanRequest();
  const role = user ? user.role : null;
  const { isLoading, setIsLoading } = useAuth();
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  const router = useRouter();
  const isLoginPage = router.pathname === "/login";
  const isAdmin = role === 1;
  console.log("Auth user", user);
  console.log("Auth isLoginPage", isLoginPage);
  console.log("LoanRequest loanRequest", loanRequest);
  console.log("LoanRequest collateral", collateral);
  const homeHref = (role) => {
    console.log("Navbar homeHref", role);
    switch (role) {
      case 1:
        return "/admin";

      case 2:
        return "/executive/fsm";
      case 3:
        return "/executive/training";

      case 4:
        return "/operation/loan";
      case 5:
        return "/operation/training";

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
    const getUsers = await fetch("http://localhost:5000/login/me", {
      credentials: "include",
    });
    const userRes = await getUsers.json();
    const userDetails = userRes.user;
    userDetails.role = parseInt(user.role);
    console.log("Navbar userDetails", userDetails);
    if (user.role === 6) {
      console.log("Getting sector...");
      const [getRole, getSectors] = await Promise.all([
        fetch(`http://localhost:5000/api/roles/${userDetails.role}`),
        fetch(`http://localhost:5000/api/sectors/${userDetails.sector_id}`),
      ]);
      const [roleResponse, sectorResponse] = await Promise.all([
        getRole.json(),
        getSectors.json(),
      ]);
      const sector = sectorResponse.data;
      const role = roleResponse.data;
      userDetails.role_id = userDetails.role;
      userDetails.role = role.name;
      userDetails.sector = sector.name;
      delete userDetails.sector_id;
      delete userDetails.username;
    }
    if (user.role in [2, 3, 4, 5]) {
      const [getRole, getBranch] = await Promise.all([
        fetch(`http://localhost:5000/api/roles/${userDetails.role}`),
        fetch(`http://localhost:5000/api/branches/${userDetails.branch}`),
      ]);
      const [roleResponse, branchResponse] = await Promise.all([
        getRole.json(),
        getBranch.json(),
      ]);
      console.log("Branches", branchResponse);
      const role = roleResponse.data;
      const branch = branchResponse.data;
      userDetails.role_id = userDetails.role;
      userDetails.role = role.name;
      userDetails.branch = branch.name;
      delete userDetails.branch_id;
      delete userDetails.username;
    }
    console.log("Menubar to Profile user: ", userDetails);
    await Router.push("/profile");
  };

  const handleLogOut = async (event) => {
    console.log("Logging out...");
    setUser(null);
    localStorage.removeItem("user");
    setIsLoading(true);
    await Router.push("/");
  };
  const handleLogIn = async (event) => {
    await Router.push("/login");
  };
  const handleRegister = async (event) => {
    await Router.push("/register");
  };
  return (
    <div className={classes.root}>
      <AppBar position="static">
        <Toolbar>
          <Typography className={classes.title}>
            <Link href={homeHref(role)} passHref>
              <a className={classes.homeLink}>RASMISHA</a>
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
                {!isAdmin && (
                  <MenuItem onClick={handleProfile}>Profile</MenuItem>
                )}
                <MenuItem onClick={handleLogOut}>Log Out</MenuItem>
              </Menu>
            </div>
          )}
          {!user && !isLoginPage && (
            <div>
              <Button
                aria-label="account of current user"
                aria-controls="menu-appbar"
                aria-haspopup="true"
                onClick={handleLogIn}
                color="inherit"
              >
                <Typography variant="h6" className={classes.title}>
                  LOGIN
                </Typography>
              </Button>
              <Button
                aria-label="account of current user"
                aria-controls="menu-appbar"
                aria-haspopup="true"
                onClick={handleRegister}
                color="inherit"
              >
                <Typography variant="h6" className={classes.title}>
                  REGISTER
                </Typography>
              </Button>
            </div>
          )}
        </Toolbar>
      </AppBar>
    </div>
  );
}

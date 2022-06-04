import React, { useRef } from "react";
import PropTypes from "prop-types";
import Head from "next/head";
import { ThemeProvider } from "@material-ui/core/styles";
import CssBaseline from "@material-ui/core/CssBaseline";
import theme from "../theme";
import { AuthContextProvider } from "../context/AuthContext";
import { LoanRequestContextProvider } from "../context/LoanRequestContext";
import { RegisterContextProvider } from "../context/RegisterContext";
import { RecoilRoot } from "recoil";

export default function MyApp(props) {
  const { Component, pageProps } = props;
  let sessionUser = useRef(null);
  React.useEffect(() => {
    // Remove the server-side injected CSS.
    const jssStyles = document.querySelector("#jss-server-side");
    if (jssStyles) {
      jssStyles.parentElement.removeChild(jssStyles);
    }
    function IsJsonString(str) {
      try {
        var json = JSON.parse(str);
        return typeof json === "object";
      } catch (e) {
        return false;
      }
    }
    const user = IsJsonString(localStorage.getItem("user"))
      ? JSON.parse(localStorage.getItem("user"))
      : null;
    sessionUser.current = user;
    console.log("sessionUser", sessionUser.current);
    if (user) {
      if (user.accessToken) {
        console.log("User has access token");
        fetch(`http://localhost:5000/login/validate`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${user.accessToken}`,
            "Content-Type": "application/json",
          },
        }).then((response) => {
          response.json().then((data) => {
            data.success
              ? console.log("User is in sesison")
              : localStorage.removeItem("user");
          });
        });
      }
      console.log("User exists");
    } else {
      console.log("User does not exist");
    }
  }, []);

  return (
    <React.Fragment>
      <Head>
        <title>SIDO App</title>
        <meta
          name="viewport"
          content="minimum-scale=1, initial-scale=1, width=device-width"
        />
      </Head>
      <ThemeProvider theme={theme}>
        {/* CssBaseline kickstart an elegant, consistent, and simple baseline to build upon. */}
        <CssBaseline />
        <RecoilRoot>
          <RegisterContextProvider>
            <LoanRequestContextProvider>
              <AuthContextProvider session={sessionUser.current}>
                <Component {...pageProps} />
              </AuthContextProvider>
            </LoanRequestContextProvider>
          </RegisterContextProvider>
        </RecoilRoot>
      </ThemeProvider>
    </React.Fragment>
  );
}

MyApp.propTypes = {
  Component: PropTypes.elementType.isRequired,
  pageProps: PropTypes.object.isRequired,
};

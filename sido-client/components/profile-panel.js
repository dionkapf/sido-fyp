import React, { useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Paper from "@material-ui/core/Paper";
import MenuAppBar from "./menuappbar";
import Container from "@material-ui/core/Container";
import ProfileCard from "./profile-card";
import Backdrop from "@material-ui/core/Backdrop";
import CircularProgress from "@material-ui/core/CircularProgress";

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
    flexWrap: "wrap",
    flexDirection: "row",
    justifyContent: "center",
    "& > *": {
      margin: theme.spacing(10),
      padding: theme.spacing(1),
      width: theme.spacing(50),
      height: "fit-content",
      minHeight: theme.spacing(63),
    },
  },
  backdrop: {
    zIndex: theme.zIndex.drawer + 1,
    color: "#fff",
  },
}));

export default function ProfilePanel({ user }) {
  const classes = useStyles();
  const [isOwner, setIsOwner] = useState(user && user.role == 6 ? true : false);
  const [open, setOpen] = useState(false);

  const fields = [
    {
      label: "First Name",
      value: "John",
    },
    {
      label: "Last Name",
      value: "Doe",
    },
    {
      label: "Email",
      value: "x@x.com",
    },
    {
      label: "Phone",
      value: "123-456-7890",
    },
    {
      label: "Role",
      value: "Admin",
    },
  ];

  let userData = [];
  let businessData = [];
  if (!user) {
    return (
      <Backdrop
        className={classes.backdrop}
        open={open}
        onClick={() => {
          setOpen(false);
        }}
      >
        <CircularProgress color="inherit" />
      </Backdrop>
    );
  }
  if (!isOwner) {
    // Not an owner -> a Staff
    const full_name = user.middle_name
      ? `${user.first_name} ${user.middle_name} ${user.last_name}`
      : `${user.first_name} ${user.last_name}`;
    const birthday = new Date(user.birthdate).toLocaleString("en-gb", {
      day: "numeric",
      year: "numeric",
      month: "long",
    });
    const phone_number =
      user.phone_number[0] == "0"
        ? "+255 " +
          user.phone_number
            .slice(1)
            .match(/.{1,3}/g)
            .join(" ")
        : user.phone_number.match(/.{1,3}/g).join(" ");
    userData = [
      {
        label: "Full Name",
        value: full_name,
      },
      {
        label: "Role",
        value: user.role_name,
      },
      {
        label: "Branch",
        value: user.branch_name,
      },
      {
        label: "Email",
        value: user.email,
      },
      {
        label: "Phone",
        value: phone_number,
      },
      {
        label: "Date of Birth",
        value: birthday,
      },
    ];
    businessData = null;
  } else {
    const full_name = user.middle_name
      ? `${user.first_name} ${user.middle_name} ${user.last_name}`
      : `${user.first_name} ${user.last_name}`;
    const birthday = new Date(user.birthdate).toLocaleString("en-gb", {
      day: "numeric",
      year: "numeric",
      month: "long",
    });
    const phone_number =
      user.phone_number[0] == "0"
        ? "+255 " +
          user.phone_number
            .slice(1)
            .match(/.{1,3}/g)
            .join(" ")
        : user.phone_number.match(/.{1,3}/g).join(" ");
    const userSex = (sex) => {
      switch (sex) {
        case "M":
          return "Male";
        case "F":
          return "Female";
        default:
          return "Other";
      }
    };
    const form_status = user.formalized
      ? "Formal business"
      : "Informal business";
    userData = [
      {
        label: "Full Name",
        value: full_name,
      },
      {
        label: "Sex",
        value: userSex(user.sex),
      },
      {
        label: "Date of Birth",
        value: birthday,
      },
      {
        label: "Address",
        value: user.address,
      },
      {
        label: "Email",
        value: user.email,
      },
      {
        label: "Phone",
        value: phone_number,
      },
    ];
    businessData = [
      {
        label: "Business Name",
        value: user.business_name,
      },
      {
        label: "Sector",
        value: user.sector,
      },
      {
        label: "Business Type",
        value: user.business_type,
      },
      {
        label: "Formalization Status",
        value: form_status,
      },
    ];
  }

  return (
    <>
      <MenuAppBar />
      <Container className={classes.root}>
        {/* <Paper>
          {userData &&
            userData.map((field) => (
              <p key={field.label}>
                {field.label}: {field.value}
              </p>
            ))}
        </Paper> */}
        <ProfileCard fields={userData} type={"personal"} />
        {isOwner && (
          // <Paper>
          //   {businessData.map((field) => (
          //     <p key={field.label}>
          //       {field.label}: {field.value}
          //     </p>
          //   ))}
          // </Paper>
          <ProfileCard fields={businessData} type={"business"} />
        )}
      </Container>
    </>
  );
}

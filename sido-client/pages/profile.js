import ProfilePanel from "../components/profile-panel";
import Head from "next/head";
import { useRouter } from "next/router";
import { useAuth } from "../context/AuthContext";
import { useEffect, useState } from "react";

export async function getServerSideProps() {
  const res = await fetch(`http://localhost:5000/api/branches`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      credentials: "include",
    },
  });
  const data = await res.json();
  const branches = data.data;

  const sectorsRes = await fetch(`http://localhost:5000/api/sectors`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      credentials: "include",
    },
  });
  const sectorsData = await sectorsRes.json();
  const sectors = sectorsData.data;

  return { props: { branches, sectors } };
}

export default function Profile({ branches, sectors }) {
  const { user } = useAuth();
  const router = useRouter();
  useEffect(() => {
    if (!user) {
      router.push("/login");
      console.log("Somehow not redirecting");
    }
    console.log("User", user);
    if (user && user.role === 1) {
      router.push("/admin");
    }
  }, [user, router]);

  return (
    <div className="container">
      <Head>
        <title>
          Profile: {user && `${user.first_name} ${user.last_name}`}{" "}
        </title>
        <meta name="description" content="RASMISHA App" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <ProfilePanel user={user} branches={branches} sectors={sectors} />
    </div>
  );
}

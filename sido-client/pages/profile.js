import ProfilePanel from "../components/profile-panel";
import { useRouter } from "next/router";
import { useAuth } from "../context/AuthContext";
import { useEffect, useState } from "react";

export default function Profile() {
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
      <ProfilePanel user={user} />
    </div>
  );
}

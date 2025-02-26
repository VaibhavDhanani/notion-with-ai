"use client";
import { SignedIn, SignedOut, SignInButton, SignUpButton, UserButton, useUser } from "@clerk/nextjs";
import React from "react";
import Breadcrumbs from "./Breadcrumbs";

const Header = () => {
  const { user } = useUser();
  return (
    <div className="flex justify-between items-center p-5">
      {user && (
        <h1 className="text-2xl font-bold">
          {user.fullName}
          {"'s"} Dashboard
        </h1>
      )}
      {/* Breadcums  */}
      <Breadcrumbs />
      <div>

      <SignedOut>
        <SignInButton />
        <SignUpButton />
      </SignedOut>
      <SignedIn>
        <UserButton />
      </SignedIn>
      </div>
    </div>
  );
};

export default Header;

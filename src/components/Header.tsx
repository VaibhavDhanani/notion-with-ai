"use client";
import {
  SignedIn,
  SignedOut,
  SignInButton,
  SignUpButton,
  UserButton,
  useUser,
} from "@clerk/nextjs";
import React from "react";
import Breadcrumbs from "./Breadcrumbs";
import { Button } from "./ui/button";

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
          <Button className="mx-1 bg-green-500">
            <SignInButton />
          </Button>
          <Button className="mx-1 bg-blue-500">
            <SignUpButton />
          </Button>
        </SignedOut>
        <SignedIn>
          <UserButton />
        </SignedIn>
      </div>
    </div>
  );
};

export default Header;

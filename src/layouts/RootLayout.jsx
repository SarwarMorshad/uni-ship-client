import React from "react";
import { Outlet } from "react-router";
import NavBar from "../shared/NavBar";
import Footer from "../shared/Footer";

const RootLayout = () => {
  return (
    <div>
      <NavBar />
      <Outlet></Outlet>
      <Footer />
    </div>
  );
};

export default RootLayout;

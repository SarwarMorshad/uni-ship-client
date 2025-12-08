import React from "react";
import { Outlet } from "react-router";
import NavBar from "../shared/NavBar";
import Footer from "../shared/Footer";

const RootLayout = () => {
  return (
    <div className="bg-gray-100 max-w-11/12 mx-auto">
      <NavBar />
      <Outlet></Outlet>
      <Footer />
    </div>
  );
};

export default RootLayout;

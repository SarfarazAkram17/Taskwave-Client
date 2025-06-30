import React from "react";
import Navbar from "../Components/Navbar/Navbar";
import Footer from "../Components/Footer/Footer";
import { Outlet } from "react-router";
import { ToastContainer } from "react-toastify";

const MainLayout = () => {
  return (
    <div>
      <div className="xl:container mx-auto">
        <Navbar></Navbar>
        <Outlet></Outlet> 
      <Footer></Footer>
      </div>

      <ToastContainer />
    </div>
  );
};

export default MainLayout;

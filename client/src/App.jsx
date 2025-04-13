import React, { useContext } from "react";
import { Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";



import Home from "./pages/Home";
import Output from "./pages/Output";
import BuyCredit from "./pages/BuyCredit";
import Navbar from "./componenets/Navbar";
import Footer from "./componenets/Footer";
import Login from "./componenets/Login";
import { AppContext } from "./context/AppContext";

const App = () => {
  const {showLogin} = useContext(AppContext)
  return (
    <div className="px-4 sm:px-10 md:px-4 lg:px-28 min-h-screen bg-gradient-to-b from-teal-50 to-orange-50">
      <ToastContainer position="bottom-right"/>
      <Navbar/>
      {showLogin && <Login/> }
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/output" element={<Output />} />
        <Route path="/buy" element={<BuyCredit />} />
      </Routes>
      <Footer/>
    </div>
  );
};

export default App;

import { Route, Routes } from "react-router-dom";
import "./index.css";
import Header from "./components/Header/Header";

import Home from "./components/Home";

import MovieDetails from "./components/MovieDetails";
import Login from "./components/Login";
import Signup from "./components/Signup";

import React from "react";
import Footer from "./components/Footer";

function App() {
  return (
    <>
      {/* <Header />
       */}

      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/movie/:id" element={<MovieDetails />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
      </Routes>
      <Footer />
    </>
  );
}

export default App;

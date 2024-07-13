import React from "react";
import Banner from "../components/Banner";
import Blogs from "../components/Blogs";
import AboutUs from "../components/AboutUs";
import Footer from "../components/Footer";

const LandingPage: React.FC = () => {
  return (
    <>
      <Banner />
      <Blogs />
      <AboutUs />
      <Footer />
    </>
  );
};

export default LandingPage;

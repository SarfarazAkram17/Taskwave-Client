import React from "react";
import Banner from "../../Components/Banner/Banner";
import WhyChooseTaskwave from "../../Components/WhyChooseTaskwave/WhyChooseTaskwave";
import Faq from "../../Components/Faq/Faq";
import Featured from "../../Components/Featured/Featured";

const Home = () => {
  return (
    <div>
      <Banner></Banner>
      <Featured></Featured>
      <WhyChooseTaskwave></WhyChooseTaskwave>
      <Faq></Faq>
    </div>
  );
};

export default Home;

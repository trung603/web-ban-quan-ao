import React from "react";
import Title from "../components/Title";
import { assets } from "../assets/frontend_assets/assets";
import NewsletterBox from '../components/NewsletterBox'


const About = () => {
  return (
    <div>
      <div className="text-2xl text-center pt-8 border-t">
        <Title text1={"ABOUT"} text2={"US"} />
      </div>
      <div className="my-10 flex flex-col md:flex-row gap-16">
        <img
          className="w-full md:max-w-[450px]"
          src={assets.about_img}
          alt=""
        />
        <div className="flex flex-col justify-center gap-6 md:w-2/4 text-gray-600">
          <p>
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Nihil
            aspernatur quaerat et.
          </p>
          <p>consectetur maiores quo perferendis sunt,
            pariatur reprehenderit, impedit delectus quisquam? Voluptate ex,
            quae totam inventore corporis voluptatibus atque.
          </p>
          <b className="text-gray-800">Our Mission</b>
          <p>The createRoot method was introduced in React 18. If you're using an older version of React, you won't have access to this method. You can check your React version in the package.json file</p>
        </div>
      </div>
      <div className="text-xl py-4">
        <Title text1={'WHY'} text2={'CHOOSE US'}/>
      </div>
      <div className="flex flex-col md:flex-row text-sm mb-20">
        <div className="border px-10 md:px-16 py-8 sm:py-20 flex flex-col gap-5">
          <b>Quality Assurance</b>
          <p className="text-gray-600">We meticulously and vet each product to ensure it meets our stringent</p>
        </div>
        <div className="border px-10 md:px-16 py-8 sm:py-20 flex flex-col gap-5">
          <b>Convenience</b>
          <p className="text-gray-600">We meticulously and vet each product to ensure it meets our stringent</p>
        </div>
        <div className="border px-10 md:px-16 py-8 sm:py-20 flex flex-col gap-5">
          <b>Exceptional Customer</b>
          <p className="text-gray-600">We meticulously and vet each product to ensure it meets our stringent</p>
        </div>
      </div>
      <NewsletterBox />
    </div>
  );
};

export default About;

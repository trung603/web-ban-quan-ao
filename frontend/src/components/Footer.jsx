import React from "react";
import { assets } from "../assets/frontend_assets/assets";

const Footer = () => {
  return (
    <div>
      <div className="flex flex-col sm:grid grid-cols-[3fr_1fr_1fr] gap=14 my-10 mt-40 text-sm">
        <div>
          <img src={assets.logo} className="mb-5 w-32" />
          <p className="w-full md:w-2/3 text-gray-600">
            Lorem ipsum dolor sit amet consectetur, adipisicing elit. Asperiores
            deserunt voluptates saepe voluptatibus similique earum autem modi
            tenetur tempora? Soluta quo, commodi corporis dolorum minus a iure
            illum modi adipisci?
          </p>
        </div>
        <div>
          <h3 className="text-xl font-medium mb-5">Quick Links</h3>
          <ul className="flex flex-col gap-1 text-gray-600">
            <li>Home </li>
            <li>About us</li>
            <li>Delivery</li>
            <li>Privacy policy</li>
          </ul>
        </div>
        <div>
          <h3 className="text-xl font-medium mb-5">GET IN TOUCH</h3>
          <ul className="flex flex-col gap-1 text-gray-600">
            <li>Phone: +1 123 456 7890</li>
            <li>contact@foreveryou.com</li>
          </ul>
        </div>
    
      </div>
      <div>
            <hr/>
            <p className="py-5 text-sm text-center">Copyright 2024@forever.com - All Right Reserved</p>
        </div>
    </div>
  );
};

export default Footer;

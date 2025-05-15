import React from "react";
import { Link } from "react-router-dom";

const Navbar = () => {
  return (
    <nav className="bg-white shadow-md fixed w-full top-0 z-50">
      <div className="container mx-auto flex justify-between items-center py-4 px-6">
        {/* Logo Section */}
        <h1 className="text-xl font-bold">Cyber Crime Portal</h1>

        {/* Navigation Links */}
        <ul className="flex space-x-6">
          <li>
            <Link to="/landing" className="cursor-pointer hover:underline">About</Link>
          </li>
          <li>
            <Link to="/track" className="cursor-pointer hover:underline">Track</Link>
          </li>
          <li>
            <Link to="/report" className="cursor-pointer hover:underline">Report</Link>
          </li>
          <li><Link to="/news">News</Link></li>
          
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;

import React from "react";
import { useNavigate } from "react-router-dom";

const Header = () => {
  const navigate = useNavigate();

  return (
    <header className="bg-[#032541] text-white h-16 z-10 flex items-center fixed top-0 w-full transition-all duration-300">
      <div className="md:mx-5 flex items-center justify-between p-4  w-full">
        <button
          className="font-bold tracking-widest md:text-lg text-sm  hover:cursor-pointer"
          onClick={()=>navigate("/")}
        >
          MoviesFlix
        </button>

        <button
          className="font-bold tracking-widest md:text-lg text-sm  hover:cursor-pointer"
          onClick={()=>navigate("/Login")}
        >
          Login
        </button>

        {/* <h2 className="font-thin tracking-widest md:text-base text-sm  ">
          Login
        </h2> */}
      </div>
    </header>
  );
};

export default Header;

import React, { useEffect } from "react";
import { Link } from "react-router";

const ErrorPage = () => {
    useEffect(() => {
    const theme = localStorage.getItem("theme") || "dark";
    document.documentElement.setAttribute("data-theme", theme);
  }, []);

  return (
    <div>
      <div className="min-h-screen bg-base-100 flex flex-col justify-center items-center px-6">
        <div className="flex justify-center items-center flex-col">
          <img
            src="https://i.ibb.co/nqK6c47S/error.png"
            alt=""
            className="w-[75%] mb-4"
          />
          <h2 className="text-3xl md:text-4xl font-bold text-red-500 mb-6">
            Page Not Found
          </h2>

          <Link to="/">
            <button className="btn btn-accent text-xl px-6 rounded-full">
              🏠 Back to Home
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ErrorPage;

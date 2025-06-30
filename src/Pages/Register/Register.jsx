import React, { useContext, useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { Link, useLocation, useNavigate } from "react-router";
import { AuthContext } from "../../Authentication/AuthContext";
import { toast } from "react-toastify";

const Register = () => {
  const { createUser, googleLogin, updateUserProfile } =
    useContext(AuthContext);
  const location = useLocation();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);

  const handleRegister = (e) => {
    e.preventDefault();
    const form = e.target;
    const formData = new FormData(form);
    const name = formData.get("name");
    const email = formData.get("email");
    const photo = formData.get("photo");
    const password = formData.get("password");

    const uppercaseRegex = /(?=.*[A-Z])/;
    const lowercaseRegex = /(?=.*[a-z])/;
    const lengthRegex = /.{6,}/;

    if (!uppercaseRegex.test(password)) {
      toast.error("Password should have at least one uppercase");
      return;
    }
    if (!lowercaseRegex.test(password)) {
      toast.error("Password should have at least one lowercase");
      return;
    }
    if (!lengthRegex.test(password)) {
      toast.error("Password should have at least 6 characters or longer");
      return;
    }

    createUser(email, password)
      .then(() => {
        toast.success("You registered successfully");
        updateUserProfile(name, photo)
          .then(() => {})
          .catch((error) => toast.error(error.code));
        navigate(location.state || "/");
        form.reset();
      })
      .catch((error) => toast.error(error.code));
  };

  const handleGoogleLogin = () => {
    googleLogin()
      .then(() => {
        navigate(location.state || "/");
        toast.success("You registered successfully");
      })
      .catch((error) => toast.error(error.code));
  };

  return (
    <div className="px-4">
      <div className="card bg-base-100 w-full max-w-sm mx-auto my-12 shrink-0 shadow-2xl">
        <div className="card-body">
          <h1 className="text-5xl font-bold mb-4">Register Now!</h1>
          <form onSubmit={handleRegister} className="fieldset">
            <label className="label font-semibold">Name</label>
            <input
              type="text"
              className="input mb-4 text-lg placeholder:text-[15px] placeholder:font-bold rancho"
              name="name"
              placeholder="Enter your Name"
            />
            <label className="label font-semibold">Email</label>
            <input
              type="email"
              className="input mb-4 text-lg placeholder:text-[15px] placeholder:font-bold rancho"
              name="email"
              placeholder="Enter your Email"
            />
            <label className="label font-semibold">Photo URL</label>
            <input
              type="text"
              className="input mb-4 text-lg placeholder:text-[15px] placeholder:font-bold rancho"
              name="photo"
              placeholder="Enter your Photo Url"
            />
            <label className="label font-semibold">Password</label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                className="input text-lg placeholder:text-[15px] placeholder:font-bold rancho"
                name="password"
                placeholder="Enter your password"
              />
              {showPassword ? (
                <FaEyeSlash
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute top-3 right-6 cursor-pointer z-10"
                  size={17}
                />
              ) : (
                <FaEye
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute top-3 right-6 cursor-pointer z-10"
                  size={17}
                />
              )}
            </div>
            <button className="btn btn-neutral mt-4 text-2xl">Register</button>
            <p className="text-xs my-2">
              Already have an account ? Please{" "}
              <Link
                state={location.state}
                to="/login"
                className="underline text-blue-500 font-semibold"
              >
                Login
              </Link>
            </p>
          </form>
          {/* Google */}
          <button
            onClick={handleGoogleLogin}
            className="btn bg-white text-black mt-6 text-lg border-[#e5e5e5]"
          >
            <svg
              aria-label="Google logo"
              width="20"
              height="20"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 512 512"
            >
              <g>
                <path d="m0 0H512V512H0" fill="#fff"></path>
                <path
                  fill="#34a853"
                  d="M153 292c30 82 118 95 171 60h62v48A192 192 0 0190 341"
                ></path>
                <path
                  fill="#4285f4"
                  d="m386 400a140 175 0 0053-179H260v74h102q-7 37-38 57"
                ></path>
                <path
                  fill="#fbbc02"
                  d="m90 341a208 200 0 010-171l63 49q-12 37 0 73"
                ></path>
                <path
                  fill="#ea4335"
                  d="m153 219c22-69 116-109 179-50l55-54c-78-75-230-72-297 55"
                ></path>
              </g>
            </svg>
            Continue with Google
          </button>
        </div>
      </div>
    </div>
  );
};

export default Register;

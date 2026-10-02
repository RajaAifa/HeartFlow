import React, { useContext, useState } from "react";
import { AppContext } from "../context/AppContext";
import axios from "axios";
import { toast } from "react-toastify";
import { Mail, Lock, User, Camera, ArrowRight, Loader2 } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const { backendUrl, setToken } = useContext(AppContext);
  const navigate = useNavigate();

  const [state, setState] = useState("Login");
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    image: null,
  });

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setForm({
      ...form,
      [name]: files ? files[0] : value,
    });
  };

  const register = async () => {
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("name", form.name);
      formData.append("email", form.email);
      formData.append("password", form.password);
      formData.append("image", form.image);

      const { data } = await axios.post(
        backendUrl + "/api/user/register",
        formData
      );

      if (data.success) {
        toast.success("Verification email sent! Check your inbox.");
        setState("Login");
      } else {
        toast.error(data.message);
      }

    } catch (err) {
      toast.error("Registration failed");
    } finally {
      setLoading(false);
    }
  };

  const login = async () => {
    setLoading(true);
    try {
      const { data } = await axios.post(
        backendUrl + "/api/user/login",
        {
          email: form.email,
          password: form.password,
        }
      );

      if (!data.success) {

        if (data.message?.toLowerCase().includes("blocked")) {
          localStorage.removeItem("token");
          setToken("");

          return toast.error("🚫 Your account has been blocked by admin");
        }

        return toast.error(data.message);
      }

      localStorage.setItem("token", data.token);
      setToken(data.token);

      toast.success("Welcome back to HeartFlow");
      console.log("Navigating to home...");
      navigate("/");

    } catch (err) {
      toast.error("Login failed");
    } finally {
      setLoading(false);
    }
  };

  const forgotPassword = async () => {
    setLoading(true);
    try {
      const { data } = await axios.post(
        backendUrl + "/api/user/forgot-password",
        { email: form.email }
      );

      if (data.success) {
        toast.success("Reset link sent successfully");
      } else {
        toast.error(data.message);
      }

    } catch (err) {
      toast.error("Error sending reset email");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (state === "Sign Up") register();
    else if (state === "Login") login();
    else forgotPassword();
  };

  return (
    <div className="flex items-center justify-center min-h-[85vh] px-4">
      <form
        onSubmit={handleSubmit}
        className="flex flex-col items-center w-full max-w-md p-8 text-sm border shadow-2xl border-zinc-200 rounded-2xl text-zinc-600 bg-white/80 backdrop-blur-md"
      >
        <div className="w-full mb-8 text-center">
          <h1 className="text-3xl font-bold text-[#dc2626]">HeartFlow</h1>

          <h2 className="mt-2 text-xl font-medium text-zinc-800">
            {state === "Login"
              ? "Welcome Back"
              : state === "Sign Up"
              ? "Create Your Portal"
              : "Account Recovery"}
          </h2>

          <p className="mt-1 text-zinc-400">
            {state === "Login"
              ? "Secure access to your health records"
              : "Start your clinical journey with us"}
          </p>
        </div>

        <div className="w-full space-y-5">

          {state === "Sign Up" && (
            <>
              <div className="relative">
                <User className="absolute w-4 h-4 left-3 top-9 text-zinc-400" />
                <p className="mb-1 ml-1 font-medium">Full Name</p>
                <input
                  name="name"
                  type="text"
                  onChange={handleChange}
                  className="border rounded-lg w-full pl-10 pr-4 py-2.5"
                  required
                />
              </div>

              <div>
                <p className="mb-1 ml-1 font-medium">Profile Image</p>
                <label className="flex items-center justify-center w-full h-24 border-2 border-dashed rounded-lg cursor-pointer">
                  {form.image ? (
                    <p className="text-xs text-red-600">{form.image.name}</p>
                  ) : (
                    <Camera className="w-6 h-6 text-gray-300" />
                  )}
                  <input
                    type="file"
                    name="image"
                    className="hidden"
                    onChange={handleChange}
                    required
                  />
                </label>
              </div>
            </>
          )}

          <div className="relative">
            <Mail className="absolute w-4 h-4 left-3 top-9 text-zinc-400" />
            <p className="mb-1 ml-1 font-medium">Email</p>
            <input
              name="email"
              type="email"
              onChange={handleChange}
              className="border rounded-lg w-full pl-10 pr-4 py-2.5"
              required
            />
          </div>

          {state !== "Forgot" && (
            <div className="relative">
              <Lock className="absolute w-4 h-4 left-3 top-9 text-zinc-400" />
              <p className="mb-1 ml-1 font-medium">Password</p>
              <input
                name="password"
                type="password"
                onChange={handleChange}
                className="border rounded-lg w-full pl-10 pr-4 py-2.5"
                required
              />
            </div>
          )}
        </div>

        <button
          disabled={loading}
          className="flex items-center justify-center w-full gap-2 py-3 mt-8 text-white bg-red-600 rounded-xl"
        >
          {loading && <Loader2 className="w-5 h-5 animate-spin" />}
          {state === "Login"
            ? "Sign In"
            : state === "Sign Up"
            ? "Get Started"
            : "Reset Password"}
          {!loading && <ArrowRight className="w-4 h-4" />}
        </button>

        <div className="w-full mt-6 text-center">

          {state === "Login" && (
            <>
              <button
                type="button"
                onClick={() => setState("Forgot")}
                className="text-xs text-gray-400"
              >
                Forgot password?
              </button>

              <p className="mt-2 text-sm">
                New user?{" "}
                <span
                  onClick={() => setState("Sign Up")}
                  className="text-red-600 cursor-pointer"
                >
                  Sign up
                </span>
              </p>
            </>
          )}

          {state === "Sign Up" && (
            <p>
              Already have an account?{" "}
              <span
                onClick={() => setState("Login")}
                className="text-red-600 cursor-pointer"
              >
                Login
              </span>
            </p>
          )}

          {state === "Forgot" && (
            <p
              onClick={() => setState("Login")}
              className="text-red-600 cursor-pointer"
            >
              Back to login
            </p>
          )}
        </div>
      </form>
    </div>
  );
};

export default Login;
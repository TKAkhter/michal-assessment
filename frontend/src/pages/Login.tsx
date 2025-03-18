import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Logo } from "../components/Logo";
import { HeroIcon } from "../components/Icons/HeroIcon";
import { MailIcon } from "../components/Icons/MailIcon";
import { LockIcon } from "../components/Icons/LockIcon";
import { trpc } from "../trpc/client";
import { Loader } from "../components/Loader";
import { toast } from "react-toastify";
import { isTokenValid } from "../utils/utils";

export const Login: React.FC = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (isTokenValid(token)) {
      navigate("/");
    }
  }, []);

  const loginMutation = trpc.auth.login.useMutation({
    onSuccess: (data: any) => {
      localStorage.setItem("token", data.token);
      toast.success("Login successful!");
      navigate("/");
    },
  });

  const [form, setForm] = useState({ email: "", password: "" });

  return (
    <div className="h-screen rounded-sm border border-stroke bg-white shadow-default">
      {loginMutation.isLoading ? <Loader /> : null}
      <div className="h-screen flex flex-wrap items-center">
        <div className="hidden w-full xl:block xl:w-1/2">
          <div className="py-17.5 px-26 text-center">
            <Link className="mb-5.5 inline-block" to="/">
              <Logo className="w-100" />
            </Link>

            <p className="2xl:px-20 text-black">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit suspendisse.
            </p>

            <span className="mt-15 inline-block">
              <HeroIcon />
            </span>
          </div>
        </div>

        <div className="w-full xl:hidden xl:w-1/2">
          <div className="text-center">
            <Link className="mb-5.5 inline-block" to="/">
              <Logo className="w-100" />
            </Link>
          </div>
        </div>

        <div className="w-full border-stroke xl:w-1/2 xl:border-l-2">
          <div className="w-full p-4 sm:p-12.5 xl:p-17.5">
            <span className="mb-1.5 block font-medium text-black">
              Start for free
            </span>
            <h2 className="mb-9 text-2xl font-bold text-black sm:text-title-xl2">
              Sign In to TailAdmin
            </h2>
            <div className="mb-4">
              <label
                htmlFor="email"
                className="mb-2.5 block font-medium text-black"
              >
                Email
              </label>
              <div className="relative">
                <input
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                  className="w-full rounded-lg border border-stroke bg-transparent py-4 pl-6 pr-10 text-black outline-none focus:border-primary focus-visible:shadow-none"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                />
                <span className="absolute right-4 top-4">
                  <MailIcon />
                </span>
              </div>
            </div>

            <div className="mb-6">
              <label
                htmlFor="passowrd"
                className="mb-2.5 block font-medium text-black "
              >
                Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  type="password"
                  placeholder="6+ Characters, 1 Capital letter, 1 Special character"
                  className="w-full rounded-lg border border-stroke bg-transparent py-4 pl-6 pr-10 text-black outline-none focus:border-primary focus-visible:shadow-none"
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                />
                <span className="absolute right-4 top-4">
                  <LockIcon />
                </span>
              </div>
            </div>

            <div className="mb-5">
              <button
                value="Sign In"
                className="w-full cursor-pointer rounded-lg border border-primary bg-primary p-4 text-black transition hover:bg-opacity-90"
                onClick={() => loginMutation.mutate(form)}
              >Sign In</button>
            </div>
            <div className="mt-6 text-center">
              <p className="text-black">
                Don’t have any account?{" "}
                <Link to="/register" className="text-primary">
                  Sign Up
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { HeroIcon } from "../components/Icons/HeroIcon";
import { Logo } from "../components/Logo";
import { UserIcon } from "../components/Icons/UserIcon";
import { MailIcon } from "../components/Icons/MailIcon";
import { LockIcon } from "../components/Icons/LockIcon";
import { trpc } from "../trpc/client";
import { isTokenValid } from "../utils/utils";

export const Register: React.FC = () => {
  const navigate = useNavigate();

  const registerMutation = trpc.auth.register.useMutation({
    onSuccess: () => navigate("/login"),
  });

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (isTokenValid(token)) {
      navigate("/");
    }
  }, []);

  const [form, setForm] = useState({ name: "", username: "", email: "", password: "", confirmPassword: "" });


  return (
    <div className="h-screen rounded-sm border border-stroke bg-white shadow-default">
      <div className="h-screen flex flex-wrap items-center">
        <div className="hidden w-full xl:block xl:w-1/2">
          <div className="py-17.5 px-26 text-center">
            <Link className="mb-5.5 inline-block" to="/">
              <Logo />
            </Link>
            <p className="2xl:px-20 text-black">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit suspendisse.
            </p>

            <span className="mt-15 inline-block">
              <HeroIcon />
            </span>
          </div>
        </div>

        <div className="w-full border-stroke xl:w-1/2 xl:border-l-2">
          <div className="w-full p-4 sm:p-12.5 xl:p-17.5">
            <span className="mb-1.5 block font-medium text-black">
              Start for free
            </span>
            <h2 className="mb-9 text-2xl font-bold text-black sm:text-title-xl2">
              Sign Up to TailAdmin
            </h2>

            <div className="mb-4">
              <label
                htmlFor="name"
                className="mb-2.5 block font-medium text-black"
              >
                Name
              </label>
              <div className="relative">
                <input
                  id="name"
                  type="text"
                  placeholder="Enter your full name"
                  className={`w-full rounded-lg border border-stroke bg-transparent py-4 pl-6 pr-10 text-black outline-none focus:border-primary focus-visible:shadow-none `}
                  value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })}
                />
                <span className="absolute right-4 top-4">
                  <UserIcon />
                </span>
              </div>
            </div>

            <div className="mb-4">
              <label
                htmlFor="username"
                className="mb-2.5 block font-medium text-black"
              >
                Username
              </label>
              <div className="relative">
                <input
                  id="username"
                  type="text"
                  placeholder="Enter your full name"
                  className={`w-full rounded-lg border border-stroke bg-transparent py-4 pl-6 pr-10 text-black outline-none focus:border-primary focus-visible:shadow-none `}
                  value={form.username} onChange={(e) => setForm({ ...form, username: e.target.value })}
                />
                <span className="absolute right-4 top-4">
                  <UserIcon />
                </span>
              </div>
            </div>

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
                  className={`w-full rounded-lg border border-stroke bg-transparent py-4 pl-6 pr-10 text-black outline-none focus:border-primary focus-visible:shadow-none `}
                  value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })}
                />
                <span className="absolute right-4 top-4">
                  <MailIcon />
                </span>
              </div>
            </div>

            <div className="mb-4">
              <label
                htmlFor="passowrd"
                className="mb-2.5 block font-medium text-black"
              >
                Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  type="password"
                  placeholder="Enter your password"
                  className={`w-full rounded-lg border border-stroke bg-transparent py-4 pl-6 pr-10 text-black outline-none focus:border-primary focus-visible:shadow-none `}
                  value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })}
                />
                <span className="absolute right-4 top-4">
                  <LockIcon />
                </span>
              </div>
            </div>

            <div className="mb-6">
              <label
                htmlFor="confirmPassword"
                className="mb-2.5 block font-medium text-black"
              >
                Re-type Password
              </label>
              <div className="relative">
                <input
                  id="confirmPassword"
                  type="password"
                  placeholder="Re-enter your password"
                  className={`w-full rounded-lg border border-stroke bg-transparent py-4 pl-6 pr-10 text-black outline-none focus:border-primary focus-visible:shadow-none `}
                />
                <span className="absolute right-4 top-4">
                  <LockIcon />
                </span>
              </div>
            </div>

            <div className="mb-5">
              <button
                value="Create account"
                className="w-full cursor-pointer rounded-lg border border-primary bg-primary p-4 text-white transition hover:bg-opacity-90"
                onClick={() => registerMutation.mutate(form)}
              />
            </div>
            <div className="mt-6 text-center">
              <p className="text-black">
                Already have an account?{" "}
                <Link to="/signin" className="text-primary">
                  Sign in
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

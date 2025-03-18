import React, { useEffect } from "react";
import { useLogin } from "../hooks/useLogin";
import { Link, useHistory } from "react-router-dom";
import { Logo } from "../components/Logo";
import { HeroIcon } from "../components/Icons/HeroIcon";
import { MailIcon } from "../components/Icons/MailIcon";
import { LockIcon } from "../components/Icons/LockIcon";
import { RootState } from "../redux/store";
import { useSelector } from "react-redux";
import { isTokenValid } from "../utils/utils";

export const Login: React.FC = () => {
  const { register, handleSubmit, onSubmit, errors } = useLogin();
  const history = useHistory();
  const token = useSelector((state: RootState) => state.auth.token);

  useEffect(() => {
    if (isTokenValid(token)) {
      history.push("/dashboard");
    }
  }, [token, history]);

  return (
    <div className="h-screen rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
      <div className="h-screen flex flex-wrap items-center">
        <div className="hidden w-full xl:block xl:w-1/2">
          <div className="py-17.5 px-26 text-center">
            <Link className="mb-5.5 inline-block" to="/">
              <Logo />
            </Link>

            <p className="2xl:px-20 text-black dark:text-white">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit suspendisse.
            </p>

            <span className="mt-15 inline-block">
              <HeroIcon />
            </span>
          </div>
        </div>

        <div className="w-full border-stroke dark:border-strokedark xl:w-1/2 xl:border-l-2">
          <div className="w-full p-4 sm:p-12.5 xl:p-17.5">
            <span className="mb-1.5 block font-medium text-black dark:text-white">
              Start for free
            </span>
            <h2 className="mb-9 text-2xl font-bold text-black dark:text-white sm:text-title-xl2">
              Sign In to TailAdmin
            </h2>

            <form onSubmit={handleSubmit(onSubmit)}>
              <div className="mb-4">
                <label
                  htmlFor="email"
                  className="mb-2.5 block font-medium text-black dark:text-white"
                >
                  Email
                </label>
                <div className="relative">
                  <input
                    id="email"
                    {...register("email")}
                    type="email"
                    placeholder="Enter your email"
                    className="w-full rounded-lg border border-stroke bg-transparent py-4 pl-6 pr-10 text-black outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                  />
                  {errors.email && <p className="error">{errors.email.message}</p>}

                  <span className="absolute right-4 top-4">
                    <MailIcon />
                  </span>
                </div>
              </div>

              <div className="mb-6">
                <label
                  htmlFor="passowrd"
                  className="mb-2.5 block font-medium text-black dark:text-white"
                >
                  Password
                </label>
                <div className="relative">
                  <input
                    id="password"
                    {...register("password")}
                    type="password"
                    placeholder="6+ Characters, 1 Capital letter, 1 Special character"
                    className="w-full rounded-lg border border-stroke bg-transparent py-4 pl-6 pr-10 text-black outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                  />
                  {errors.password && <p className="error">{errors.password.message}</p>}

                  <span className="absolute right-4 top-4">
                    <LockIcon />
                  </span>
                </div>
              </div>

              <div className="mb-5">
                <input
                  type="submit"
                  value="Sign In"
                  className="w-full cursor-pointer rounded-lg border border-primary bg-primary p-4 text-white transition hover:bg-opacity-90"
                />
              </div>
              <div className="mt-6 text-center">
                <p className="text-black dark:text-white">
                  Don’t have any account?{" "}
                  <Link to="/register" className="text-primary">
                    Sign Up
                  </Link>
                </p>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

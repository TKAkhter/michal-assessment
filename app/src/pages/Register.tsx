import React, { useEffect } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import useRegister, { RegisterFormValues } from "../hooks/useRegister";
import { Link, useHistory } from "react-router-dom";
import { HeroIcon } from "../components/Icons/HeroIcon";
import { Logo } from "../components/Logo";
import { UserIcon } from "../components/Icons/UserIcon";
import { MailIcon } from "../components/Icons/MailIcon";
import { LockIcon } from "../components/Icons/LockIcon";
import { useSelector } from "react-redux";
import { RootState } from "../redux/store";
import { isTokenValid } from "../utils/utils";

export const Register: React.FC = () => {
  const history = useHistory();
  const token = useSelector((state: RootState) => state.auth.token);

  useEffect(() => {
    if (isTokenValid(token)) {
      history.push("/dashboard");
    }
  }, [token, history]);

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<RegisterFormValues>();
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { register: registerUser, isLoading, error, successMessage } = useRegister();

  const onSubmit: SubmitHandler<RegisterFormValues> = (data) => {
    registerUser(data);
  };

  const password = watch("password");

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
              Sign Up to TailAdmin
            </h2>

            <form onSubmit={handleSubmit(onSubmit)}>
              <div className="mb-4">
                <label
                  htmlFor="name"
                  className="mb-2.5 block font-medium text-black dark:text-white"
                >
                  Name
                </label>
                <div className="relative">
                  <input
                    id="name"
                    {...register("name", { required: "name is required" })}
                    type="text"
                    placeholder="Enter your full name"
                    className={`w-full rounded-lg border border-stroke bg-transparent py-4 pl-6 pr-10 text-black outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary ${
                      errors.name ? "border-red-500" : ""
                    }`}
                  />
                  {errors.name && <p className="text-red-500 text-xs">{errors.name.message}</p>}
                  <span className="absolute right-4 top-4">
                    <UserIcon />
                  </span>
                </div>
              </div>

              <div className="mb-4">
                <label
                  htmlFor="username"
                  className="mb-2.5 block font-medium text-black dark:text-white"
                >
                  Username
                </label>
                <div className="relative">
                  <input
                    id="username"
                    {...register("username", { required: "username is required" })}
                    type="text"
                    placeholder="Enter your full name"
                    className={`w-full rounded-lg border border-stroke bg-transparent py-4 pl-6 pr-10 text-black outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary ${
                      errors.username ? "border-red-500" : ""
                    }`}
                  />
                  {errors.username && (
                    <p className="text-red-500 text-xs">{errors.username.message}</p>
                  )}

                  <span className="absolute right-4 top-4">
                    <UserIcon />
                  </span>
                </div>
              </div>

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
                    {...register("email", { required: "Email is required" })}
                    type="email"
                    placeholder="Enter your email"
                    className={`w-full rounded-lg border border-stroke bg-transparent py-4 pl-6 pr-10 text-black outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary ${
                      errors.email ? "border-red-500" : ""
                    }`}
                  />
                  {errors.email && <p className="text-red-500 text-xs">{errors.email.message}</p>}

                  <span className="absolute right-4 top-4">
                    <MailIcon />
                  </span>
                </div>
              </div>

              <div className="mb-4">
                <label
                  htmlFor="passowrd"
                  className="mb-2.5 block font-medium text-black dark:text-white"
                >
                  Password
                </label>
                <div className="relative">
                  <input
                    id="password"
                    {...register("password", {
                      required: "Password is required",
                      minLength: { value: 6, message: "Password must be at least 6 characters" },
                    })}
                    type="password"
                    placeholder="Enter your password"
                    className={`w-full rounded-lg border border-stroke bg-transparent py-4 pl-6 pr-10 text-black outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary ${
                      errors.password ? "border-red-500" : ""
                    }`}
                  />
                  {errors.password && (
                    <p className="text-red-500 text-xs">{errors.password.message}</p>
                  )}

                  <span className="absolute right-4 top-4">
                    <LockIcon />
                  </span>
                </div>
              </div>

              <div className="mb-6">
                <label
                  htmlFor="confirmPassword"
                  className="mb-2.5 block font-medium text-black dark:text-white"
                >
                  Re-type Password
                </label>
                <div className="relative">
                  <input
                    id="confirmPassword"
                    {...register("confirmPassword", {
                      required: "Confirm Password is required",
                      validate: (value) => value === password || "Passwords do not match",
                    })}
                    type="password"
                    placeholder="Re-enter your password"
                    className={`w-full rounded-lg border border-stroke bg-transparent py-4 pl-6 pr-10 text-black outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary ${
                      errors.confirmPassword ? "border-red-500" : ""
                    }`}
                  />
                  {errors.confirmPassword && (
                    <p className="text-red-500 text-xs">{errors.confirmPassword.message}</p>
                  )}

                  <span className="absolute right-4 top-4">
                    <LockIcon />
                  </span>
                </div>
              </div>

              <div className="mb-5">
                <input
                  type="submit"
                  value="Create account"
                  className="w-full cursor-pointer rounded-lg border border-primary bg-primary p-4 text-white transition hover:bg-opacity-90"
                />
              </div>
              <div className="mt-6 text-center">
                <p className="text-black dark:text-white">
                  Already have an account?{" "}
                  <Link to="/signin" className="text-primary">
                    Sign in
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

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { trpc } from "@/trpc/client";
import { isTokenValid } from "@/utils/utils";
import { toast } from "react-toastify";
import logger from "@/common/pino";

export const Register: React.FC = () => {
  const navigate = useNavigate();

  const registerMutation = trpc.auth.register.useMutation({
    onSuccess: () => {
      toast.success("Registration successful!");
      navigate("/login");
    },
    onError: (error: any) => {
      logger.error(error);
      toast.error("Username or email already exist or invalid email or password");
    },
  });

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (isTokenValid(token)) {
      navigate("/");
    }
  }, []);

  const [form, setForm] = useState({ name: "", username: "", email: "", password: "", confirmPassword: "" });

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
      <div className="w-full max-w-sm bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold text-center mb-4">Register</h2>

        <label className="block text-sm font-medium text-gray-700">Name</label>
        <Input
          type="name"
          placeholder="Enter your name"
          className="mt-1 w-full mb-6"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
        />

        <label className="block text-sm font-medium text-gray-700">Username</label>
        <Input
          type="username"
          placeholder="Enter your username"
          className="mt-1 w-full mb-6"
          value={form.username}
          onChange={(e) => setForm({ ...form, username: e.target.value })}
        />

        <label className="block text-sm font-medium text-gray-700">Email</label>
        <Input
          type="email"
          placeholder="Enter your email"
          className="mt-1 w-full mb-6"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
        />

        <label className="block text-sm font-medium text-gray-700 mt-3">Password</label>
        <Input
          type="password"
          placeholder="Create a password"
          className="mt-1 w-full mb-2"
          value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
        />
        <label className="block text-sm font-light text-gray-400 mb-4">Password should contain a lowercase, an uppercase, a special character and length of 8 characters</label>

        <label className="block text-sm font-medium text-gray-700 mt-3">Confirm Password</label>
        <Input
          type="password"
          placeholder="Confirm Password"
          className="mt-1 w-full mb-6"
          value={form.confirmPassword}
          onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })}
        />

        {/* Submit Button */}
        <Button className="w-full mt-4 bg-black text-white" onClick={() => registerMutation.mutate(form)}>
          Register
        </Button>

        {/* Login Link */}
        <p className="text-center text-sm text-gray-600 mt-3">
          Already have an account?{" "}
          <span className="text-blue-500 cursor-pointer" onClick={() => navigate("/login")}>
            Login
          </span>
        </p>
      </div>
    </div>
  );
}
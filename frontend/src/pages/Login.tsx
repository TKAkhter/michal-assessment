import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { isTokenValid } from "@/utils/utils";
import { trpc } from "@/trpc/client";
import { toast } from "react-toastify";
import { Loader } from "lucide-react";
import logger from "@/common/pino";

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
    onError: (error: any) => {
      logger.error(error);
      toast.error("Invalid email or password");
    },
  });

  const [form, setForm] = useState({ email: "", password: "" });
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
      <div className="mb-6">
        {loginMutation.isLoading ? <Loader /> : null}
      </div>
      <div className="w-full max-w-sm bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold text-center mb-4">Login</h2>

        <label className="block text-sm font-medium text-gray-700">Email</label>
        <Input
          type="email"
          placeholder="Enter your email"
          className="mt-1 w-full"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
        />

        <label className="block text-sm font-medium text-gray-700 mt-3">Password</label>
        <Input
          type="password"
          placeholder="Enter your password"
          className="mt-1 w-full"
          value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
        />

        <Button className="w-full mt-4 bg-black text-white" disabled={loginMutation.isLoading ? true : false} onClick={() => loginMutation.mutate(form)}>
          Login
        </Button>
        <p className="text-center text-sm text-gray-600 mt-3">
          Don't have an account?{" "}
          <span className="text-blue-500 cursor-pointer" onClick={() => navigate("/register")}>
            Register
          </span>
        </p>
      </div>
    </div>
  );
}
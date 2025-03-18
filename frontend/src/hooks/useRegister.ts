import { useState } from "react";
import { axiosClient } from "../common/axios";
import { useDispatch } from "react-redux";
import { login } from "../redux/slices/authSlice";
import { save } from "../redux/slices/userSlice";
import { useHistory } from "react-router-dom";
import { handleToastError } from "../utils/utils";

export interface RegisterFormValues {
  name: string;
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
}

const useRegister = () => {
  const dispatch = useDispatch();
  const history = useHistory();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const register = async (payload: RegisterFormValues) => {
    setIsLoading(true);
    setError(null);
    setSuccessMessage(null);

    try {
      const { data } = await axiosClient.post("/auth/register", payload);
      setSuccessMessage(data.message || "Registration successful!");
      dispatch(login(data.token));
      dispatch(
        save({
          email: data.email,
          id: data.id,
          username: data.username,
          name: data.name,
        }),
      );
      history.push("/dashboard");
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      setError(err.response?.data?.message || "An error occurred during registration.");
      console.error(err);
      handleToastError(err);
    } finally {
      setIsLoading(false);
    }
  };

  return { register, isLoading, error, successMessage };
};

export default useRegister;

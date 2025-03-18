import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useDispatch } from "react-redux";
import * as yup from "yup";
import { axiosClient } from "../common/axios";
import { login } from "../redux/slices/authSlice";
import { JwtUserPayload } from "../types/types";
import { jwtDecode } from "jwt-decode";
import { save } from "../redux/slices/userSlice";
import { toast } from "react-toastify";
import { addDelay, handleToastError } from "../utils/utils";
import { trpc } from "../trpc/client";

const schema = yup.object().shape({
  email: yup.string().email().required(),
  password: yup.string().min(6).required(),
});

interface LoginForm {
  email: string;
  password: string;
}

export const useLogin = () => {
  const dispatch = useDispatch();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginForm>({
    resolver: yupResolver(schema),
  });

  const onSubmit = async (submitData: LoginForm) => {
    try {
      trpc.auth.login.useMutation({
        onSuccess: (data) => {
          console.log("🚀 ~ onSubmit ~ data:", data);
          const decoded: JwtUserPayload = jwtDecode(data.token);
          dispatch(login(data.token));
          dispatch(
            save({
              email: decoded.email,
              id: decoded.id,
              username: decoded.username,
              name: decoded.name,
            }),
          );
          toast.success("Login successful!");
        },
      });
      await addDelay(500);
      window.location.reload();
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      await addDelay(500);
      console.error(error.message);
      handleToastError(error);
    }
  };

  return {
    register,
    handleSubmit,
    onSubmit,
    errors,
  };
};

import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useDispatch, useSelector } from "react-redux";
import * as yup from "yup";
import { axiosClient } from "../common/axios";
import { remove, save } from "../redux/slices/userSlice";
import { RootState } from "../redux/store";
import { toast } from "react-toastify";
import { useState } from "react";
import { addDelay } from "../utils/utils";
import { useHistory } from "react-router-dom";
import { logout } from "../redux/slices/authSlice";

const schema = yup.object().shape({
  name: yup.string(),
  email: yup.string().email(),
  username: yup.string(),
  phoneNumber: yup.string(),
  bio: yup.string(),
});

interface SettingsForm {
  name?: string;
  email?: string;
  username?: string;
  phoneNumber?: string;
  bio?: string;
}

export const useSettings = () => {
  const [isLoading, setIsLoading] = useState(false);
  const user = useSelector((state: RootState) => state.user);
  const history = useHistory();
  const dispatch = useDispatch();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SettingsForm>({
    resolver: yupResolver(schema),
    defaultValues: {
      name: user.name || "",
      email: user.email || "",
      username: user.username || "",
      phoneNumber: user.phoneNumber || "",
      bio: user.bio || "",
    },
  });

  const onSubmit = async (submitData: SettingsForm) => {
    try {
      setIsLoading(true);
      const { data } = await axiosClient.put(`/users/${user.id}`, submitData);
      dispatch(
        save({
          id: data.uuid,
          email: data.email,
          username: data.username,
          name: data.name,
          phoneNumber: data.phoneNumber,
          bio: data.bio,
        }),
      );
      await addDelay(500);
      toast.success("Settings updated successfully");
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      console.error(error.message || "Login failed");
    } finally {
      setIsLoading(false);
    }
  };

  const deleteAccount = async () => {
    try {
      setIsLoading(true);
      await axiosClient.delete(`/users/${user.id}`);
    } catch (error) {
      console.error("Error deleting account:", error);
    } finally {
      setIsLoading(true);
      toast.success("Account deleted successfully");
      dispatch(logout());
      dispatch(remove());
      history.push("/login");
    }
  };

  return {
    register,
    handleSubmit,
    onSubmit,
    errors,
    isLoading,
    deleteAccount,
  };
};

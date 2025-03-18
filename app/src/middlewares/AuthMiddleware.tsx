import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../redux/store";
import { jwtDecode } from "jwt-decode";
import { logout } from "../redux/slices/authSlice";
import { remove } from "../redux/slices/userSlice";
import { useHistory } from "react-router-dom";

export const AuthMiddleware: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const token = useSelector((state: RootState) => state.auth.token);
  const history = useHistory();
  const dispatch = useDispatch();
  useEffect(() => {
    const decodedToken = token ? jwtDecode(token) : {};
    const currentTime = Date.now() / 1000;
    if (!token || decodedToken.exp! < currentTime) {
      dispatch(logout());
      dispatch(remove());
      history.push("/login");
    }
  }, [token, history, dispatch]);

  return <>{children}</>;
};

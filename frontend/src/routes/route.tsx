import React from "react";
import { Route, Routes } from "react-router-dom";
import { Login } from "../pages/Login";
import { NotFound } from "../pages/NotFound";
import { Register } from "../pages/Register";
import { Dashboard } from "../pages/Dashboard";

const AppRoutes: React.FC = () => {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/" element={<Dashboard />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default AppRoutes;

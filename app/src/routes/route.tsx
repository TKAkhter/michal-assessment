import React from "react";
import { Route, Switch } from "react-router-dom";
import { Login } from "../pages/Login";
import { NotFound } from "../pages/NotFound";
import { AuthMiddleware } from "../middlewares/AuthMiddleware";
import { Register } from "../pages/Register";
import { DefaultLayout } from "../layout/DefaultLayout";
import { Dashboard } from "../pages/Dashboard";

const AppRoutes: React.FC = () => {
  return (
    <Switch>
      <Route path="/login" component={Login} />
      <Route path="/register" component={Register} />
      <AuthMiddleware>
        <DefaultLayout>
          <Route path="/dashboard" component={Dashboard} />
          <Route path="*" component={NotFound} />
        </DefaultLayout>
      </AuthMiddleware>
      <Route path="*" component={NotFound} />
    </Switch>
  );
};

export default AppRoutes;

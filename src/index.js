import "bootstrap/dist/css/bootstrap.min.css";
import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import { BrowserRouter, Switch, Route } from "react-router-dom";
import Dashboard from "./pages/dashboard/Dashboard";
import NotFound from "./pages/not-found/NotFound";
import "react-toastify/dist/ReactToastify.css";
import "chartjs-plugin-style/dist/chartjs-plugin-style";

ReactDOM.render(
  <BrowserRouter>
    <Switch>
      <Route path="/" exact={true} component={Dashboard} />
      <Route path="/:ownerName/:repoName" exact={true} component={Dashboard} />
      <Route path="*" exact={true} component={NotFound} />
    </Switch>
  </BrowserRouter>,
  document.getElementById("root")
);

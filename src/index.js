import "bootstrap/dist/css/bootstrap.min.css";
import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import { BrowserRouter, Switch, Route } from "react-router-dom";
import Dashboard from "./pages/dashboard/Dashboard";

ReactDOM.render(
  <BrowserRouter>
    <Switch>
      <Route path="/" exact={true} component={Dashboard} />
    </Switch>
  </BrowserRouter>,
  document.getElementById("root")
);

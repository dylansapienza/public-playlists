import * as React from "react";
import { BrowserRouter as Router, Route, Link } from "react-router-dom";
import { Login } from "./components/Login";

export const App = () => {
  return (
    <Router>
      <Route path="/" exact component={Login} />
    </Router>
  );
};

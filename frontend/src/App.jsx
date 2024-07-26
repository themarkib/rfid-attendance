import React from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  BrowserRouter,
} from "react-router-dom";
import AdminLogin from "./Page/AdminLogin";
import AdminDashboard from "./Page/AdminDashboard";
import Home from "./Page/Home";
import User from "./Page/User";
import ManageUser from "./Page/ManageUser";
import AddUser from "./Page/AddUser";








const App = () => {
  return (
    <BrowserRouter>
      <Routes>

        <Route path="/" element={<AdminLogin/>} />
        <Route path="/admin" element={<AdminLogin />} />
        {/* <Route path="/admindashboard" element={<AdminDashboard/>} /> */}
        <Route path="/admin-home" element={<Home/>} />
        <Route path="/admin-uselog" element={<User/>} />
        <Route path="/admin-manageuser" element={<ManageUser/>} />
        <Route path="/admin-adduser" element={<AddUser/>} />
      </Routes>

    </BrowserRouter>
  );
};

export default App;
import React, { Component, useContext } from "react";
import { render } from "react-dom";
import ReactDOM from "react-dom/client";
import ReportFailure from "./Pages/ReportFailure";
import ViewReports from "./Pages/ViewReports";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import HomePage from "./Pages/HomePage";
import LoginPage from "./Pages/LoginPage";
import Header from "./components/Header";
import AuthContext, { AuthProvider } from './context/AuthContext'
import SignupPage from "./Pages/SignupPage";
import Overview from "./Pages/Overview";


function PrivateRoute({children}) {
  let {user} = useContext(AuthContext)
  return user ? children : <Navigate to="/login"/>;
}

function PrivateRouteAdmin({children}) {
  let {user} = useContext(AuthContext)
  return user?.username === "admin" ? children : <Navigate to="/login"/>;
}

function App () {
    return (
      <div>
         <BrowserRouter>
         <AuthProvider>
            <Header/>
            <Routes>
            <Route  path="/overview" element={<PrivateRouteAdmin> <Overview/> </PrivateRouteAdmin>}/>
            <Route  path="/reportfailure" element={<ReportFailure />}/>
            <Route  path="/viewreports" element={<ViewReports />}/>
            <Route  path="/*" element={<PrivateRoute> <HomePage /> </PrivateRoute>}/>
            <Route  path="/signup" element={<SignupPage/>}/>
              <Route path="/login" element={<LoginPage/>}/>
              {/* <Route path="/" element={<p>funguj</p>}/>
              <Route path="/nahlasenezavady" element={<ViewReports/>}/>
              <Route path="/nahlasitzavadu" element={<ReportFailure/>}/> */}
            </Routes>
          </AuthProvider>
          </BrowserRouter>
      </div>
      
      
    );
}

const appDiv = ReactDOM.createRoot(document.getElementById("app"));
appDiv.render(

    <App />)
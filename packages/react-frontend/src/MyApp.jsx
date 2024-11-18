// src/MyApp.jsx
import React from "react";
import { Routes, Route } from "react-router-dom";

import Landing from "./Landing";
import Login from "./Login";
import SignUp from "./SignUp";
import Table from "./Table";

function MyApp(){
    return(
        <div className="app-container">
            <Routes> 
                <Route path="/" element={<Landing />}> </Route>
                <Route path="/login" element={<Login />}> </Route>
                <Route path="/signup" element={<SignUp />}> </Route>
		<Route path="/table" element={<Table />}> </Route>
            </Routes>
        </div>
    );
}

export default MyApp

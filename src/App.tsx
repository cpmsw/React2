import React, { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Dashboard from "./pages/dashboard";
import { registerLicense } from '@syncfusion/ej2/base';
import Sidebar1 from './components/sidebar1';
import TestComponent from './testcomponent';
import Layout from './components/Layout'; // Import Layout

registerLicense('Ngo9BigBOggjHTQxAR8/V1NMaF5cXmBCf1FpRmJGdld5fUVHYVZUTXxaS00DNHVRdkdmWX5fcXVURGhYV0RwV0I=');

const App: React.FC = () => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    useEffect(() => {
        const storedLoginStatus = localStorage.getItem('isLoggedIn');
        if (storedLoginStatus === 'true') {
            setIsLoggedIn(true);
        }
    }, []);

    const handleLogout = () => {
        setIsLoggedIn(false);
        localStorage.removeItem('isLoggedIn');
    };

    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Login onLogin={() => {
                        localStorage.setItem('isLoggedIn', 'true');
                        setIsLoggedIn(true);
                    }} />} />
                <Route
                    path="/dashboard"
                    element={
                        isLoggedIn ? (
                            <Layout onLogout={handleLogout}>
                                <Dashboard />
                            </Layout>
                        ) : (
                            <Navigate to="/" />
                        )
                    }
                />
                <Route
                    path="/testcomponent"
                    element={
                        isLoggedIn ? (
                            <Layout onLogout={handleLogout}>
                                <TestComponent />
                            </Layout>
                        ) : (
                            <Navigate to="/" />
                        )
                    }
                />
            </Routes>
        </BrowserRouter>
    );
};

export default App;
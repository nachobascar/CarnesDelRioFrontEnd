import React from 'react';
import { Route, Routes } from 'react-router-dom';
import AuthContextProvider from './contexts/AuthContext';

// Header and Footer
import Header from "./components/layout/header.js";
import Footer from "./components/layout/footer.js";

// Home page
import Home from "./components/home/home.js";
import Menu from './components/home/menu.js';
import Events from './components/home/events.js';
import BookATable from './components/home/bookATable.js';
import Testimonials from './components/home/testimonials.js';
import Gallery from './components/home/gallery.js';
import Chefs from './components/home/chefs.js';
import Contact from './components/home/contact.js';

// Cart page
import Cart from "./components/layout/cart.js";

// Session page
import Login from "./components/session/login.js";
import Register from "./components/session/register.js";

// User page
import UserPage from "./components/user/show.js";
import UserVerification from "./components/user/verification.js";
import UserForgotPassword from './components/user/forgotPassword';
import UserPasswordRecovery from './components/user/passwordRecovery';
import UserConfirmNewPassword from './components/user/confirmNewPassword';
import UserChangePassword from './components/user/changePassword';

export default function AppRoutes() {
  return (
    <AuthContextProvider>
        <div id="layout-page">
            <Header/>
            <Routes>
                <Route index element={
                    <div>
                        <Home />
                        <Menu/>
                        <Events/>
                        <BookATable/>
                        <Testimonials/>
                        <Gallery/>
                        <Chefs/>
                        <Contact/>
                        <Cart/>
                    </div>
                } />
                <Route path="login" element={<Login/>} />
                <Route path="register" element={<Register/>} />
                <Route path="account" element={<UserPage/>} />
                <Route path="verification" element={<UserVerification/>} />
                <Route path="forgotPassword" element={<UserForgotPassword/>} />
                <Route path="passwordRecovery" element={<UserPasswordRecovery/>} />
                <Route path="confirmNewPassword" element={<UserConfirmNewPassword/>} />
                <Route path="changePassword" element={<UserChangePassword/>} />
                <Route path="*" element={<div>Not Found</div>} />
            </Routes>
            <Footer />
        </div>
    </AuthContextProvider>
  );
}
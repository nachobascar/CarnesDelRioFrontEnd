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
                <Route path="*" element={<div>Not Found</div>} />
            </Routes>
            <Footer />
        </div>
    </AuthContextProvider>
  );
}
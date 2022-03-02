import React from 'react';
import { Route, Routes } from 'react-router-dom';
import AuthContextProvider from './contexts/AuthContext';

// Header and Footer
import Header from "./components/header.js";
import Footer from "./components/footer.js";

// Home page
import Home from "./components/home.js";
import Menu from './components/menu.js';
import Events from './components/events.js';
import BookATable from './components/bookATable.js';
import Testimonials from './components/testimonials.js';
import Gallery from './components/gallery.js';
import Chefs from './components/chefs.js';
import Contact from './components/contact.js';

// Cart page
import Cart from "./components/cart.js";

// Login
import Login from "./components/login.js";

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
                <Route path="*" element={<div>Not Found</div>} />
            </Routes>
            <Footer />
        </div>
    </AuthContextProvider>
  );
}
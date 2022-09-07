import React, {useState} from 'react';
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
import Logout from "./components/session/logout.js";

// User page
import UserPage from "./components/user/show.js";
import UserVerification from "./components/user/verification.js";
import UserForgotPassword from './components/user/forgotPassword';
import UserPasswordRecovery from './components/user/passwordRecovery';
import UserConfirmNewPassword from './components/user/confirmNewPassword';
import UserChangePassword from './components/user/changePassword';
import UserChangePhone from './components/user/changePhone';
import CreateAddress from './components/user/newAddress';

// Admin page
import AdminPage from "./components/pageAdmin/index";
import AdminProducts from "./components/pageAdmin/products";
import AdminEditProducts from "./components/pageAdmin/editProducts";
import AdminCategories from "./components/pageAdmin/categories";
import AdminEditCategories from "./components/pageAdmin/editCategories";
import AdminRemovedProducts from "./components/pageAdmin/removedProducts";

export default function AppRoutes() {
  const [cart, setCart] = useState([]);

  return (
    <AuthContextProvider>
        <div id="layout-page">
            <Header cart={cart}/>
            <Routes>
                <Route index element={
                    <div>
                        <Home />
                        <Menu setCart={setCart}/>
                        <Events/>
                        <BookATable/>
                        <Testimonials/>
                        <Gallery/>
                        <Chefs/>
                        <Contact/>
                    </div>
                } />
                <Route path="login" element={<Login/>} />
                <Route path="register" element={<Register/>} />
                <Route path="logout" element={<Logout/>} />
                <Route path="account" element={<UserPage/>} />
                <Route path="verification" element={<UserVerification/>} />
                <Route path="forgotPassword" element={<UserForgotPassword/>} />
                <Route path="passwordRecovery" element={<UserPasswordRecovery/>} />
                <Route path="confirmNewPassword" element={<UserConfirmNewPassword/>} />
                <Route path="changePassword" element={<UserChangePassword/>} />
                <Route path="changePhone" element={<UserChangePhone/>} />
                <Route path="admin" element={<AdminPage/>} >
                    <Route index element={<></>} />
                    <Route path="products" element={<AdminProducts/>}/>
                    <Route path="products/:id" element={<AdminEditProducts/>} />
                    <Route path="removedProducts" element={<AdminRemovedProducts/>} />
                    <Route path="categories" element={<AdminCategories/>}/>
                    <Route path="categories/:id" element={<AdminEditCategories/>} />
                    <Route path="*" element={<div>Not Found</div>} />
                </Route>
                <Route path="newAddress" element={<CreateAddress/>} />

                <Route path="*" element={<div>Not Found</div>} />
            
            </Routes>
            <Cart  cart={cart} setCart={setCart}/>
            <Footer />
        </div>
    </AuthContextProvider>
  );
}

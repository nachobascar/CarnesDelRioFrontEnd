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
import AdminAreas from './components/pageAdmin/areas';

export default function AppRoutes() {
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(0);

  function isLoading (load) {
    if (load) {
        setLoading(loading + 1);
    } else {
        setLoading(loading - 1);
    }
  }

  return (
    <AuthContextProvider>
        <div id="layout-page">
            <Header cart={cart}/>
            <Routes>
                <Route index element={
                    <div>
                        <Home />
                        <Menu setCart={setCart} isLoading={isLoading}/>
                        <Events/>
                        <BookATable/>
                        <Testimonials/>
                        <Gallery/>
                        <Chefs/>
                        <Contact/>
                    </div>
                } />
                <Route path="login" element={<Login isLoading={isLoading}/>} />
                <Route path="register" element={<Register isLoading={isLoading}/>} />
                <Route path="logout" element={<Logout isLoading={isLoading}/>} />
                <Route path="account" element={<UserPage isLoading={isLoading}/>} />
                <Route path="verification" element={<UserVerification isLoading={isLoading}/>} />
                <Route path="forgotPassword" element={<UserForgotPassword isLoading={isLoading}/>} />
                <Route path="passwordRecovery" element={<UserPasswordRecovery isLoading={isLoading}/>} />
                <Route path="confirmNewPassword" element={<UserConfirmNewPassword isLoading={isLoading}/>} />
                <Route path="changePassword" element={<UserChangePassword isLoading={isLoading}/>} />
                <Route path="changePhone" element={<UserChangePhone isLoading={isLoading}/>} />
                <Route path="admin" element={<AdminPage/>} >
                    <Route index element={<></>} />
                    <Route path="products" element={<AdminProducts isLoading={isLoading}/>}/>
                    <Route path="products/:id" element={<AdminEditProducts isLoading={isLoading}/>} />
                    <Route path="removedProducts" element={<AdminRemovedProducts isLoading={isLoading}/>} />
                    <Route path="categories" element={<AdminCategories isLoading={isLoading}/>}/>
                    <Route path="categories/:id" element={<AdminEditCategories isLoading={isLoading}/>} />
                    <Route path="areas" element={<AdminAreas isLoading={isLoading}/>}/>
                    <Route path="*" element={<div>Not Found</div>} />
                </Route>
                <Route path="newAddress" element={<CreateAddress isLoading={isLoading}/>} />

                <Route path="*" element={<div>Not Found</div>} />
            
            </Routes>
            <Cart  cart={cart} setCart={setCart} isLoading={isLoading}/>
            <Footer />
            {loading > 0 && 
                <React.Fragment>
                    <div className="spinner-loader" style={{zIndex: 2000, display: "block", paddingRight: '17px'}}>
                        <div className="d-flex w-100 h-100 justify-content-center align-items-center">
                            <div className="spinner-grow  text-warning" role="status" style={{width: '4rem', height:'4rem'}}>
                                <span className="sr-only">Loading...</span>
                            </div>
                        </div>
                    </div>
                    <div className="modal-backdrop fade in modal-stack" style={{zIndex: 1999}}></div>
                    <div id="overlay" style={{zIndex: 1999}}>
                    </div>
                </React.Fragment>
            }
        </div>
    </AuthContextProvider>
  );
}

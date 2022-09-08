import React from 'react';
import { Outlet, Navigate } from 'react-router-dom';

import useAuth from '../../hooks/useAuth';



const AdminPage = function (errorType = null) {

    const {currentUser} = useAuth();
    if (!currentUser || !currentUser.admin) return <Navigate to="/" />;

    return (
        <>  
        <div className="admin-page-container wrapper">
            <nav id="sidebar" className="">

                <ul className="list-unstyled components">
                    <p></p>
                    <li className="active">
                        <a href="#homeSubmenu" data-toggle="collapse" aria-expanded="false" className="dropdown-toggle">Administrar productos</a>
                        <ul className="collapse list-unstyled" id="homeSubmenu" wfd-invisible="true">
                            <li>
                                <a href="/admin/products" className="admin-page-submenu">Productos</a>
                            </li>
                            <li>
                                <a href="/admin/categories" className="admin-page-submenu">Categorías</a>
                            </li>
                            <li>
                                <a href="/admin/promotions" className="admin-page-submenu">Promociones</a>
                            </li>

                            <li>
                                <a href="/admin/removedProducts" className="admin-page-submenu">Productos Eliminados</a>
                            </li>
                        </ul>
                    </li>
                    <li>
                        <a href="/admin/areas">Regiones y Comunas</a>
                    </li>
                    <li>
                        <a href="/admin/users">Usuarios</a>
                    </li>
                </ul>

            </nav>
            <Outlet/>
        </div>
        </>
    );
}
export default AdminPage;
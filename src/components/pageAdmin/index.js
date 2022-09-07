import React from 'react';
import { Outlet, Navigate } from 'react-router-dom';

import useAuth from '../../hooks/useAuth';



const AdminPage = function (errorType = null) {

    const {currentUser} = useAuth();
    if (!currentUser || !currentUser.admin) return <Navigate to="/" />;

    return (
        <>  
        <div class="admin-page-container wrapper">
            <nav id="sidebar" class="">

                <ul class="list-unstyled components">
                    <p></p>
                    <li class="active">
                        <a href="#homeSubmenu" data-toggle="collapse" aria-expanded="false" class="dropdown-toggle">Administrar productos</a>
                        <ul class="collapse list-unstyled" id="homeSubmenu" wfd-invisible="true">
                            <li>
                                <a href="/admin/products" class="admin-page-submenu">Productos</a>
                            </li>
                            <li>
                                <a href="/admin/categories" class="admin-page-submenu">Categorías</a>
                            </li>
                            <li>
                                <a href="/admin/promotions" class="admin-page-submenu">Promociones</a>
                            </li>

                            <li>
                                <a href="/admin/removedProducts" class="admin-page-submenu">Productos Eliminados</a>
                            </li>
                        </ul>
                    </li>
                    <li>
                        <a href="/admin/areas">Regiones y Comunas</a>
                    </li>
                    <li>
                        <a href="#pageSubmenu" data-toggle="collapse" aria-expanded="false" class="dropdown-toggle">Pages</a>
                        <ul class="collapse list-unstyled" id="pageSubmenu" wfd-invisible="true">
                            <li>
                                <a href="#">Page 1</a>
                            </li>
                            <li>
                                <a href="#">Page 2</a>
                            </li>
                            <li>
                                <a href="#">Page 3</a>
                            </li>
                        </ul>
                    </li>
                    <li>
                        <a href="#">Portfolio</a>
                    </li>
                    <li>
                        <a href="#">Contact</a>
                    </li>
                </ul>

            </nav>
            <Outlet/>
        </div>
        </>
    );
}
export default AdminPage;
import React, {useEffect, useState} from 'react';
import  useAuth  from '../../hooks/useAuth';


function toggleCart(){
    document.querySelector('.sidecart').classList.toggle('open-cart');
}
function toggleMobile(e){
    const el = document.querySelector('.mobile-nav-toggle');
    document.getElementById('navbar').classList.toggle('navbar-mobile')
    el.classList.toggle('bi-list')
    el.classList.toggle('bi-x')
}
function toggleDropDown(e, id){
    const el = document.getElementById(id);
    if (document.querySelector('#navbar').classList.contains('navbar-mobile')) {
        e.preventDefault()
        el.nextElementSibling.classList.toggle('dropdown-active')
    }
}


const Header = function() {
    const { currentUser, handleUserLogout } = useAuth();

    return (
        <div>

        <header id="header" class="fixed-top d-flex align-items-cente">
            <div class="container-fluid container-xl d-flex align-items-center justify-content-lg-between">

            <h1 class="logo me-auto me-lg-0"><a href="/">Restaurantly</a></h1>
            <nav id="navbar" class="navbar order-last order-lg-0">
                <ul>
                    <li><a class="nav-link scrollto active" href="/#hero">Inicio</a></li>
                    <li><a class="nav-link scrollto" href="/#about">Sobre nosotros</a></li>
                    <li><a class="nav-link scrollto" href="/#menu">Menú</a></li>
                    <li><a class="nav-link scrollto" href="/#gallery">Galería</a></li>
                    <li><a class="nav-link scrollto" href="/#contact">Contacto</a></li>
                    {currentUser ? (
                            <li class="dropdown"><a id="accountDropdown" href="#" onClick={(e) => toggleDropDown(e, 'accountDropdown')}><span>Cuenta</span> <i class="bi bi-chevron-down"></i></a>
                                <ul>
                                    <li><a class="nav-link" href="/account">Administrar cuenta</a></li>
                                    {currentUser.admin &&
                                        <li><a class="nav-link" href="/admin">Administrar página</a></li>
                                    }
                                    <li><a class="nav-link" onClick={handleUserLogout}>Cerrar sesión</a></li>
                                </ul>
                            </li>
                    ) : (
                        <li><a class="nav-link scrollto" href="/login">Iniciar Sesión</a></li>
                    )}
                </ul>
                <i class="bi bi-list mobile-nav-toggle" onClick={toggleMobile}></i>
            </nav>
            {currentUser &&
                <a onClick={toggleCart} class="book-a-table-btn scrollto d-lg-flex">Carrito</a>
            }

            </div>
        </header>
        </div>
    );
}
export default Header;
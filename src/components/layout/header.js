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

const select = (el, all = false) => {
    el = el.trim()
    if (all) {
      return [...document.querySelectorAll(el)]
    } else {
      return document.querySelector(el)
    }
  }

  /**
   * Easy event listener function
   */
  const on = (type, el, listener, all = false) => {
    let selectEl = select(el, all)
    if (selectEl) {
      if (all) {
        selectEl.forEach(e => e.addEventListener(type, listener))
      } else {
        selectEl.addEventListener(type, listener)
      }
    }
  }

  const scrollto = (el) => {
    let header = select('#header')
    let offset = header.offsetHeight

    let elementPos = select(el).offsetTop

    window.scrollTo({
      top: elementPos - offset,
      behavior: 'smooth'
    })
  }

const Header = function({cart}) {
    const { currentUser, handleUserLogout } = useAuth();

    useEffect(() => {
        on('click', '.scrollto', function(e) {
            if (select(this.hash)) {
              e.preventDefault()

              let navbar = select('#navbar')
              if (navbar.classList.contains('navbar-mobile')) {
                navbar.classList.remove('navbar-mobile')
                let navbarToggle = select('.mobile-nav-toggle')
                navbarToggle.classList.toggle('bi-list')
                navbarToggle.classList.toggle('bi-x')
              }
              scrollto(this.hash)
            }
          }, true)
    },[]);

    return (
        <div>

        <header id="header" class="fixed-top d-flex align-items-cente">
            <div class="container-fluid container-xl d-flex align-items-center justify-content-lg-between">

            <h1 class="logo me-auto me-lg-0"><a href="/">Restaurantly</a></h1>
            <nav id="navbar" class="navbar order-last order-lg-0">
                <ul>
                    <li><a class="nav-link scrollto active" href="/#hero">Inicio</a></li>
                    <li><a class="nav-link scrollto" href="/#about">Sobre nosotros</a></li>
                    <li><a class="nav-link scrollto" href="/#menu">Men??</a></li>
                    <li><a class="nav-link scrollto" href="/#gallery">Galer??a</a></li>
                    <li><a class="nav-link scrollto" href="/#contact">Contacto</a></li>
                    {currentUser ? (
                            <li class="dropdown"><a id="accountDropdown" href="#" onClick={(e) => toggleDropDown(e, 'accountDropdown')}><span>Cuenta</span> <i class="bi bi-chevron-down"></i></a>
                                <ul>
                                    <li><a class="nav-link" href="/account">Administrar cuenta</a></li>
                                    {currentUser.admin &&
                                        <li><a class="nav-link" href="/admin">Administrar p??gina</a></li>
                                    }
                                    <li><a class="nav-link" onClick={handleUserLogout}>Cerrar sesi??n</a></li>
                                </ul>
                            </li>
                    ) : (
                        <li><a class="nav-link scrollto" href="/login">Iniciar Sesi??n</a></li>
                    )}
                </ul>
                <i class="bi bi-list mobile-nav-toggle" onClick={toggleMobile}></i>
            </nav>
            {currentUser &&
                <a onClick={toggleCart} class="book-a-table-btn scrollto d-lg-flex">{cart.length == 0 && 'Carro'}<span class="header-cart-btn">{cart.length > 0 && 'Carro -\u00A0'}</span> {cart.length > 0 && cart.reduce((a,b) => a+b.quantity || 0, 0)}</a>
            }

            </div>
        </header>
        </div>
    );
}
export default Header;
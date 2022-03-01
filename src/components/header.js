import React, {Component} from 'react';

function toggleCart(){
    document.querySelector('.sidecart').classList.toggle('open-cart');
}
function toggleMobile(){
    document.getElementById('navbar').classList.toggle('navbar-mobile')
    this.classList.toggle('bi-list')
    this.classList.toggle('bi-x')
}

class Header extends Component {
    render() {
        return (
            <div>

            <header id="header" class="fixed-top d-flex align-items-cente">
                <div class="container-fluid container-xl d-flex align-items-center justify-content-lg-between">

                <h1 class="logo me-auto me-lg-0"><a href="index.html">Restaurantly</a></h1>
                <nav id="navbar" class="navbar order-last order-lg-0">
                    <ul>
                    <li><a class="nav-link scrollto active" href="#hero">Inicio</a></li>
                    <li><a class="nav-link scrollto" href="#about">Sobre nosotros</a></li>
                    <li><a class="nav-link scrollto" href="#menu">Menú</a></li>
                    <li><a class="nav-link scrollto" href="#specials">Especialidades</a></li>
                    <li><a class="nav-link scrollto" href="#events">Eventos</a></li>
                    <li><a class="nav-link scrollto" href="#chefs">Chefs</a></li>
                    <li><a class="nav-link scrollto" href="#gallery">Galería</a></li>
                    <li class="dropdown"><a href="#"><span>Drop Down</span> <i class="bi bi-chevron-down"></i></a>
                        <ul>
                        <li><a href="#">Drop Down 1</a></li>
                        <li class="dropdown"><a href="#"><span>Deep Drop Down</span> <i class="bi bi-chevron-right"></i></a>
                            <ul>
                            <li><a href="#">Deep Drop Down 1</a></li>
                            <li><a href="#">Deep Drop Down 2</a></li>
                            <li><a href="#">Deep Drop Down 3</a></li>
                            <li><a href="#">Deep Drop Down 4</a></li>
                            <li><a href="#">Deep Drop Down 5</a></li>
                            </ul>
                        </li>
                        <li><a href="#">Drop Down 2</a></li>
                        <li><a href="#">Drop Down 3</a></li>
                        <li><a href="#">Drop Down 4</a></li>
                        </ul>
                    </li>
                    <li><a class="nav-link scrollto" href="#contact">Contacto</a></li>
                    </ul>
                    <i class="bi bi-list mobile-nav-toggle" onClick={toggleMobile}></i>
                </nav>
		        <a onClick={toggleCart} class="book-a-table-btn scrollto d-lg-flex" href='#'>Carrito</a>

                </div>
            </header>
            </div>
        );
    }
} export default Header;
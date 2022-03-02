import React, { Component } from 'react';

class Cart extends Component {
    render() {
        return (
            <div class="sidecart d-flex align-items-center flex-column">
                <h2 class="cd-cart-h2">Cart</h2>
                <ul class="cd-cart-items">
                    <div class="row border-top border-bottom padding-top padding-bottom cart-item">
                        <div class="row main align-items-center">
                            <div class="col-2"><img class="img-fluid" src="https://i.imgur.com/1GrakTl.jpg"></img></div>
                            <div class="col">
                                <div class="row text-muted">Shirt</div>
                                <div class="row">Cotton T-shirt</div>
                            </div>
                            <div class="col"> <a class="cart-signs" href="#">-</a><a class="cart-signs">1</a><a class="cart-signs" href="#">+</a> </div>
                            <div class="col">&euro; 44.00 <a class="close" href="#">&#10005;</a></div>
                        </div>
                    </div>
                </ul>

                <div class="cd-cart-total">
                    <p>Total: <span>$39.96</span></p>
                </div>

                <a href="#0" class="checkout-btn">Checkout</a>
                
            </div>
        );
    }
} export default Cart;
import React, { Component } from 'react';

class Cart extends Component {
    render() {
        return (
            <div class="sidecart">
                <h2 class="cd-cart-h2">Cart</h2>
                <ul class="cd-cart-items">
                    {/* <li class="cd-cart-item">
                        <span class="cd-qty">1x</span> Product Name
                        <div class="cd-price">$9.99</div>
                        <a href="#0" class="cd-cart-link cd-item-remove cd-img-replace">Remove</a>
                    </li>

                    <li class="cd-cart-item">
                        <span class="cd-qty">2x</span> Product Name
                        <div class="cd-price">$19.98</div>
                        <a href="#0" class="cd-cart-link cd-item-remove cd-img-replace">Remove</a>
                    </li>

                    <li class="cd-cart-item">
                        <span class="cd-qty">1x</span> Product Name
                        <div class="cd-price">$9.99</div>
                        <a href="#0" class="cd-cart-link cd-item-remove cd-img-replace">Remove</a>
                    </li> */}
                    <div class="row border-top border-bottom padding-top padding-bottom cart-item">
                        <div class="row main align-items-center">
                            <div class="col-2"><img class="img-fluid" src="https://i.imgur.com/1GrakTl.jpg">Product image</img></div>
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
                    <p>Total <span>$39.96</span></p>
                </div>

                <a href="#0" class="checkout-btn">Checkout</a>
                
                <p class="cd-go-to-cart"><a href="#0">Go to cart page</a></p>
            </div>
        );
    }
} export default Cart;
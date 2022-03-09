import React, { useEffect, useState } from 'react';
import useAuth from '../../hooks/useAuth';


const Cart = function({cart, setCart}) {
    
    const {currentUser} = useAuth();

    const handleDeleteItem = async function(id) {
        const requestOptions = {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': currentUser.token_type + ' ' + currentUser.access_token
            },
        };
        fetch(`${process.env.REACT_APP_API_URL}/orders/${id}`, requestOptions)
            .then((response) => {
                if (!response.ok) {
                    console.log("Error al verificar el usuario");
                    console.log(response);
                    throw response;
                }
                response.json().then((cart) => {
                    setCart(cart);
                });
            })
            .catch((error) => {
                console.log(error);
            });
    }

    const handleAddItem = async function handleAddItem(product, num) {
        const requestOptions = {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': currentUser.token_type + ' ' + currentUser.access_token
            },
            body: JSON.stringify({
                productId: product.product.id,
                quantity: product.quantity + num
            }),
        };
        try {   
            const response = await fetch(`${process.env.REACT_APP_API_URL}/orders/${product.id}`, requestOptions);
            if (!response.ok) {
                const error = await response.json();
                throw error;
            }
            setCart(await response.json());
        } catch (error) {
            console.log(error);
        }
    };

    // Get cart from api call
    useEffect(() => {
        if (currentUser) {
            const requestOptions = {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': currentUser.token_type + ' ' + currentUser.access_token
                },
            };
            fetch(`${process.env.REACT_APP_API_URL}/orders`, requestOptions)
            .then((response) => {
                if (!response.ok) {
                    console.log("Error al verificar el usuario");
                    console.log(response);
                    throw response;
                }
                response.json().then((cart) => {
                    setCart(cart);
                });
            })
            .catch((error) => {
                console.log(error);
            });
        }
    }, []);

    return (
        <div class="sidecart d-flex align-items-center flex-column">
            {currentUser && 
                <>
                <h2 class="cd-cart-h2">Carro</h2>
                <ul class="cd-cart-items">
                    {cart.sort((a, b) => Date.parse( a.createdAt) - Date.parse(b.createdAt)).map((item) => (
                        <div key={item.id} class="row border-top border-bottom padding-top padding-bottom cart-item">
                            <div class="row main align-items-center ">
                                <div class="col-2"><img class="img-fluid cart-item-image" src={item.product.image}></img></div>
                                <div class="col">
                                    <div class="row">{item.product.name}</div>
                                </div>

                                <div id="desktop-view-cart-quantity" class="col d-flex align-items-center">
                                    <div class="d-flex align-items-center justify-content-center"> <a onClick={() => handleAddItem(item, -1)} class="cart-signs" >-</a>&emsp;<span class="align-middle">{item.quantity}</span> &emsp;<a onClick={() => handleAddItem(item, 1)} class="cart-signs" >+</a> </div>
                                </div>
                                
                                <div class="col d-flex align-items-center">
                                    <div >${item.product.price.toLocaleString()}</div> 
                                </div>
                                <div class="col d-flex align-items-end">
                                    <i class="element-pointer bi-x ml-auto cart-page-cross" onClick={() => handleDeleteItem(item.id)}></i>
                                </div>
                            </div>
                            <div id="mobile-view-cart-quantity" class="row d-flex align-items-center">
                                <div class="d-flex align-items-center justify-content-center"> <a onClick={() => handleAddItem(item, -1)} class="cart-signs" >-</a>&emsp;<span class="align-middle">{item.quantity}</span> &emsp;<a onClick={() => handleAddItem(item, 1)} class="cart-signs" >+</a> </div>
                            </div>
                        </div>
                    ))}
                </ul>

                <div class="cd-cart-total">
                    <p>Total: <span>${cart.reduce((a, b) => a + b.product.price*b.quantity || 0, 0).toLocaleString()}</span></p>
                </div>

                <a href="#" class="checkout-btn  mr-0">Comprar</a>
                </>
            }
        </div>
    );
    
} 
export default Cart;
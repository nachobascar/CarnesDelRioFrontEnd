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
        fetch(`${process.env.REACT_APP_API_URL}/cart/${id}`, requestOptions)
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
            const response = await fetch(`${process.env.REACT_APP_API_URL}/cart/${product.id}`, requestOptions);
            if (!response.ok) {
                // Timer para que se vea el error
                
                if (!document.getElementById('cart-stock-error').classList.contains('fadeIn')) {
                    document.getElementById('cart-stock-error').classList.toggle('fadeIn');
                } else {
                    document.getElementById('cart-stock-error').classList.toggle('fadeIn');
                    document.getElementById('cart-stock-error').classList.toggle('fadeIn');
                }
                setTimeout(() => {
                    if (document.getElementById('cart-stock-error').classList.contains('fadeIn')) {
                        document.getElementById('cart-stock-error').classList.toggle('fadeIn');
                    }
                }, 2000);

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
            fetch(`${process.env.REACT_APP_API_URL}/cart`, requestOptions)
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
        <div className="sidecart d-flex align-items-center flex-column">
            {currentUser && 
                <>
                <h2 className="cd-cart-h2">Carro</h2>
                <p id="cart-stock-error" className="cd-cart-error text-danger opacity-0">Máximo stock alcanzado</p>
                <ul className="cd-cart-items">
                    {cart.sort((a, b) => Date.parse( a.createdAt) - Date.parse(b.createdAt)).map((item) => (
                        <div key={item.id} className="row border-top border-bottom padding-top padding-bottom cart-item">
                            <div className="row main align-items-center ">
                                <div className="col-2"><img className="img-fluid cart-item-image" src={item.product.image}></img></div>
                                <div className="col">
                                    <div className="row">{item.product.name}</div>
                                </div>

                                <div id="desktop-view-cart-quantity" className="col d-flex align-items-center">
                                    <div className="d-flex align-items-center justify-content-center"> <a onClick={() => handleAddItem(item, -1)} className="cart-signs" >-</a>&emsp;<span className="align-middle">{item.quantity}</span> &emsp;<a onClick={() => handleAddItem(item, 1)} className="cart-signs" >+</a> </div>
                                </div>
                                
                                <div className="col d-flex align-items-center">
                                    <div >${item.product.price.toLocaleString()}</div> 
                                </div>
                                <div className="col d-flex align-items-end">
                                    <i className="element-pointer bi-x ml-auto cart-page-cross" onClick={() => handleDeleteItem(item.id)}></i>
                                </div>
                            </div>
                            <div id="mobile-view-cart-quantity" className="row d-flex align-items-center">
                                <div className="d-flex align-items-center justify-content-center"> <a onClick={() => handleAddItem(item, -1)} className="cart-signs" >-</a>&emsp;<span className="align-middle">{item.quantity}</span> &emsp;<a onClick={() => handleAddItem(item, 1)} className="cart-signs" >+</a> </div>
                            </div>
                        </div>
                    ))}
                </ul>

                <div className="cd-cart-total">
                    <p>Total: <span>${cart.reduce((a, b) => a + b.product.price*b.quantity || 0, 0).toLocaleString()}</span></p>
                </div>

                <a href="#" className="checkout-btn  mr-0">Comprar</a>
                </>
            }
        </div>
    );
    
} 
export default Cart;
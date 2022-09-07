import React, {useEffect, useState} from "react";
import useAuth from "../../hooks/useAuth";


const ProductList = function () {
    const [products, setProducts] = useState([]);

    const {currentUser} = useAuth();

    const handleRecover = async function handleRecover(id) {
        const requestOptions = {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': currentUser.token_type + ' ' + currentUser.access_token
            },
        };
        try {
            const response = await fetch(`${process.env.REACT_APP_API_URL}/products/${id}/recover`, requestOptions);
            if (!response.ok) {
                const error = await response.json();
                throw error;
            }
            location.reload();
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        const requestOptions = {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': currentUser.token_type + ' ' + currentUser.access_token
            },
        };
        fetch(`${process.env.REACT_APP_API_URL}/products/unvalid`, requestOptions)
            .then((response) => {
                if (!response.ok) {
                    console.log("Error al verificar el usuario");
                    console.log(response);
                    throw response;
                }
                response.json().then((products) => {
                    setProducts(products.sort((a, b) => Date.parse( a.createdAt) - Date.parse(b.createdAt)));
                });
            })
            .catch((error) => {
                console.log(error);
            });
    }, []);

    return (
        <div className="admin-page-list">
            <ul>
                {products.length ?
                    products.map((product) => (
                        <li key={product.id}>
                            <div className="admin-page-list-item d-flex flex-row">
                                <div className="admin-page-list-item-image d-flex align-self-center">
                                    <img src={product.image} className="admin-page-img" />
                                </div>
                                <div className="admin-page-list-item-info d-flex flex-row">
                                    <div className="d-flex flex-column admin-page-list-item-description">
                                        <h3>{product.name}</h3>
                                        <p>{product.description}</p>
                                    </div>
                                    <div className="d-flex flex-md-column align-self-center">
                                        <p className="admin-page-item-price">${product.price.toLocaleString()}</p>
                                    </div>
                                </div>
                                <div className="admin-page-list-item-actions d-flex flex-column ml-auto align-self-center">
                                    <a onClick={() => handleRecover(product.id)} className="admin-page-list-item-btn book-a-table-btn">Recuperar</a>
                                </div>
                            </div>
                        </li>
                )) : 
                <div className="admin-page-list-item d-flex flex-row">
                    <div className="admin-page-list-item-info d-flex flex-row">
                        <div className="d-flex flex-column admin-page-list-item-description">
                            <h3>No hay productos eliminados</h3>
                        </div>
                    </div>
                </div>
            }
            </ul>
        </div>
    )
}
export default ProductList;
import React from "react";
import useAuth from "../../hooks/useAuth";


const ProductList = function ({products}) {
    const {currentUser} = useAuth();

    const handleRemove = async function handleRemove(id) {
        const requestOptions = {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': currentUser.token_type + ' ' + currentUser.access_token
            },
        };
        try {
            const response = await fetch(`${process.env.REACT_APP_API_URL}/products/${id}`, requestOptions);
            if (!response.ok) {
                const error = await response.json();
                throw error;
            }
            location.reload();
        } catch (error) {
            console.log(error);
        }
    };

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
                                            <a href={`/admin/products/${product.id}`} className="admin-page-list-item-btn book-a-table-btn">Editar</a>
                                            <a href={`#`} onClick={() => {handleRemove(product.id)}} className="admin-page-list-item-btn book-a-table-btn">Eliminar</a>
                                        </div>
                                    </div>
                                </li>
                            )) : 
                            <div className="admin-page-list-item d-flex flex-row">
                                <div className="admin-page-list-item-info d-flex flex-row">
                                    <div className="d-flex flex-column admin-page-list-item-description">
                                        <h3>No hay productos</h3>
                                    </div>
                                </div>
                            </div>
                        }
                    </ul>
                </div>
    )
}
export default ProductList;
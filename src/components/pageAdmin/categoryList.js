import React from "react";
import useAuth from "../../hooks/useAuth";


const CategoryList = function ({categories}) {
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
            const response = await fetch(`${process.env.REACT_APP_API_URL}/categories/${id}`, requestOptions);
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
                {categories.length ? 
                    categories.map((category) => (
                        <li key={category.id}>
                            <div className="admin-page-list-item d-flex flex-row">
                                <div className="admin-page-list-item-info d-flex flex-row">
                                    <div className="d-flex flex-column admin-page-list-item-description">
                                        <h3>{category.name}</h3>
                                        <p>{category.description}</p>
                                    </div>
                                </div>
                                <div className="admin-page-list-item-actions d-flex flex-column ml-auto align-self-center">
                                    <a href={`/admin/categories/${category.id}`} className="admin-page-list-item-btn book-a-table-btn">Editar</a>
                                    <a href={`#`} onClick={() => {handleRemove(category.id)}} className="admin-page-list-item-btn book-a-table-btn">Eliminar</a>
                                </div>
                            </div>
                        </li>
                    )) :
                    <div className="admin-page-list-item d-flex flex-row">
                        <div className="admin-page-list-item-info d-flex flex-row">
                            <div className="d-flex flex-column admin-page-list-item-description">
                                <h3>No hay categorías</h3>
                            </div>
                        </div>
                    </div>
                }
            </ul>
        </div>
    )
}
export default CategoryList;
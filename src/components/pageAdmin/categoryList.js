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
        <div class="admin-page-list">
            <ul>
                {categories.map((category) => (
                    <li key={category.id}>
                        <div class="admin-page-list-item d-flex flex-row">
                            <div class="admin-page-list-item-info d-flex flex-row">
                                <div class="d-flex flex-column admin-page-list-item-description">
                                    <h3>{category.name}</h3>
                                    <p>{category.description}</p>
                                </div>
                            </div>
                            <div class="admin-page-list-item-actions d-flex flex-column ml-auto align-self-center">
                                <a href={`/admin/categories/${category.id}`} class="admin-page-list-item-btn book-a-table-btn">Editar</a>
                                <a href={`#`} onClick={() => {handleRemove(category.id)}} class="admin-page-list-item-btn book-a-table-btn">Eliminar</a>
                            </div>
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    )
}
export default CategoryList;
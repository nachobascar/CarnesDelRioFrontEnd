import React, { Component, useState, useEffect } from 'react';
import { Navigate, useNavigate  } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';



const UserPage = function (errorType = null) {
    const { currentUser, handleUserLogout } = useAuth();

    const [user, setUser] = useState('');

    const navigate = useNavigate();

    if (!currentUser) return <Navigate to="/" />;

    const handleRemoveUser = function handleRemoveUser(event) {
        event.preventDefault();
        if (confirm('¿Está seguro que desea eliminar su cuenta?')) {
            const requestOptions = {
                method: 'DELETE',
                headers: { 
                    'Content-Type': 'application/json',
                    'Authorization': currentUser.token_type + ' ' + currentUser.access_token,  
                },
            };
            try {
                fetch(`${process.env.REACT_APP_API_URL}/users/${currentUser.id}`, requestOptions).then((response) => {
                    if (!response.ok) {
                        response.text().then((error) => {
                            throw new Error(error);
                        });
                    }
                    navigate('/logout');
                });
            } catch (error) {
                console.log(error);
            }
        }
    };

    // Get user info
    useEffect(() => {
        const requestOptions = {
            headers: { 
                'Content-Type': 'application/json',
                'Authorization': currentUser.token_type + ' ' + currentUser.access_token, 
             },
        };
        fetch(`${process.env.REACT_APP_API_URL}/users/${currentUser.id}`, requestOptions)
          .then((response) => {
            if (!response.ok) {
                console.log("Error al verificar el usuario");
                console.log(response);
                throw response;
            }
            response.json().then((user) => {
                setUser(user);
            });                
          })
          .catch( (error) => {
              console.log(error);
          });
          
      }, []);

    return (
        <div class="container">
            <div class="d-flex justify-content-center h-100">
                <div class="card">
                    <div class="card-header ">
                        <h3 class="user-profile-title">Usuario</h3>
                    </div>
                    <div class="card-body ">
                        <div class="d-flex links">
                            <p>Email: {user.email}</p>
                        </div>
                        <div class="d-flex links">
                            <p>Teléfono: {user.phone}</p>
                            <a href="/changePhone">Modificar</a>
                        </div>
                        <br/>
                        <a class="book-a-table-btn" href="/changePassword">Cambiar contraseña</a>
                    </div>
                    <div class="card-footer">
                        <div class="d-flex justify-content-center links">
                            ¿No está satisfecho?<a onClick={handleRemoveUser} href="#">Eliminar cuenta</a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );

}
export default UserPage;
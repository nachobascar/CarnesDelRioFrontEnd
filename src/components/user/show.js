import React, { Component, useState, useEffect } from 'react';
import { Navigate  } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';



const UserPage = function (errorType = null) {
    const { currentUser } = useAuth();

    const [user, setUser] = useState('');

    if (!currentUser) return <Navigate to="/" />;

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
                            <a href="/changePassword">Modificar</a>
                        </div>
                        <br/>
                        <a class="book-a-table-btn" href="/changePassword">Cambiar contraseña</a>
                    </div>
                    <div class="card-footer">
                        <div class="d-flex justify-content-center links">
                            ¿No está satisfecho?<a href="/deleteAccount">Eliminar cuenta</a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );

}
export default UserPage;
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

    const handleRemoveAddress = function handleRemoveAddress(addressId) {
        if (confirm('¿Está seguro que desea eliminar esta dirección?')) {
            const requestOptions = {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': currentUser.token_type + ' ' + currentUser.access_token,
                },
            };
            try {
                fetch(`${process.env.REACT_APP_API_URL}/addresses/${addressId}`, requestOptions).then((response) => {
                    if (!response.ok) {
                        response.text().then((error) => {
                            throw new Error(error);
                        });
                    }
                    const newAddresses = user.addresses.filter((address) => address.id !== addressId);
                    setUser({ ...user, addresses: newAddresses });
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
        <div className="container user-show-container position-static login-page">
            <div className="d-flex justify-content-center h-100 position-static">
                <div className="card position-static">
                    <div className="card-header ">
                        <h3 className="user-profile-title">Usuario</h3>
                    </div>
                    <div className="card-body ">
                        <div className="d-flex links">
                            <p>Email: {user.email}</p>
                        </div>
                        <div className="d-flex links justify-content-between ">
                            <p>Teléfono: {user.phone}</p>
                            <a href="/changePhone">Modificar</a>
                        </div>
                        <br/>
                        <div className="d-flex links justify-content-between align-items-center">
                            <h3>Direcciones:</h3>
                            <a className='book-a-table-btn text-center d-block' href="/newAddress">Nueva Dirección</a>
                            <br/><br/><br/>
                        </div>
                        {user.addresses && user.addresses.length ? 
                            <ul className="list-group ">
                                {user.addresses.map((address) => (
                                    <li key={address.id} className="user-addresses list-group-item ">
                                        <div className="d-flex links justify-content-between">
                                            {address.nombre && <p className=".text-dark">{address.nombre}</p>}
                                            <a href={`/newAddress?id=${address.id}`}>Editar</a>
                                        </div>
                                        <div className="d-flex links justify-content-between">
                                            <p className=".text-dark">{address.calleNum}</p>
                                            <a href="#" onClick={() => handleRemoveAddress(address.id)} >Eliminar</a>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                            : <p className="text-center w-100">No tiene direcciones</p>
                        }
                        <br/>
                        <a className="book-a-table-btn text-center d-block" href="/changePassword">Cambiar contraseña</a>
                    </div>
                    <div className="card-footer">
                        <div className="d-flex justify-content-center links">
                            ¿No está satisfecho?<a onClick={handleRemoveUser} href="#">Eliminar cuenta</a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );

}
export default UserPage;
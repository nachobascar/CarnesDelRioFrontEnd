import React, { useEffect, useState } from 'react';
import { Navigate, useSearchParams  } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';



const UserVerification = function (errorType = null) {
    
    const { currentUser } = useAuth();
    const [loading, setLoading] = useState(false);
    const [page, setPage] = useState('');

    const [searchParams, setSearchParams] = useSearchParams();

    useEffect(() => {
        setLoading(true);
        fetch(`${process.env.REACT_APP_API_URL}/users/verification?token=${searchParams.get('token')}`)
          .then((response) => {
            if (!response.ok) {
                console.log("Error al verificar el usuario");
                console.log(response);
                throw response;
            }

            setPage(
                <div class="container login-page">
                    <div class="d-flex justify-content-center h-100">
                        <div class="card">
                            <div class="card-header">
                                <h3>Usuario verificado</h3>
                            </div>
                            <div class="card-body">
                                <p>El usuario ha sido verificado correctamente</p>
                                <br/><br/>
                                <div class="d-flex justify-content-center links">
                                    <a href="login" class="book-a-table-btn">Iniciar sesión</a>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            );
          })
          .catch( (error) => {
            setPage(
                <div class="container">
                    <div class="d-flex justify-content-center h-100">
                        <div class="card">
                            <div class="card-header">
                                <h3>Error al verificar el usuario</h3>
                            </div>
                            <div class="card-body">
                                <p>{error.message}</p>
                            </div>
                        </div>
                    </div>
                </div>
            );
          })
          .finally( () => {
              setLoading(false);
            });
          
      }, []);

    if (loading) {
        return <h1>Loading...</h1>;
    }

    return page;

}
export default UserVerification;
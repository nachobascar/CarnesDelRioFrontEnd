import React, { useEffect, useState } from 'react';
import { Navigate, useSearchParams  } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';



const UserVerification = function ({isLoading}) {
    
    const { currentUser } = useAuth();
    const [page, setPage] = useState('');

    const [searchParams, setSearchParams] = useSearchParams();

    useEffect(() => {
        isLoading(true);
        fetch(`${process.env.REACT_APP_API_URL}/users/verification?token=${searchParams.get('token')}`)
          .then((response) => {
            if (!response.ok) {
                console.log("Error al verificar el usuario");
                console.log(response);
                throw response;
            }

            setPage(
                <div className="container login-page">
                    <div className="d-flex justify-content-center h-100">
                        <div className="card">
                            <div className="card-header">
                                <h3>Usuario verificado</h3>
                            </div>
                            <div className="card-body">
                                <p>El usuario ha sido verificado correctamente</p>
                                <br/><br/>
                                <div className="d-flex justify-content-center links">
                                    <a href="login" className="book-a-table-btn">Iniciar sesión</a>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            );
          })
          .catch( (error) => {
            setPage(
                <div className="container">
                    <div className="d-flex justify-content-center h-100">
                        <div className="card">
                            <div className="card-header">
                                <h3>Error al verificar el usuario</h3>
                            </div>
                            <div className="card-body">
                                <p>{error.message}</p>
                            </div>
                        </div>
                    </div>
                </div>
            );
          })
          .finally( () => {
            isLoading(false);
            });
          
      }, []);

    return page;

}
export default UserVerification;
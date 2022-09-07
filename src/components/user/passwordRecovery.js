import React, { useEffect, useState } from 'react';
import { Navigate, useSearchParams, useNavigate  } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';
import useLocalStorage from '../../hooks/useLocalStorage';

import {Formik, Form, Field} from 'formik';
import * as Yup from 'yup';

const initialValues = {
    password: '',
    confirmation: '',
};

const validationSchema = Yup.object().shape({
    phone: Yup.string()
        .min(12, 'El número debe ser de la forma +569xxxxxxxx')
        .max(12, 'El número debe ser de la forma +569xxxxxxxx')
        .matches(/\x2b56[0-9]+/, 'El número debe ser de la forma +56xxxxxxxxx')
        .required('Número de teléfono es requerido'),
    confirmation: Yup.string()
      .oneOf([Yup.ref('password'), null], 'Las contraseñas no coinciden')
      .required('Confirmación de contraseña es requerida')
  });


const UserPasswordRecovery = function ({isLoading}) {
    
    const [page, setPage] = useState('');

    const [userToken, storeUserToken, clearUserToken] = useLocalStorage('userToken');
    
    const [searchParams, setSearchParams] = useSearchParams();
    const navigate = useNavigate();

    useEffect(() => {
        isLoading(true);
        const verificationToken = searchParams.get('token');
        fetch(`${process.env.REACT_APP_API_URL}/users/passwordRecovery/validate?token=${verificationToken}`)
          .then((response) => {
            if (!response.ok) {
                console.log("Error al verificar el usuario");
                console.log(response);
                throw response;
            }
            response.json().then((data) => {
                data.verificationToken = verificationToken;
                storeUserToken(data);
                navigate('/confirmNewPassword');
            });                
          })
          .catch( (error) => {
            setPage(
                <div className="container login-page">
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
export default UserPasswordRecovery;
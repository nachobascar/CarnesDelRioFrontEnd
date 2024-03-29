import React, { useEffect, useState } from 'react';
import { Navigate, useSearchParams, useNavigate, useParams  } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';
import useLocalStorage from '../../hooks/useLocalStorage';

import {Formik, Form, Field} from 'formik';
import * as Yup from 'yup';

const initialValues = {
    password: '',
    confirmation: '',
};

const validationSchema = Yup.object().shape({
    password: Yup.string()
      .min(8, 'La contraseña debe tener al menos 8 carácteres')
      .matches(/\d/, 'La contraseña debe tener al menos un número')
      .matches(/[A-Z]/, 'La contraseña debe tener al menos una letra mayúscula')
      .required('Contraseña es requerida'),
    confirmation: Yup.string()
      .oneOf([Yup.ref('password'), null], 'Las contraseñas no coinciden')
      .required('Confirmación de contraseña es requerida')
  });


const UserConfirmNewPassword = function ({isLoading}) {
    
    const { currentUser } = useAuth();
    const [page, setPage] = useState('');
    const [errors, setErrorMessage] = useState('');
    
    const navigate = useNavigate();
    
    const [userToken, storeUserToken, clearUserToken] = useLocalStorage('userToken');
    
    const [searchParams, setSearchParams] = useSearchParams();
    
    const handleSubmit = async function handleSubmit(values) {
        console.log("values: ", values);
        isLoading(true);
        values.verificationToken = userToken.verificationToken;
        const requestOptions = {
            method: 'PUT',
            headers: { 
                'Content-Type': 'application/json',
                'Authorization': userToken.token_type + ' ' + userToken.access_token, 
             },
            body: JSON.stringify(values),
        };
        try {
            const response = await fetch(`${process.env.REACT_APP_API_URL}/users/${userToken.userId}`, requestOptions);
            if (!response.ok) {
                const error = await response.json();
                throw error;
            }
            navigate('/login');
        } catch (error) {
            console.log(error);
            setErrorMessage(error);
        } finally {
            clearUserToken();
            isLoading(false);
        }
    };

    return (
        <div className="container login-page">
            <div className="d-flex justify-content-center h-100">
                <div className="card">
                    <div className="card-header">
                        <h3>Cambiar contraseña</h3>
                        {errors && <p>{errors.message}</p>}
                    </div>
                    <div className="card-body margin-top">
                        <Formik
                            initialValues={initialValues}
                            onSubmit={handleSubmit}
                            validationSchema={validationSchema}
                        >   
                        {({ errors, touched }) => (
                            <Form>
                                {(errors.password && touched.password) && (
                                    <div className="bottom-margin">{errors.password}</div>
                                )}
                                <div className="input-group form-group">
                                    <div className="input-group-prepend">
                                        <span className="input-group-text"><i className="fas fa-key"></i></span>
                                    </div>
                                    <Field type="password" className="form-control" placeholder="Nueva contraseña" name="password" id="password" required/>
                                </div>
                                {(errors.confirmation && touched.confirmation) && (
                                    <div className="bottom-margin">{errors.confirmation}</div>
                                )}
                                <div className="input-group form-group">
                                    <div className="input-group-prepend">
                                        <span className="input-group-text"><i className="fas fa-key"></i></span>
                                    </div>
                                    <Field type="password" className="form-control" placeholder="Confirme contraseña" name="confirmation" id="confirmation" required/>
                                </div>
                                <div className="form-group">
                                    <input type="submit" value="Confirmar" className="btn float-right login_btn"/>
                                </div>
                            </Form>
                        )}
                        </Formik>
                    </div>
                </div>
            </div>
        </div>
    );
}
export default UserConfirmNewPassword;
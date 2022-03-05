import React, { useEffect, useState } from 'react';
import { Navigate, useSearchParams, useNavigate, useParams  } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';

import {Formik, Form, Field} from 'formik';
import * as Yup from 'yup';

const initialValues = {
    oldPassword: '',
    password: '',
    confirmation: '',
};

const validationSchema = Yup.object().shape({
    oldPassword: Yup.string()
      .min(8, 'La contraseña debe tener al menos 8 carácteres')
      .matches(/\d/, 'La contraseña debe tener al menos un número')
      .matches(/[A-Z]/, 'La contraseña debe tener al menos una letra mayúscula')
      .required('Contraseña es requerida'),
    password: Yup.string()
      .min(8, 'La contraseña debe tener al menos 8 carácteres')
      .matches(/\d/, 'La contraseña debe tener al menos un número')
      .matches(/[A-Z]/, 'La contraseña debe tener al menos una letra mayúscula')
      .required('Contraseña es requerida'),
    confirmation: Yup.string()
      .oneOf([Yup.ref('password'), null], 'Las contraseñas no coinciden')
      .required('Confirmación de contraseña es requerida')
  });


const UserChangePassword = function () {

    const [errors, setErrorMessage] = useState('');
    const {currentUser} = useAuth();

    if (!currentUser) return <Navigate to="/" />;
    
    const navigate = useNavigate();
    
    const handleSubmit = async function handleSubmit(values) {
        const requestOptions = {
            method: 'PUT',
            headers: { 
                'Content-Type': 'application/json',
                'Authorization': currentUser.token_type + ' ' + currentUser.access_token, 
             },
            body: JSON.stringify(values),
        };
        try {
            const response = await fetch(`${process.env.REACT_APP_API_URL}/users/${currentUser.id}`, requestOptions);
            if (!response.ok) {
                const error = await response.json();
                throw error;
            }
            navigate('/account');
        } catch (error) {
            console.log(error);
            setErrorMessage(error);
        }
    };

    return (
        <div class="container">
            <div class="d-flex justify-content-center h-100">
                <div class="card">
                    <div class="card-header">
                        <h3>Cambiar contraseña</h3>
                        {errors && <p>{errors.message}</p>}
                    </div>
                    <div class="card-body margin-top">
                        <Formik
                            initialValues={initialValues}
                            onSubmit={handleSubmit}
                            validationSchema={validationSchema}
                        >   
                        {({ errors, touched }) => (
                            <Form>
                                {(errors.oldPassword && touched.oldPassword) && (
                                    <div className="bottom-margin">{errors.oldPassword}</div>
                                )}
                                <div class="input-group form-group">
                                    <div class="input-group-prepend">
                                        <span class="input-group-text"><i class="fas fa-key"></i></span>
                                    </div>
                                    <Field type="password" class="form-control" placeholder="Contraseña actual" name="oldPassword" id="oldPassword" required/>
                                </div>
                                {(errors.password && touched.password) && (
                                    <div className="bottom-margin">{errors.password}</div>
                                )}
                                <div class="input-group form-group">
                                    <div class="input-group-prepend">
                                        <span class="input-group-text"><i class="fas fa-key"></i></span>
                                    </div>
                                    <Field type="password" class="form-control" placeholder="Nueva contraseña" name="password" id="password" required/>
                                </div>
                                {(errors.confirmation && touched.confirmation) && (
                                    <div className="bottom-margin">{errors.confirmation}</div>
                                )}
                                <div class="input-group form-group">
                                    <div class="input-group-prepend">
                                        <span class="input-group-text"><i class="fas fa-key"></i></span>
                                    </div>
                                    <Field type="password" class="form-control" placeholder="Confirme contraseña" name="confirmation" id="confirmation" required/>
                                </div>
                                <div class="form-group">
                                    <input type="submit" value="Confirmar" class="btn float-right login_btn"/>
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
export default UserChangePassword;
import React, { Component, useState } from 'react';
import { Navigate, useNavigate  } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';

import {Formik, Form, Field} from 'formik';
import * as Yup from 'yup';


const initialValues = {
    email: '',
    phone: '',
    password: '',
};

const validationSchema = Yup.object().shape({
    email: Yup.string()
      .email('Dirección de email inválida')
      .required('Email es requerido'),
    password: Yup.string()
      .min(8, 'La contraseña debe tener al menos 8 carácteres')
      .matches(/\d/, 'La contraseña debe tener al menos un número')
      .matches(/[A-Z]/, 'La contraseña debe tener al menos una letra mayúscula')
      .required('Contraseña es requerida'),
    phone: Yup.string()
        .min(12, 'El número debe ser de la forma +569xxxxxxxx')
        .max(12, 'El número debe ser de la forma +569xxxxxxxx')
        .matches(/\x2b56[0-9]+/, 'El número debe ser de la forma +56xxxxxxxxx')
        .required('Número de teléfono es requerido'),
    confirmation: Yup.string()
      .oneOf([Yup.ref('password'), null], 'Las contraseñas no coinciden')
      .required('Confirmación de contraseña es requerida')
  });

const Register = function (errorType = null) {
    const [values, setValues] = useState(initialValues);
    const [loading, setLoading] = useState(false);
    const [errors, setErrorMessage] = useState('');
    const { currentUser, handleUserLogin } = useAuth();
    const navigate = useNavigate();

    if (currentUser) return <Navigate to="/" />;
    
    const handleSubmit = async function handleSubmit(values) {
        setLoading(true);
        const requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(values),
        };
        try {
            const response = await fetch(`${process.env.REACT_APP_API_URL}/users`, requestOptions);
            console.log(response);
            if (!response.ok) {
                const error = await response.json();
                throw error;
            }
            navigate('/login');
        } catch (error) {
            console.log(error);
            setErrorMessage(error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return <h1>Loading...</h1>;
    }

    return (
        <div class="container">
            <div class="d-flex justify-content-center h-100">
                <div class="card">
                    <div class="card-header">
                        <h3>Crear cuenta</h3>
                        {errors &&
                            <>
                                <ul>
                                {errors.map((error) => (
                                    <li key={error.message}>{error.message}</li>
                                ))}
                                </ul>
                            </>
                        }
                    </div>
                    <div class="card-body margin-top">
                        <Formik
                            initialValues={initialValues}
                            onSubmit={handleSubmit}
                            validationSchema={validationSchema}
                        >   
                        {({ errors, touched }) => (
                            <Form>
                                {(errors.email && touched.email) && (
                                    <div class="bottom-margin">{errors.email}</div>
                                )}
                                <div class="input-group form-group">
                                    <div class="input-group-prepend">
                                        <span class="input-group-text"><i class="fas fa-user"></i></span>
                                    </div>
                                    <Field type="email" class="form-control" name="email" id="email" required/>
                                </div>
                                {(errors.phone && touched.phone) && (
                                    <div className="bottom-margin">{errors.phone}</div>
                                )}
                                <div class="input-group form-group">
                                    <div class="input-group-prepend">
                                        <span class="input-group-text"><i class="fas fa-phone"></i></span>
                                    </div>
                                    <Field type="text" placeholder="+569xxxxxxxx" class="form-control" name="phone" id="phone" required/>
                                </div>
                                {(errors.password && touched.password) && (
                                    <div className="bottom-margin">{errors.password}</div>
                                )}
                                <div class="input-group form-group">
                                    <div class="input-group-prepend">
                                        <span class="input-group-text"><i class="fas fa-key"></i></span>
                                    </div>
                                    <Field type="password" class="form-control" name="password" id="password" required/>
                                </div>
                                {(errors.confirmation && touched.confirmation) && (
                                    <div className="bottom-margin">{errors.confirmation}</div>
                                )}
                                <div class="input-group form-group">
                                    <div class="input-group-prepend">
                                        <span class="input-group-text"><i class="fas fa-key"></i></span>
                                    </div>
                                    <Field type="password" class="form-control" name="confirmation" id="confirmation" required/>
                                </div>
                                <div class="form-group">
                                    <input type="submit" value="Registrarse" class="btn float-right login_btn"/>
                                </div>
                            </Form>
                        )}
                        </Formik>
                    </div>
                    <div class="card-footer">
                        <div class="d-flex justify-content-center links">
                            ¿Ya tienes una cuenta?<a href="/login">Iniciar sesión</a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
};

export default Register;
import React, { Component, useState } from 'react';
import { Navigate  } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';


const initialValues = {
    email: '',
    password: '',
};


const Login = function (errorType = null) {
    const [values, setValues] = useState(initialValues);
    const [loading, setLoading] = useState(false);
    const [error, setErrorMessage] = useState('');
    const { currentUser, handleUserLogin } = useAuth();

    const handleChange = function handleChange(event) {
        setValues((prevValues) => ({
            ...prevValues,
            [event.target.name]: event.target.value,
        }));
    };    
    
    const handleSubmit = async function handleSubmit(event) {
        setLoading(true);
        event.preventDefault();
        const requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(values),
        };
        try {
            const response = await fetch(`${process.env.REACT_APP_API_URL}/auth`, requestOptions);
            if (!response.ok) {
                const error = await response.text();
                throw new Error(error);
            }
            const user = await response.json();
            handleUserLogin(user);
        } catch (error) {
            setErrorMessage(error.message);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return <h1>Loading...</h1>;
    }
    
    if (currentUser) return <Navigate to="/" />;


    return (
        <div class="container login-page">
            <div class="d-flex justify-content-center h-100">
                <div class="card">
                    <div class="login card-header">
                        <h3>Iniciar Sesión</h3>
                        {error ? (
                            <h4>{error}</h4>
                        ):(<></>)}
                    </div>
                    <div class="card-body margin-top">
                        <form onSubmit={handleSubmit}>
                            <div class="input-group form-group">
                                <div class="input-group-prepend">
                                    <span class="input-group-text"><i class="fas fa-user"></i></span>
                                </div>
                                <input type="email" class="form-control" placeholder="Correo electrónico" name="email" id="email" value={values.email} onChange={handleChange} required/>
                            </div>
                            <div class="input-group form-group">
                                <div class="input-group-prepend">
                                    <span class="input-group-text"><i class="fas fa-key"></i></span>
                                </div>
                                <input type="password" class="form-control" placeholder="Contraseña" name="password" id="password" value={values.password} onChange={handleChange} required/>
                            </div>
                            <div class="form-group">
                                <input type="submit" value="Login" class="btn float-right login_btn"/>
                            </div>
                        </form>
                    </div>
                    <div class="card-footer">
                        <div class="d-flex justify-content-center links">
                            ¿No tienes una cuenta?<a href="register">Registrarse</a>
                        </div>
                        <div class="d-flex justify-content-center">
                            <a href="forgotPassword">¿Olvidó su contraseña?</a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
};

export default Login;
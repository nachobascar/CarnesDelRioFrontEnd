import React, { Component, useState } from 'react';
import { Navigate  } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';


const initialValues = {
    email: '',
};


const UserForgotPassword = function ({isLoading}) {
    const [values, setValues] = useState(initialValues);
    const [errorMessage, setErrorMessage] = useState('');
    const [registrationMessage, setRegistrationMessage] = useState('');
    const { currentUser, handleUserLogin } = useAuth();

    const handleChange = function handleChange(event) {
        setValues((prevValues) => ({
            ...prevValues,
            [event.target.name]: event.target.value,
        }));
    };    
    
    const handleSubmit = async function handleSubmit(event) {
        isLoading(true);
        event.preventDefault();
        const requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(values),
        };
        try {
            const response = await fetch(`${process.env.REACT_APP_API_URL}/users/passwordRecovery`, requestOptions);
            if (!response.ok) {
                const error = await response.json();
                throw error;
            }
            setRegistrationMessage('Check your email for a password reset link.');
        } catch (error) {
            setErrorMessage(error.message);
        } finally {
            isLoading(false);
        }
    };


    if (currentUser) return <Navigate to="/" />;


    return (
        <div className="container login-page">
            <div className="d-flex justify-content-center h-100">
                <div className="card">
                    <div className="card-header">
                        <h3>Recuperar contraseña</h3>
                        {registrationMessage && <p>{registrationMessage}</p>}
                        {errorMessage &&
                            <h4>{errorMessage}</h4>
                        }
                    </div>
                    <div className="card-body margin-top">
                        <form onSubmit={handleSubmit}>
                            <div className="input-group form-group">
                                <div className="input-group-prepend">
                                    <span className="input-group-text"><i className="fas fa-user"></i></span>
                                </div>
                                <input type="email" className="form-control" name="email" placeholder='correo electrónico' id="email" value={values.email} onChange={handleChange} required/>
                            </div>
                            <div className="form-group">
                                <input type="submit" value="Recuperar" className="btn float-right login_btn"/>
                            </div>
                        </form>
                    </div>
                    <div className="card-footer">
                        <div className="d-flex justify-content-center links">
                            ¿No tienes una cuenta?<a href="register">Registrarse</a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
};

export default UserForgotPassword;
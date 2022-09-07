import React, { useEffect, useState } from 'react';
import { Navigate, useSearchParams, useNavigate, useParams  } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';

import {Formik, Form, Field} from 'formik';
import * as Yup from 'yup';

const initialValues = {
    phone: '',
};

const validationSchema = Yup.object().shape({
    phone: Yup.string()
        .min(12, 'El número debe ser de la forma +569xxxxxxxx')
        .max(12, 'El número debe ser de la forma +569xxxxxxxx')
        .matches(/\x2b56[0-9]+/, 'El número debe ser de la forma +56xxxxxxxxx')
        .required('Número de teléfono es requerido'),
  });


const UserChangePhone = function ({isLoading}) {

    const [errors, setErrorMessage] = useState('');
    const {currentUser} = useAuth();

    if (!currentUser) return <Navigate to="/" />;
    
    const navigate = useNavigate();
    
    const handleSubmit = async function handleSubmit(values) {
        isLoading(true);
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
            isLoading(false);
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
        <div className="container login-page">
            <div className="d-flex justify-content-center h-100">
                <div className="card">
                    <div className="card-header">
                        <h3>Cambiar teléfono</h3>
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
                                {(errors.phone && touched.phone) && (
                                    <div className="bottom-margin">{errors.phone}</div>
                                )}
                                <div className="input-group form-group">
                                    <div className="input-group-prepend">
                                        <span className="input-group-text"><i className="fas fa-phone"></i></span>
                                    </div>
                                    <Field type="phone" className="form-control" placeholder="Teléfono" name="phone" id="phone" required/>
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
export default UserChangePhone;
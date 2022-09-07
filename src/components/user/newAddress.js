import React, { useEffect, useState } from 'react';
import { Navigate, useSearchParams, useNavigate, useParams  } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';

import {Formik, Form, Field} from 'formik';
import * as Yup from 'yup';

import comunas from '../../data/comunas.js';

const initialValues = {
    calleNum: '',
    comuna: '',
    region: '',
    nombre: '',
    descripcion: '',
};

const validationSchema = Yup.object().shape({
    calleNum: Yup.string()
        .required('La calle y número son requeridos'),
    comuna: Yup.string()
        .required('La comuna es requerida'),
    region: Yup.string()
        .required('La región es requerida'),
    nombre: Yup.string()
        .required('El nombre es requerido'),
  });


const CreateAddress = function () {

    const [errors, setErrorMessage] = useState('');
    const {currentUser} = useAuth();

    if (!currentUser) return <Navigate to="/" />;
    
    const navigate = useNavigate();
    
    const handleSubmit = async function handleSubmit(values) {
        console.log(values);
        const requestOptions = {
            method: 'POST',
            headers: { 
                'Content-Type': 'application/json',
                'Authorization': currentUser.token_type + ' ' + currentUser.access_token, 
             },
            body: JSON.stringify(values),
        };
        try {
            const response = await fetch(`${process.env.REACT_APP_API_URL}/addresses`, requestOptions);
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
                        <h3>Agregar Dirección</h3>
                        {errors && <p>{errors.message}</p>}
                    </div>
                    <div class="card-body margin-top">
                        <Formik
                            initialValues={initialValues}
                            onSubmit={handleSubmit}
                            validationSchema={validationSchema}
                        >   
                        {({ values, errors, touched }) => (
                            <Form>
                                {(errors.calleNum && touched.calleNum) && (
                                    <div className="bottom-margin">{errors.calleNum}</div>
                                )}
                                <div class="input-group form-group">
                                    <div class="input-group-prepend">
                                        <span class="input-group-text"><i class="bi bi-geo-alt-fill"></i></span>
                                    </div>
                                    <Field type="text" class="form-control" placeholder="Calle y número" name="calleNum" id="calleNum" />
                                </div>
                                {(errors.region && touched.region) && (
                                    <div className="bottom-margin">{errors.region}</div>
                                )}
                                <div class="input-group form-group">
                                    <div class="input-group-prepend">
                                        <span class="input-group-text"><i class="bi bi-geo-alt-fill"></i></span>
                                    </div>
                                    <Field as="select" class="form-control" name="region" id="region">
                                        <option value="">Seleccione una región</option>
                                        {comunas.map((region, index) => (
                                            <option key={index} value={region.region}>{region.region}</option>
                                        ))}
                                    </Field>
                                </div>
                                {(errors.comuna && touched.comuna) && (
                                    <div className="bottom-margin">{errors.comuna}</div>
                                )}
                                <div class="input-group form-group">
                                    <div class="input-group-prepend">
                                        <span class="input-group-text"><i class="bi bi-geo-alt-fill"></i></span>
                                    </div>
                                    <Field as="select" class="form-control" name="comuna" id="comuna">
                                        <option value="">Seleccione una comuna</option>
                                        {values.region && 
                                            comunas.find(region => region.region === values.region).comunas.map((comuna, index) => (
                                                <option key={index} value={comuna}>{comuna}</option>
                                            ))
                                        }
                                    </Field>
                                </div>
                                
                                {(errors.nombre && touched.nombre) && (
                                    <div className="bottom-margin">{errors.nombre}</div>
                                )}
                                <div class="input-group form-group">
                                    <div class="input-group-prepend">
                                        <span class="input-group-text"><i class="bi bi-geo-alt-fill"></i></span>
                                    </div>
                                    <Field type="text" class="form-control" placeholder="Nombre" name="nombre" id="nombre" />
                                </div>
                                
                                <div class="input-group form-group">
                                    <div class="input-group-prepend">
                                        <span class="input-group-text"><i class="bi bi-geo-alt-fill"></i></span>
                                    </div>
                                    <Field type="text" class="form-control" placeholder="Descripción" name="descripcion" id="descripcion" />
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
export default CreateAddress;
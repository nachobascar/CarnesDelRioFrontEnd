import React, { useEffect, useState, useRef } from 'react';
import { Navigate, useSearchParams, useNavigate, useParams  } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';

import {Formik, Form, Field} from 'formik';
import * as Yup from 'yup';

import comunas from '../../data/comunas.js';

const iValues = {
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

const groupAreasByState = function (areas) {
    const areasByState = {};
    for (const area of areas) {
        if (!areasByState[area.state]) {
            areasByState[area.state] = [];
        }
        areasByState[area.state].push(area);
    }
    return areasByState;
};

const CreateAddress = function () {

    const [errors, setErrorMessage] = useState('');
    const {currentUser} = useAuth();
    const [areas, setAreas] = useState([]);
    const [initialValues, setInitialValues] = useState(iValues);
    const isCreate = useRef(true);

    if (!currentUser) return <Navigate to="/" />;
    
    const navigate = useNavigate();

    // Get address if id is provided
    const [searchParams, setSearchParams] = useSearchParams();
    useEffect(() => {
        const id = searchParams.get('id');
        if (id) {
            const requestOptions = {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': currentUser.token_type + ' ' + currentUser.access_token
                },
            };
            fetch(`${process.env.REACT_APP_API_URL}/addresses/${id}`, requestOptions).then(async (response) => {
                if (!response.ok) {
                    isCreate.current = true;
                    setSearchParams({});
                    console.log(response);
                    return;
                }
                isCreate.current = false;
                const data = await response.json();
                setInitialValues({
                    calleNum: data.calleNum,
                    comuna: data.comuna,
                    region: data.region,
                    nombre: data.nombre,
                    descripcion: data.descripcion,
                });
            });
        }
    }, [currentUser]);


    // Get areas
    useEffect(() => {
        const requestOptions = {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': currentUser.token_type + ' ' + currentUser.access_token
            },
        };
        fetch(`${process.env.REACT_APP_API_URL}/addresses/areas?validation=true`, requestOptions).then(async (response) => {
            if (!response.ok) {
                console.log("Error al obtener las areas");
                console.log(response);
                throw response;
            }
            const areas = await response.json();
            setAreas(groupAreasByState(areas));
        }).catch((error) => {
            console.log(error);
        });
    }, []);
    
    const handleSubmit = async function handleSubmit(values) {
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
    
    const handleEdit = async function handleEdit(values) {
        const id = searchParams.get('id');
        const requestOptions = {
            method: 'PUT',
            headers: { 
                'Content-Type': 'application/json',
                'Authorization': currentUser.token_type + ' ' + currentUser.access_token, 
             },
            body: JSON.stringify(values),
        };
        try {
            const response = await fetch(`${process.env.REACT_APP_API_URL}/addresses/${id}`, requestOptions);
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
        <div class="container login-page">
            <div class="d-flex justify-content-center h-100">
                <div class="card">
                    <div class="card-header">
                        <h3>Guardar Dirección</h3>
                        {errors && <p>{errors.message}</p>}
                    </div>
                    <div class="card-body margin-top">
                        <Formik
                            enableReinitialize
                            initialValues={initialValues}
                            onSubmit={isCreate.current ? handleSubmit : handleEdit}
                            validationSchema={validationSchema}
                        >   
                        {({ values, errors, touched }) => (
                            <Form>
                                {(errors.region && touched.region) && (
                                    <div className="bottom-margin">{errors.region}</div>
                                )}
                                <div class="input-group form-group">
                                    <div class="input-group-prepend">
                                        <span class="input-group-text"><i class="bi bi-geo-alt-fill"></i></span>
                                    </div>
                                    <Field as="select" class="form-control" name="region" id="region">
                                        <option value="">Seleccione una región</option>
                                        {Object.keys(areas).map((state, index) => (
                                            <option key={index} value={state}>{state}</option>
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
                                        {values.region && areas[values.region] &&
                                            areas[values.region].map((comuna, index) => (
                                                <option key={comuna.id} value={comuna.city}>{comuna.city}</option>
                                            ))
                                        }
                                    </Field>
                                </div>
                                {(errors.calleNum && touched.calleNum) && (
                                    <div className="bottom-margin">{errors.calleNum}</div>
                                )}
                                <div class="input-group form-group">
                                    <div class="input-group-prepend">
                                        <span class="input-group-text"><i class="bi bi-geo-alt-fill"></i></span>
                                    </div>
                                    <Field type="text" class="form-control" placeholder="Calle y número" name="calleNum" id="calleNum" />
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
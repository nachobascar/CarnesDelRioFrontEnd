import React, { render, useState, useEffect} from 'react';
import useAuth from '../../hooks/useAuth';

import {Formik, Form, Field} from 'formik';
import * as Yup from 'yup';
import { Navigate, useNavigate, useParams } from 'react-router-dom';

import CategoryList from './categoryList';

const iValues = {
    name: '',
    description: '',
    products: [],
};

const validationSchema = Yup.object().shape({
    name: Yup.string()
        .required('El nombre es requerido'),
    description: Yup.string()
        .required('La descripción es requerida'),
  });


const AdminEditProducts = function ({isLoading}) {
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);

    // request param id
    const { id } = useParams();

    const {currentUser} = useAuth();

    const [initialValues, setInitialValues] = useState(iValues);

    useEffect(() => {
        const requestOptions = {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': currentUser.token_type + ' ' + currentUser.access_token
            },
        };
        isLoading(true);
        fetch(`${process.env.REACT_APP_API_URL}/products`, requestOptions)
            .then((response) => {
                if (!response.ok) {
                    console.log("Error al verificar el usuario");
                    console.log(response);
                    throw response;
                }
                response.json().then((products) => {
                    setProducts(products);
                });
            })
            .catch((error) => {
                console.log(error);
            }).finally(() => {
                isLoading(false);
            });
        isLoading(true);
        fetch(`${process.env.REACT_APP_API_URL}/categories`, requestOptions)
            .then((response) => {
                if (!response.ok) {
                    console.log("Error al verificar el usuario");
                    console.log(response);
                    throw response;
                }
                response.json().then((categories) => {
                    setCategories(categories);
                });
            })
            .catch((error) => {
                console.log(error);
            }).finally(() => {
                isLoading(false);
            });
        isLoading(true);
        fetch(`${process.env.REACT_APP_API_URL}/categories/${id}`, requestOptions)
            .then((response) => {
                if (!response.ok) {
                    console.log("Error al verificar el usuario");
                    console.log(response);
                    throw response;
                }
                response.json().then((categories) => {
                    const values = {
                        name: categories.name,
                        description: categories.description,
                        products: categories.Products.map((product) => product.id.toString())
                    }
                    setInitialValues(values);
                    console.log(values);
                });
            })
            .catch((error) => {
                console.log(error);
            }).finally(() => {
                isLoading(false);
            });
    }, []);

    const handleSubmit = async function handleSubmit(values) {
        isLoading(true);
        const requestOptions = {
            method: 'PUT',
            headers: { 
                'Content-Type': 'application/json',
                'Authorization': currentUser.token_type + ' ' + currentUser.access_token
            },
            body: JSON.stringify(values),
        };
        try {
            const response = await fetch(`${process.env.REACT_APP_API_URL}/categories/${id}`, requestOptions);
            if (!response.ok) {
                const error = await response.json();
                throw error;
            }
            isLoading(false);
            location.reload();
        } catch (error) {
            isLoading(false);
            console.log(error);
        } 
    };

    var expanded = false;

    function showCheckboxes() {
        const checkboxes = document.getElementById("admin-page-checkboxes");
        if (!expanded) {
            checkboxes.style.display = "block";
            expanded = true;
        } else {
            checkboxes.style.display = "none";
            expanded = false;
        }
    }

    return (
        <> 
            <div className="admin-page-body d-flex">
                <CategoryList categories={categories}/>
                <div className="admin-page-new-element-form">
                    <h2>Editar Categoría</h2>
                    <Formik
                        enableReinitialize
                        initialValues={initialValues}
                        validationSchema={validationSchema}
                        onSubmit={handleSubmit}
                    >
                        {({
                            values,
                            errors,
                            touched,
                        }) => (
                            <Form>
                                <div className="admin-page-new-element-form-inputs">
                                    <div className="admin-page-new-element-form-inputs-group">
                                        <label htmlFor="name">Nombre</label>
                                        <Field type="text" name="name" id="name" value={values.name} />
                                        {errors.name && touched.name && <div className="admin-page-new-element-form-inputs-error">{errors.name}</div>}
                                    </div>
                                    <div className="admin-page-new-element-form-inputs-group admin-page-description-div">
                                        <label htmlFor="description" className="admin-page-description-label">Descripción</label>
                                        <Field as="textarea" name="description" id="description" value={values.description} />
                                        {errors.description && touched.description && <div className="admin-page-new-element-form-inputs-error">{errors.description}</div>}
                                    </div>
                                    <div className="admin-page-new-element-form-inputs-group admin-page-multiselect">
                                        <div className="admin-page-selectBox" onClick={showCheckboxes}>
                                            <Field  as="select" className="form-control" >
                                                <option value="" className="text-center">Seleccione los productos</option>
                                            </Field>
                                            <div className="admin-page-overSelect"></div>
                                        </div>
                                        <div id="admin-page-checkboxes">
                                            {products.map((product) => (
                                                <label key={product.id} htmlFor={product.name}>
                                                    {product.name}
                                                    <Field key={product.id} type="checkbox" id={product.name} name="products" value={product.id.toString()}/>
                                                </label>
                                            ))}
                                        </div>
                                    </div>
                                </div>


                                <div className="admin-page-new-element-form-buttons">
                                    <button type="submit" className="admin-page-new-element-form-btn">Guardar</button>
                                </div>
                            </Form>
                        )}
                    </Formik>
                </div>
            </div>
        </>
    );
}
export default AdminEditProducts;
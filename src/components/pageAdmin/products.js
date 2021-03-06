import React, { render, useState, useEffect} from 'react';
import useAuth from '../../hooks/useAuth';

import {Formik, Form, Field} from 'formik';
import * as Yup from 'yup';
import { Navigate, useNavigate } from 'react-router-dom';

import ProductList from './productList';

const initialValues = {
    name: '',
    description: '',
    price: '',
    image: '',
    imageUrl: '',
    categories: [],
};

const validationSchema = Yup.object().shape({
    name: Yup.string()
        .required('El nombre es requerido'),
    description: Yup.string()
        .required('La descripción es requerida'),
    price: Yup.number()
        .min(1, 'El precio debe ser mayor a 0')
        .required('El precio es requerido'),
    imageUrl: Yup.mixed()
        .required('La foto es requerida'),
  });


const AdminProducts = function (errorType = null) {
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [imageUrl, setImageUrl] = useState('');

    const {currentUser} = useAuth();

    const navigate = useNavigate();

    // Update imageUrl when file field changes
    useEffect(() => {
        if (imageUrl) {
            setImageUrl(imageUrl);
        }
    }, [imageUrl]);

    useEffect(() => {
        const requestOptions = {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': currentUser.token_type + ' ' + currentUser.access_token
            },
        };
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
            });
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
            });
    }, []);

    const handleSubmit = async function handleSubmit(values) {
        const requestOptions = {
            method: 'POST',
            headers: { 
                'Content-Type': 'application/json',
                'Authorization': currentUser.token_type + ' ' + currentUser.access_token
            },
            body: JSON.stringify(values),
        };
        try {
            if (values.imageUrl) {
                delete values.imageUrl;
            }
            const response = await fetch(`${process.env.REACT_APP_API_URL}/products`, requestOptions);
            if (!response.ok) {
                const error = await response.json();
                throw error;
            }
            location.reload();
        } catch (error) {
            console.log(error);
        } 
    };
    

    const number = 20000;

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
            <div class="admin-page-body d-flex">
                <ProductList products={products}/>
                <div class="admin-page-new-element-form">
                    <h2>Agregar Producto</h2>
                    <Formik
                        initialValues={initialValues}
                        validationSchema={validationSchema}
                        onSubmit={handleSubmit}
                    >
                        {({
                            values,
                            errors,
                            touched,
                            handleChange,
                            setFieldValue
                        }) => (
                            <Form>
                                <div class="admin-page-new-element-form-inputs">
                                    <div className="form-group">
                                        <Field type='file' name='imageUrl' className="form-control" onChange={(event) => {
                                            const reader = new FileReader();
                                            const file = event.target.files[0];
                                            reader.onloadend = () => {
                                                values.image = reader.result;
                                                setImageUrl(reader.result);
                                                setFieldValue('image', reader.result);
                                            };
                                            reader.readAsDataURL(file);
                                            console.log();
                                            handleChange(event);
                                        }}/>
                                        {errors.imageUrl && touched.imageUrl && <div class="admin-page-new-element-form-inputs-error">{errors.imageUrl}</div>}
                                        {imageUrl && (
                                            <img src={imageUrl} alt="photo" className="img-thumbnail mt-2" height={200} width={200} />
                                        )}
                                    </div>
                                    <div class="admin-page-new-element-form-inputs-group">
                                        <label htmlFor="name">Nombre</label>
                                        <Field type="text" name="name" id="name" value={values.name} />
                                        {errors.name && touched.name && <div class="admin-page-new-element-form-inputs-error">{errors.name}</div>}
                                    </div>
                                    <div class="admin-page-new-element-form-inputs-group admin-page-description-div">
                                        <label htmlFor="description" class="admin-page-description-label">Descripción</label>
                                        <Field as="textarea" name="description" id="description" value={values.description} />
                                        {errors.description && touched.description && <div class="admin-page-new-element-form-inputs-error">{errors.description}</div>}
                                    </div>
                                    <div class="admin-page-new-element-form-inputs-group">
                                        <label htmlFor="price">Precio</label>
                                        <Field type="number" name="price" id="price" value={values.price} />
                                        {errors.price && touched.price && <div class="admin-page-new-element-form-inputs-error">{errors.description}</div>}
                                    </div>
                                    <div class="admin-page-new-element-form-inputs-group admin-page-multiselect">
                                        <div class="admin-page-selectBox" onClick={showCheckboxes}>
                                            <Field  as="select" class="form-control" >
                                                <option value="" class="text-center">Seleccione las categorías</option>
                                            </Field>
                                            <div class="admin-page-overSelect"></div>
                                        </div>
                                        <div id="admin-page-checkboxes">
                                            {categories.map((category) => (
                                                <label htmlFor={category.name}>
                                                    {category.name}
                                                    <Field key={category.id} type="checkbox" id={category.name} name="categories" value={category.id.toString()}/>
                                                </label>
                                            ))}
                                        </div>
                                            {errors.category && touched.category && <div class="admin-page-new-element-form-inputs-error">{errors.category}</div>}
                                    </div>
                                </div>


                                <div class="admin-page-new-element-form-buttons">
                                    <button type="submit" class="admin-page-new-element-form-btn">Agregar</button>
                                </div>
                            </Form>
                        )}
                    </Formik>
                </div>
            </div>
        </>
    );
}
export default AdminProducts;
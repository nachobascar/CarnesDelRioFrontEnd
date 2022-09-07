import React, { render, useState, useEffect} from 'react';
import useAuth from '../../hooks/useAuth';

import {Formik, Form, Field} from 'formik';
import * as Yup from 'yup';
import { Navigate, useNavigate, useParams } from 'react-router-dom';

import ProductList from './productList';

const iValues = {
    name: '',
    description: '',
    price: '',
    image: '',
    imageUrl: '',
    stock: 0,
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
    stock: Yup.number()
        .min(0, 'El stock debe ser mayor o igual a 0')
        .required('El stock es requerido'),
  });


const AdminEditProducts = function ({isLoading}) {
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [imageUrl, setImageUrl] = useState('');

    // request param id
    const { id } = useParams();

    const {currentUser} = useAuth();

    const [initialValues, setInitialValues] = useState(iValues);

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
        isLoading(true);
        fetch(`${process.env.REACT_APP_API_URL}/products`, requestOptions)
            .then((response) => {
                if (!response.ok) {
                    console.log("Error al verificar el usuario");
                    console.log(response);
                    throw response;
                }
                response.json().then((products) => {
                    setProducts(products.sort((a, b) => Date.parse( a.createdAt) - Date.parse(b.createdAt)));
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
        fetch(`${process.env.REACT_APP_API_URL}/products/${id}`, requestOptions)
            .then((response) => {
                if (!response.ok) {
                    console.log("Error al verificar el usuario");
                    console.log(response);
                    throw response;
                }
                response.json().then((products) => {
                    const values = {
                        name: products.name,
                        description: products.description,
                        price: products.price,
                        image: products.image,
                        imageUrl: products.image,
                        stock: products.stock,
                        categories: products.Categories.map((category) => category.id.toString())
                    }
                    setInitialValues(values);
                    setImageUrl(products.image);
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
            if (values.imageUrl) {
                delete values.imageUrl;
            }
            const response = await fetch(`${process.env.REACT_APP_API_URL}/products/${id}`, requestOptions);
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
                <ProductList products={products}/>
                <div className="admin-page-new-element-form">
                    <h2>Editar Producto</h2>
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
                            handleChange,
                            setFieldValue
                        }) => (
                            <Form>
                                <div className="admin-page-new-element-form-inputs">
                                    <div className="form-group">
                                        <Field type='file' name='imageUrl' className="form-control" value={undefined} onChange={(event) => {
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
                                        {errors.imageUrl && touched.imageUrl && <div className="admin-page-new-element-form-inputs-error">{errors.imageUrl}</div>}
                                        {imageUrl && (
                                            <img src={imageUrl} alt="photo" className="img-thumbnail mt-2" height={200} width={200} />
                                        )}
                                    </div>
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
                                    <div className="admin-page-new-element-form-inputs-group  admin-page-num-input">
                                        <label htmlFor="price">Precio</label>
                                        <Field type="number" name="price" id="price" value={values.price} />
                                        {errors.price && touched.price && <div className="admin-page-new-element-form-inputs-error">{errors.price}</div>}
                                    </div>
                                    <div className="admin-page-new-element-form-inputs-group  admin-page-num-input">
                                        <label htmlFor="stock">Cantidad</label>
                                        <Field type="number" name="stock" id="stock" value={values.stock} />
                                        {errors.stock && touched.stock && <div className="admin-page-new-element-form-inputs-error">{errors.stock}</div>}
                                    </div>
                                    <div className="admin-page-new-element-form-inputs-group admin-page-multiselect">
                                        <div className="admin-page-selectBox" onClick={showCheckboxes}>
                                            <Field  as="select" className="form-control" >
                                                <option value="" className="text-center">Seleccione las categorías</option>
                                            </Field>
                                            <div className="admin-page-overSelect"></div>
                                        </div>
                                        <div id="admin-page-checkboxes">
                                            {categories.map((category) => (
                                                <label key={category.id} htmlFor={category.name}>
                                                    {category.name}
                                                    <Field key={category.id} type="checkbox" id={category.name} name="categories" value={category.id.toString()}/>
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
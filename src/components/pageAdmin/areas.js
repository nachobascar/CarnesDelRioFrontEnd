import React, { render, useState, useEffect} from 'react';
import useAuth from '../../hooks/useAuth';

import {Formik, Form, Field} from 'formik';
import * as Yup from 'yup';
import { Navigate, useNavigate } from 'react-router-dom';

import useCollapse from 'react-collapsed'

const initialValues = {
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
    


const AdminAreas = function ({isLoading}) {
    const [areas, setAreas] = useState([]);
    const [validAreas, setValidAreas] = useState([]);

    const {currentUser} = useAuth();

    const navigate = useNavigate();


    // Get areas
    useEffect(() => {
        const requestOptions = {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': currentUser.token_type + ' ' + currentUser.access_token
            },
        };
        isLoading(true);
        fetch(`${process.env.REACT_APP_API_URL}/addresses/areas`, requestOptions).then(async (response) => {
            if (!response.ok) {
                console.log("Error al obtener las areas");
                console.log(response);
                throw response;
            }
            const areas = await response.json();
            setAreas(groupAreasByState(areas));
        }).catch((error) => {
            console.log(error);
        }).finally(() => {
            isLoading(false);
        });
    }, []);

    useEffect(() => {
      const newValidAreas = {};
      for (const state in areas) {
        const validAreas = areas[state].filter((area) => area.valid);
        if (validAreas.length > 0) {
          newValidAreas[state] = validAreas;
        }
      }
      setValidAreas(newValidAreas);
    }, [areas]);

    const handleAreaToggle = async function handleAreaToggle(state, index, id = null) {
      if (index === null) {
        index = areas[state].findIndex((area) => area.id === id);
      }
      const area = areas[state][index];
      const requestOptions = {
          method: 'PUT',
          headers: { 
              'Content-Type': 'application/json',
              'Authorization': currentUser.token_type + ' ' + currentUser.access_token
          }
      };
      try {
          const response = await fetch(`${process.env.REACT_APP_API_URL}/addresses/areas/${area.id}/toggle`, requestOptions);
          if (!response.ok) {
              const error = await response.json();
              throw error;
          }
          const newArea = await response.json();
          const newAreas = {...areas};
          newAreas[state][index] = newArea;
          setAreas(newAreas);
      } catch (error) {
          console.log(error);
      } 
    };

    return (
        <> 
          <div className="admin-page-body d-flex">
            <div className="admin-page-list">
              <h2 className="text-center pt-3 pb-3">Agregar o Eliminar Comunas Válidas Para Despacho</h2>
              <div id="accordion">
                {Object.keys(areas).length > 0 ? 
                  Object.entries(areas).map(([state, values], index) => {
                    const header = `head-${index}`;
                    const body = `body-${index}`;
                    return (
                      <div key={state} className="card">
                          <div className="card-header" id={header}>
                            <button  className="btn collapsed btn-block text-left"  data-toggle="collapse" data-target={`#${body}`} aria-expanded="false" aria-controls={`${body}`}>
                              <h5 className="mb-0">
                                  {state}
                              </h5>
                            </button>
                          </div>
                          <div id={body} className='collapse' aria-labelledby={header} data-parent="#accordion">
                            <div className="card-body">
                              <div className='list-group'>
                                  {values.map((area, areaIndex) => {
                                    let color = 'success';
                                    if (!area.valid) {
                                      color = 'danger';
                                    } 
                                    return <button key={area.id} className={`pl-5 list-group-item list-group-item-action list-group-item-${color}`} onClick={() => handleAreaToggle(state, areaIndex)}>{area.city}</button>
                                  })}
                              </div>
                            </div>
                          </div>
                      </div>
                    );
                  }) : 
                  <div className="admin-page-list-item d-flex flex-row">
                      <div className="admin-page-list-item-info d-flex flex-row">
                          <div className="d-flex flex-column admin-page-list-item-description">
                              <h3>No hay areas</h3>
                          </div>
                      </div>
                  </div>
                }
              </div>
            </div>


            <div className="admin-page-list secondary">
              <h2 className="text-center pt-3 pb-3">Comunas Con Despacho Disponible</h2>
              <div id="accordion-2" className='h-100'>
                {Object.keys(validAreas).length > 0 ? 
                  Object.entries(validAreas).map(([state, values], index) => {
                    const header = `head-${index}-2`;
                    const body = `body-${index}-2`;
                    return (
                      <div key={state} className="card">
                          <div className="card-header" id={header}>
                            <button  className="btn collapsed btn-block text-left"  data-toggle="collapse" data-target={`#${body}`} aria-expanded="false" aria-controls={`${body}`}>
                              <h5 className="mb-0">
                                  {state}
                              </h5>
                            </button>
                          </div>
                          <div id={body} className='collapse' aria-labelledby={'head'+state} data-parent="#accordion-2">
                            <div className="card-body">
                              <div className='list-group'>
                                  {values.map((area, areaIndex) => {
                                    if (area.valid) {
                                      return (
                                        <div key={area.id} className={`pl-5 list-group-item list-group-item-action d-flex justify-content-between`} >
                                          <h5>{area.city}</h5>
                                          <button  type="button" className="close" aria-label="Close" onClick={() => handleAreaToggle(state, null, area.id)}>
                                            <span aria-hidden="true">&times;</span>
                                          </button>
                                        </div>
                                      );
                                    } else {
                                      return null;
                                    }
                                  })}
                              </div>
                            </div>
                          </div>
                      </div>
                    );
                  }) : 
                  <div className="card">
                      <div className="card-header text-center">
                          <h3>No hay comunas con despacho</h3>
                      </div>
                  </div>
                }
              </div>
            </div>
          </div>
        </>
    );
}
export default AdminAreas;
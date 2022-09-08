import React, { render, useState, useEffect} from 'react';
import useAuth from '../../hooks/useAuth';

import { Navigate, useNavigate } from 'react-router-dom';


const AdminUsers = function ({isLoading}) {
  const {currentUser} = useAuth();
  const navigate = useNavigate();
  const [users, setUsers] = useState({});

  const handleRequests = async (user, url) => {
      isLoading(true);
      const requestOptions = {
          method: 'PUT',
          headers: { 
              'Content-Type': 'application/json',
              'Authorization': currentUser.token_type + ' ' + currentUser.access_token, 
           },
      };
      const response = await fetch(process.env.REACT_APP_API_URL + `/admin/${url}/${user.id}`, requestOptions);
      if (response.status === 200) {
          const user = await response.json();
          isLoading(false);
          
          // Update users
          return user;
      } else {
          isLoading(false);
          return null;
      }
  }

  const handleDelete = async (user) => {
    if (confirm('¿Estás seguro de que quieres eliminar este usuario?') ){
      isLoading(true);
        const requestOptions = {
            method: 'DELETE',
            headers: { 
                'Content-Type': 'application/json',
                'Authorization': currentUser.token_type + ' ' + currentUser.access_token, 
            },
        };
        const response = await fetch(process.env.REACT_APP_API_URL + `/users/${user.id}`, requestOptions);
        if (response.status === 200) {
            users.Usuarios = users.Usuarios.filter(u => u.id !== user.id);
            setUsers({...users});
            isLoading(false);
        }
      }
  };

  const handleAddAdmin = async (user) => {
      const newUser = await handleRequests(user, 'makeAdmin');
      if (newUser) {
          users.Usuarios = users.Usuarios.filter(u => u.id !== newUser.id);
          users.Administradores.push(newUser);
          setUsers({...users});
      }
  };

  const handleRemoveAdmin = async (user) => {
      const newUser = await handleRequests(user, 'removeAdmin');
      if (newUser) {
          users.Administradores = users.Administradores.filter(u => u.id !== newUser.id);
          users.Usuarios.push(newUser);
          setUsers({...users});
      }
  };
  
  useEffect( () => {
      const fetchUsers = async () => {
          if (currentUser && currentUser.admin) {
              const requestOptions = {
                  headers: {
                      'Content-Type': 'application/json',
                      'Authorization': currentUser.token_type + ' ' + currentUser.access_token
                  },
              };
              const res = await fetch(process.env.REACT_APP_API_URL + '/users', requestOptions);
              if (res.status !== 200) {
                  const error = await res.json();
                  throw new Error('Error fetching users: ' + error.message);
              } else {
                  const users = await res.json();
                  const auxUsers = {
                      Usuarios: [],
                      Administradores: []
                  };
                  users.forEach(user => {
                      if (user.admin) {
                          auxUsers.Administradores.push(user);
                      } else {
                          auxUsers.Usuarios.push(user);
                      }
                  });
                  console.log(auxUsers);
                  setUsers(auxUsers);
              }
          }
      };
      isLoading(true);
      fetchUsers().catch( err => {
          console.log(err);
      }).finally( () => {
          isLoading(false);
      });
  }, []);   

    return (
        <> 
        <div className="admin-page-body d-flex">
            <div className="admin-page-list">
              <h2 className="text-center pt-3 pb-3">Manejar Usuarios</h2>
              <div id="accordion">
                {Object.keys(users).length > 0 &&
                  Object.entries(users).map(([userKind, userList], index) => {
                    const header = `head-${index}`;
                    const body = `body-${index}`;
                    return (
                      <div key={userKind} className="card">
                          <div className="card-header" id={header}>
                            <button  className="btn collapsed btn-block text-left"  data-toggle="collapse" data-target={`#${body}`} aria-expanded="false" aria-controls={`${body}`}>
                              <h3 className="ml-5">
                                  {userKind}
                              </h3>
                            </button>
                          </div>
                          <div id={body} className='collapse' aria-labelledby={header} data-parent="#accordion">
                            <div className="card-body">
                              <div className="row">
                                <div className="col-md-12">
                                    <div className="table-responsive">
                                        <table className="table table-striped table-bordered table-hover ml-5 mr-5">
                                            <thead>
                                                <tr>
                                                    <th>Correo</th>
                                                    <th>Teléfono</th>
                                                    <th>Correo Verificado</th>
                                                    {
                                                        {
                                                            Usuarios: 
                                                                <React.Fragment>
                                                                    <th>Eliminar</th>
                                                                    <th>Hacer Admin</th>
                                                                </React.Fragment>,
                                                            Administradores: <th>Remover Admin</th>
                                                        }[userKind]
                                                    }
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {users && users[userKind].map(user => (
                                                    <tr key={user.id}>
                                                        <td style={{textAlign: 'center'}}>{user.email}</td>
                                                        <td style={{textAlign: 'center'}}>{user.phone}</td>
                                                        <td style={{textAlign: 'center'}}>{user.verified ? 'Si' : 'No'}</td>
                                                        {
                                                            {
                                                                Usuarios:
                                                                    <React.Fragment>
                                                                        <td style={{textAlign: 'center'}}><button className="btn btn-danger" onClick={() => handleDelete(user)}><i className='fa fa-minus'></i></button></td>
                                                                        <td style={{textAlign: 'center'}}><button className="btn btn-warning" onClick={() => handleAddAdmin(user)}><i className='fa fa-unlock'></i></button></td>
                                                                    </React.Fragment>,
                                                                Administradores: <td style={{textAlign: 'center'}}><button className="btn btn-danger" onClick={() => handleRemoveAdmin(user)} disabled={currentUser.id === user.id}><i className='fa fa-lock'></i></button></td>
                                                            }[userKind]
                                                        }
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            </div>
                            </div>
                          </div>
                      </div>
                    );
                  })}
              </div>
            </div>
          </div>
        </>
    );
}
export default AdminUsers;
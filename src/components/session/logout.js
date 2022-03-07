import React from 'react';
import { Navigate  } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';




const Logout = function (errorType = null) {
    const { currentUser, handleUserLogout } = useAuth();
    
    if (!currentUser) return <Navigate to="/" />;

    handleUserLogout();
    


    return (
        <div class="container"></div>
    )
};

export default Logout;
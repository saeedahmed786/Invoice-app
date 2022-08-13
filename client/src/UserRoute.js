import React from 'react';
import { Redirect, Route } from 'react-router-dom';
import { isAuthenticated } from './components/Auth/auth';

const UserRoute = ({ component: Component, ...rest }) => {
    return (
        <>
            <Route
                {...rest}
                render={(props) =>
                    isAuthenticated() && isAuthenticated().token ? (
                        <Component {...props} />
                    ) : (
                        <Redirect to='/login' />
                    )
                }
            />
        </>
    )
};

export default UserRoute;

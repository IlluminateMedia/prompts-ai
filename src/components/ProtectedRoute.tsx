import React from "react";
import { Route, Redirect } from "react-router-dom";

import { ProtectedRouteProps } from "../common/interfaces";

export default function ProtectedRoute({ isAuthenticated, authenticationPath, ...routeProps }: ProtectedRouteProps) {
    return (
        isAuthenticated ? 
            <Route {...routeProps} /> :
            <Redirect to={{ pathname: authenticationPath }} />
    );
};
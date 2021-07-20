import React, { useContext, } from 'react'
import { Redirect, Route, } from 'react-router-dom'
import { AppContext, } from '../contexts'

interface PrivatRouteProps {
    component: typeof React.Component | ((props?: unknown) => JSX.Element)
    path: string
    exact?: boolean
}

export function PrivateRoute({ component: Component, path, exact, }:
    PrivatRouteProps) {
    const ctx = useContext(AppContext)
    const { isAuthenticated, } = ctx.auth
    return (
        <Route path={path} exact={exact}
            render={(props) => {
                return isAuthenticated == true
                    ? <Component {...props} />
                    // eslint-disable-next-line react/prop-types
                    : <Redirect to={{ pathname: '/login', state: { from: props.location, }, }} />
            }}
        />
    )
}

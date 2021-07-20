import 'antd/dist/antd.min.css'
import React, { useContext, } from 'react'
import {
    Router, Redirect, Route, Switch,
} from 'react-router-dom'
import { PrivateRoute, } from './components/private-route'
import { AppContext, } from './contexts'
import { Dashboard, Login, Profile, NotFound, NotPermitted, } from './pages'

export function App() {
    const { history, } = useContext(AppContext)
    return (
        <Router history={history}>
            <Switch>
                <PrivateRoute exact path="/" component={Dashboard} />
                <PrivateRoute exact path="/me" component={Profile} />
                <Route exact path="/login">
                    <Login />
                </Route>
                <PrivateRoute exact path="/dashboard/:parent/:child" component={Dashboard} />
                <PrivateRoute exact path="/dashboard/:parent" component={Dashboard} />
                <PrivateRoute exact path="/dashboard" component={Dashboard} />
                <Route exact path="/404">
                    <NotFound />
                </Route>
                <Route exact path="/403">
                    <NotPermitted />
                </Route>
                <Redirect to="/404" />
            </Switch>
        </Router>
    )
}

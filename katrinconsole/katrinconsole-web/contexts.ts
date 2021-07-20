import React from 'react'
import { AuthService, DashboardUiService, LegacyControlService, SanityService, UserService, } from './services'
import { createBrowserHistory, } from 'history'

export const history = createBrowserHistory()
const auth = new AuthService()
const user = new UserService()
const dashboardUi = new DashboardUiService()
const sanity = new SanityService()
const legacyControl = new LegacyControlService()

export const AppContext = React.createContext({
    history,
    auth,
    dashboardUi,
    user,
    sanity,
    legacyControl,
})

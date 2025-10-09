import React from 'react'
import { Route, Routes } from 'react-router-dom'
import { ROUTES } from '../Utils/Constants'
import { CreateMatch, CreateScorecard, Dashboard, Home, Login, Register, ViewMyScorecards, ViewScorecardRound, ViewScorecardTotal } from '../Pages/Index'
import NotFound from '../Pages/NotFound'
import PrivateRoute from './PrivateRoute'
import AdminRoute from './AdminRoute'





export default function AppRoutes() {
    return (
        
        <Routes>
            <Route path={ROUTES.HOME} element={<Home />} />
            <Route path={ROUTES.LOGIN} element={<Login />} />
            <Route path={ROUTES.REGISTER} element={<Register />} />
            <Route element={<PrivateRoute />}>
                <Route path={ROUTES.DASHBOARD} element={<Dashboard />} />
                <Route path={ROUTES.VIEW_MY_CARDS} element={<ViewMyScorecards />} />
                <Route path={ROUTES.CREATE_CARD} element={<CreateScorecard />} />
                <Route path={ROUTES.VIEW_CARD_TOTAL} element={<ViewScorecardTotal />} />
                <Route path={ROUTES.VIEW_ROUND} element={<ViewScorecardRound />} />
            </Route>
            <Route element={<AdminRoute />}>
                <Route path={ROUTES.CREATE_MATCH} element={<CreateMatch />} />
            </Route>

            <Route path="*" element={<NotFound />} />
        </Routes>
        
    )
}

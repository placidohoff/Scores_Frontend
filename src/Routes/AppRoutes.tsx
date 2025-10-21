import React from 'react'
import { Route, Routes } from 'react-router-dom'
import { ROUTES } from '../Utils/Constants'
import { CreateFighter, CreateMatch, CreateScorecard, Dashboard, Home, Login, RecentFights, RecentScores, Register, ScoreFight, ScoreRound, ViewMyScorecards, ViewScorecardRound, ViewScorecardTotal } from '../Pages/Index'
import NotFound from '../Pages/NotFound'
import PrivateRoute from './PrivateRoute'
import AdminRoute from './AdminRoute'
import CreateRounds from '../Pages/CreateRounds'





export default function AppRoutes() {
    return (

        <Routes>
            <Route path={ROUTES.HOME} element={<RecentFights />} />
            <Route path={ROUTES.LOGIN} element={<Login />} />
            <Route path={ROUTES.REGISTER} element={<Register />} />
            <Route path={ROUTES.RECENT_FIGHTS} element={<RecentFights />}/>
            <Route path={ROUTES.RECENT_SCORECARDS} element={<RecentScores />}/>
            <Route element={<PrivateRoute />}>
                <Route path={ROUTES.DASHBOARD} element={<Dashboard />} />
                <Route path={ROUTES.VIEW_MY_CARDS} element={<ViewMyScorecards />} />
                <Route path={ROUTES.CREATE_CARD} element={<CreateScorecard />} />
                <Route path={ROUTES.VIEW_CARD_TOTAL} element={<ViewScorecardTotal />} />
                <Route path={ROUTES.VIEW_ROUND} element={<ViewScorecardRound />} />
                <Route path={ROUTES.SCORE_ROUND} element={<ScoreRound />} />
                <Route path={ROUTES.CREATE_ROUNDS_NEW_SCORECARD} element={<CreateRounds />} />
                <Route path={ROUTES.SCORE_FIGHT} element={<ScoreFight />} />
            </Route>
            <Route element={<AdminRoute />}>
                <Route path={ROUTES.CREATE_MATCH} element={<CreateMatch />} />
                <Route path={ROUTES.CREATE_FIGHTER} element={<CreateFighter />} />
            </Route>

            <Route path="*" element={<NotFound />} />
        </Routes>

    )
}

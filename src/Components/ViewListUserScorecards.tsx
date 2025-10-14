import React, { useEffect, useState } from 'react'
import { IScorecard } from '../Interfaces/IScorecard'
import axios from 'axios'
import { API_ENDPOINTS, API_ROOTS, ENVIRONMENTS } from '../Utils/Constants'
import { useAuth } from '../Context/auth'
import { IApiResponse } from '../Interfaces/IApiResponse'
import UserScorecard from './UserScorecard'
import { useData } from '../Context/data'



export default function ViewListUserScorecards() {
    const { auth } = useAuth();
    const { ctxFighters } = useData()
    const [scorecardsForUser, setScorecardsForUser] = useState<IScorecard[]>([])

    const API_BASE_URL = process.env.REACT_APP_ENVIRONMENT === ENVIRONMENTS.DEV
        ? API_ROOTS.DEV
        : process.env.REACT_APP_ENVIRONMENT === ENVIRONMENTS.PROD
            ? API_ROOTS.PROD
            : API_ROOTS.WORK

    const API_ENDPOINT_SCORES = process.env.REACT_APP_ENVIRONMENT === ENVIRONMENTS.DEV
        ? API_ENDPOINTS.SCORECARDS.DEV
        : process.env.REACT_APP_ENVIRONMENT === ENVIRONMENTS.PROD
            ? API_ENDPOINTS.SCORECARDS.PROD
            : API_ENDPOINTS.SCORECARDS.WORK

    useEffect(() => {
        const getScorecards = async () => {
            const response = await axios.get<IApiResponse<IScorecard[]>>(
                API_BASE_URL + API_ENDPOINT_SCORES
            );

            const data = response.data;

            console.log(data)

            const filteredCards = data.result.filter(c => c.user_ID == auth.id)

            

            setScorecardsForUser(filteredCards);
        }

        getScorecards();
    }, [])




    return (
        <div>
            {scorecardsForUser.map((s, index) => <UserScorecard isActive={true} scorecard={s} key={index} />)}
        </div>
    )
}

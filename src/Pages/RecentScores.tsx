import React, { useEffect, useState } from 'react'
import { BoxingMatchCard, FadeInSection, UserScorecard } from '../Components'
import { useData } from '../Context/data'
import { useNavigate } from 'react-router-dom';
import { API_ENDPOINTS, API_ROOTS, ENVIRONMENTS, LOCAL_STORAGE, ROUTES } from '../Utils/Constants';
import axios from 'axios';

export default function RecentScores() {
    const { ctxScorecards, ctxFighters, setCTXScorecards, setCTXFighters } = useData()
    const [isLoaded, setIsLoaded] = useState(false);

    const navigate = useNavigate()

    const API_BASE_URL = process.env.REACT_APP_ENVIRONMENT === ENVIRONMENTS.DEV
        ? API_ROOTS.DEV
        : process.env.REACT_APP_ENVIRONMENT === ENVIRONMENTS.PROD
            ? API_ROOTS.PROD
            : API_ROOTS.WORK

    const API_ENDPOINT_MATCHES = process.env.REACT_APP_ENVIRONMENT === ENVIRONMENTS.DEV
        ? API_ENDPOINTS.BOXING_MATCHES.DEV
        : process.env.REACT_APP_ENVIRONMENT === ENVIRONMENTS.PROD
            ? API_ENDPOINTS.BOXING_MATCHES.PROD
            : API_ENDPOINTS.BOXING_MATCHES.WORK

    const API_ENDPOINT_FIGHTERS = process.env.REACT_APP_ENVIRONMENT === ENVIRONMENTS.DEV
        ? API_ENDPOINTS.FIGHTERS.DEV
        : process.env.REACT_APP_ENVIRONMENT === ENVIRONMENTS.PROD
            ? API_ENDPOINTS.FIGHTERS.PROD
            : API_ENDPOINTS.FIGHTERS.WORK

    useEffect(() => {


        const getFighters = async () => {
            const { data } = await axios.get(API_BASE_URL + API_ENDPOINT_FIGHTERS);
            console.log(data, 'fighters')

            {
                (process.env.REACT_APP_ENVIRONMENT === ENVIRONMENTS.DEV || process.env.REACT_APP_ENVIRONMENT === ENVIRONMENTS.PROD) && setCTXFighters(data.result); localStorage.setItem(LOCAL_STORAGE.FIGHTERS, JSON.stringify(data.result))
            }
            {
                process.env.REACT_APP_ENVIRONMENT === ENVIRONMENTS.WORK && setCTXFighters(data.result);  /* setFighters(data); */
            }
        }


        getFighters();
        // console.log(ctxBoxingMatches)
        const timer = setTimeout(() => {
            setIsLoaded(true);
        }, 500); // 0.5 seconds
    }, [])
    return (
        <div id='home_container' className={`d-flex justify-content-center w-100 ${isLoaded ? 'fade-in' : ''}`}>
            <FadeInSection>
                <div className='mx-auto d-flex flex-column align-items-center' style={{width: '112%'}}>

                    <h1 className='my-1'>RECENT SCORECARDS:</h1>
                    {
                        ctxScorecards?.map(s => (<UserScorecard isActive={false} scorecard={s} />))
                    }
                    <button className='maj-btn btn btn-gold' onClick={() => navigate(ROUTES.RECENT_FIGHTS)}>View Recent Fights</button>
                </div>
            </FadeInSection>
        </div>
    )
}

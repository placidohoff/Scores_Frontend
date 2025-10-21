import React, { useEffect, useState } from 'react'
import { BoxingMatchCard, FadeInSection } from '../Components'
import { useData } from '../Context/data'
import { useNavigate } from 'react-router-dom';
import { API_ENDPOINTS, API_ROOTS, ENVIRONMENTS, LOCAL_STORAGE, ROUTES } from '../Utils/Constants';
import axios from 'axios';

export default function RecentFights() {
    const { ctxBoxingMatches, ctxFighters, setCTXBoxingMatches, setCTXFighters } = useData()
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
        const getMatches = async () => {
            const { data } = await axios.get(API_BASE_URL + API_ENDPOINT_MATCHES);
            console.log(data)

            {
                (process.env.REACT_APP_ENVIRONMENT === ENVIRONMENTS.DEV || process.env.REACT_APP_ENVIRONMENT === ENVIRONMENTS.PROD) && setCTXBoxingMatches(data.result); /*setMatches(data.result);*/
            }
            {
                process.env.REACT_APP_ENVIRONMENT === ENVIRONMENTS.WORK && setCTXBoxingMatches(data.result); localStorage.setItem(LOCAL_STORAGE.BOXING_MATCHES, JSON.stringify(data.result)) /* setMatches(data); */
            }

            // console.log(ctxRounds)

        }

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

        getMatches();
        getFighters();
        console.log(ctxBoxingMatches)
        const timer = setTimeout(() => {
            setIsLoaded(true);
        }, 500); // 0.5 seconds
    }, [])
    return (
        <div id='home_container' className={`d-flex justify-content-center ${isLoaded ? 'fade-in' : ''}`}>
            <FadeInSection>

                <div>
                    <h1 className='my-5'>Fights to score:</h1>
                    {/* <input type="search" /> */}
                    {
                        ctxBoxingMatches?.map((m, index) => <BoxingMatchCard boxingMatch={m} fighters={ctxFighters} key={index} />)
                        //ONLY MEED TO DISPLAY A FEW AT A TIME. PAGINATION
                    }
                    <button className='maj-btn btn btn-gold mt-4' onClick={() => navigate(ROUTES.RECENT_SCORECARDS)}>View Recent Scorecards</button>
                </div>
            </FadeInSection>
        </div>
    )
}

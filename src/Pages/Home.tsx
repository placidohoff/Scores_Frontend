import React, { useEffect, useState } from 'react'
import { API_ENDPOINTS, API_ROOTS, ENVIRONMENTS } from '../Utils/Constants';
import axios from 'axios';
import { IBoxingMatch } from '../Interfaces/IBoxingMatch';
import { BoxingMatchCard } from '../Components';
import { IFighter } from '../Interfaces/IFighter';

export default function Home() {
  const [matches, setMatches] = useState<IBoxingMatch[]>();
  const [fighters, setFighters] = useState<IFighter[]>([]);

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
        process.env.REACT_APP_ENVIRONMENT === ENVIRONMENTS.DEV || process.env.REACT_APP_ENVIRONMENT === ENVIRONMENTS.PROD && setMatches(data.result)
      }
      {
        process.env.REACT_APP_ENVIRONMENT === ENVIRONMENTS.WORK && setMatches(data)
      }

    }

    const getFighters = async () => {
      const { data } = await axios.get(API_BASE_URL + API_ENDPOINT_FIGHTERS);
      console.log(data, 'fighters')

      {
        process.env.REACT_APP_ENVIRONMENT === ENVIRONMENTS.DEV || process.env.REACT_APP_ENVIRONMENT === ENVIRONMENTS.PROD && setFighters(data.result)
      }
      {
        process.env.REACT_APP_ENVIRONMENT === ENVIRONMENTS.WORK && setFighters(data)
      }
    }

    getMatches();
    getFighters();
  }, [])

  return (
    <div id='home_container'>
      <h1>Recent Scorecards:</h1>
      <h1 className='my-5'>Fights to score:</h1>
      {
        matches?.map((m, index) => <BoxingMatchCard boxingMatch={m} fighters={fighters} key={index} />)
      }
    </div>
  )
}

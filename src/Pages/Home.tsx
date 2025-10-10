import React, { useEffect, useState } from 'react'
import { API_ENDPOINTS, API_ROOTS, ENVIRONMENTS } from '../Utils/Constants';
import axios from 'axios';
import { IBoxingMatch } from '../Interfaces/IBoxingMatch';
import { BoxingMatchCard } from '../Components';

export default function Home() {
  const [matches, setMatches] = useState<IBoxingMatch[]>();

  const API_BASE_URL = process.env.REACT_APP_ENVIRONMENT === ENVIRONMENTS.DEV
    ? API_ROOTS.DEV
    : process.env.REACT_APP_ENVIRONMENT === ENVIRONMENTS.PROD
      ? API_ROOTS.PROD
      : API_ROOTS.WORK

  const API_ENDPOINT = process.env.REACT_APP_ENVIRONMENT === ENVIRONMENTS.DEV
    ? API_ENDPOINTS.BOXING_MATCHES.DEV
    : process.env.REACT_APP_ENVIRONMENT === ENVIRONMENTS.PROD
      ? API_ENDPOINTS.BOXING_MATCHES.PROD
      : API_ENDPOINTS.BOXING_MATCHES.WORK

  useEffect(() => {
    const getMatches = async () => {
      const { data } = await axios.get(API_BASE_URL + API_ENDPOINT);
      console.log(data)

      setMatches(data.result)
    }

    getMatches();
  }, [])

  return (
    <div>
      <h1>Recent Scorecards:</h1>
      <h1 className='my-5'>Fights to score:</h1>
      {
        matches?.map((m, index) => <BoxingMatchCard boxingMatch={m} key={index} />)
      }
    </div>
  )
}

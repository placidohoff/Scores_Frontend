import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { useData } from '../Context/data'
import { useLocation, useNavigate } from 'react-router-dom'
import { API_ENDPOINTS, API_ROOTS, ENVIRONMENTS, ROUTES } from '../Utils/Constants'

export default function CreateRounds() {
  const [scorecardID, setScorecardID] = useState()
  const [boxingMatchID, setBoxingMatchID] = useState()
  const [numberRoundsToCreate, setNumberRoundsToCreate] = useState()
  const { ctxBoxingMatches } = useData()
  const [userID, setUserID] = useState()
  const location = useLocation()
  const navigate = useNavigate()

  const API_BASE_URL =
    process.env.REACT_APP_ENVIRONMENT === ENVIRONMENTS.DEV
      ? API_ROOTS.DEV
      : process.env.REACT_APP_ENVIRONMENT === ENVIRONMENTS.PROD
        ? API_ROOTS.PROD
        : API_ROOTS.WORK

  const API_ENDPOINT_CREATE_ROUNDS =
    process.env.REACT_APP_ENVIRONMENT === ENVIRONMENTS.DEV
      ? API_ENDPOINTS.ROUNDS.CREATE_ROUNDS_DEV
      : process.env.REACT_APP_ENVIRONMENT === ENVIRONMENTS.PROD
        ? API_ENDPOINTS.ROUNDS.CREATE_ROUNDS_DEV
        : API_ENDPOINTS.ROUNDS.WORK

  useEffect(() => {
    // Extract data passed via navigate
    // console.log('testing')
    const { scorecardID, userID, boxingMatchID } = location.state || {}
    if (!scorecardID || !boxingMatchID) return

    // console.log(location.state, 'STATE')
    setScorecardID(scorecardID)
    setUserID(userID)
    setBoxingMatchID(boxingMatchID)

    // Find boxing match
    const boxingMatch = ctxBoxingMatches.find(b => b.boxingMatch_ID === boxingMatchID)
    const rounds = boxingMatch?.scheduledRounds || 0
    // setNumberRoundsToCreate(rounds)
    // console.log(rounds, 'ROYUNDS')
    // POST request once values are available
    if (rounds > 0) {
      createRoundsToScore(rounds, scorecardID)
    }
  }, [])

  const createRoundsToScore = async (rounds: any, scorecardID: any) => {
    try {
      const formData = new FormData()
      formData.append('roundsToCreate', rounds)
      formData.append('scorecardID', scorecardID)

      const response = await axios.post(
        `${API_BASE_URL}${API_ENDPOINT_CREATE_ROUNDS}`,
        formData
      )

      if (response.data.isSuccess) {
        console.log('Rounds created:', response.data.result)
        // Optionally redirect or update UI
        navigate(ROUTES.SCORE_ROUND, {
                state: {
                  userID,
                  scorecardID
                }
              });
      } else {
        console.error('Error creating rounds:', response.data.errorMessages)
      }
    } catch (error: any) {
      console.error('Error creating rounds:', error)
    }
  }

  return <div>Please wait, creating details for your scorecard...</div>
}

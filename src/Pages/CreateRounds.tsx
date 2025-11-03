import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { useData } from '../Context/data'
import { useLocation, useNavigate } from 'react-router-dom'
import { API_ENDPOINTS, API_ROOTS, ENVIRONMENTS, ROUTES } from '../Utils/Constants'
import { useModelsUtils } from '../Utils/useModelsUtils'
import { IBoxingMatch } from '../Interfaces/IBoxingMatch'
// import { getFighterByName, getFighterByScorecardID, getFighterFromRoundID, getScorecardByScorecardID } from '../Utils/ModelsRepo'
// import { RepoUtil } from '../Utils/useModelsUtils'

export default function CreateRounds() {
  const [scorecardID, setScorecardID] = useState<number>()
  const [boxingMatchID, setBoxingMatchID] = useState<number>()
  const [numberRoundsToCreate, setNumberRoundsToCreate] = useState<number>()
  const { ctxBoxingMatches } = useData()
  const [userID, setUserID] = useState()
  const location = useLocation()
  const navigate = useNavigate()

  const { getFighterByScorecardID, getScorecardByScorecardID, loading } = useModelsUtils()

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

  // const createRoundsToScore = async (rounds: any, scorecardID: any) => {
  //   try {
  //     const formData = new FormData()
  //     formData.append('roundsToCreate', rounds)
  //     formData.append('scorecardID', scorecardID)

  //     const response = await axios.post(
  //       `${API_BASE_URL}${API_ENDPOINT_CREATE_ROUNDS}`,
  //       formData
  //     )

  //     const scorecard = getScorecardByScorecardID(scorecardID)
  //     const fighterA = getFighterByScorecardID(scorecardID, "fighterA")
  //     const fighterB = getFighterByScorecardID(scorecardID, "fighterB")

  //     console.log(scorecard, fighterA, fighterB)

  //     if (response.data.isSuccess) {
  //       console.log('Rounds created:', response.data.result)
  //       navigate(ROUTES.SCORE_FIGHT, {
  //         state: {
  //           rounds: rounds,
  //           scorecard,
  //           fighterA,
  //           fighterB
  //         }
  //       });

  //     } else {
  //       console.error('Error creating rounds:', response.data.errorMessages)
  //     }
  //   } catch (error: any) {
  //     console.error('Error creating rounds:', error)
  //   }
  // }

  const createRoundsToScore = async (rounds: any, scorecardID: number) => {
    try {
      // Wait until data from the hook is loaded
      if (loading) {
        console.warn("Data is still loading...");
        return;
      }

      // Safely access data
      const scorecard = getScorecardByScorecardID(scorecardID);
      const fighterA = getFighterByScorecardID(scorecardID, "fighterA");
      const fighterB = getFighterByScorecardID(scorecardID, "fighterB");

      console.log("Resolved Data:", { scorecard, fighterA, fighterB });

      if (!scorecard || !fighterA || !fighterB) {
        console.error("Missing required data for rounds creation");
        return;
      }

      // ✅ Once all data is ready, continue your API call or navigation logic
      // Example:
      const formData = new FormData()
      formData.append('roundsToCreate', rounds)
      formData.append('scorecardID', scorecardID.toString())

      const response = await axios.post(
        `${API_BASE_URL}${API_ENDPOINT_CREATE_ROUNDS}`,
        formData
      )

      if (response.data.isSuccess) {
        navigate(ROUTES.SCORE_FIGHT, {
          state: { rounds, scorecard, fighterA, fighterB }
        });
      }

    } catch (error) {
      console.error("Error creating rounds:", error);
    }
  };

  useEffect(() => {
    const { scorecardID, userID, boxingMatchID } = (location.state as {
      scorecardID?: number;
      userID?: number;
      boxingMatchID?: number;
    }) || {};

    if (!scorecardID || !boxingMatchID) return;

    setScorecardID(scorecardID);
    // setUserID(userID ?? null);
    setBoxingMatchID(boxingMatchID);

    const boxingMatch: IBoxingMatch | undefined = ctxBoxingMatches.find(
      (b) => b.boxingMatch_ID === boxingMatchID
    );

    const rounds = boxingMatch?.scheduledRounds || 0;
    setNumberRoundsToCreate(rounds);

    // Only trigger once data is ready (no missing info)
    if (rounds > 0 && scorecardID && !loading) {
      createRoundsToScore(rounds, scorecardID);
    }
  }, [location.state, ctxBoxingMatches, loading]);

  // ✅ Handle loading / error UI
  if (loading) return <div>Loading match data...</div>;
  // if (error) return <div className="text-danger">Error loading data: {error}</div>;



  return <div>Please wait, creating details for your scorecard...</div>
}

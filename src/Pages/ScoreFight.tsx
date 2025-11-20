import React, { useEffect, useState } from 'react'
import { Form, useLocation, useNavigate } from 'react-router-dom'
import { CommentsForScorecard, FadeInSection, ScoreRound, UserScorecard } from '../Components'
import { IScorecard } from '../Interfaces/IScorecard'
import { IRound } from '../Interfaces/IRound';
import { useData } from '../Context/data';
import { IBoxingMatch } from '../Interfaces/IBoxingMatch';
import { IFighter } from '../Interfaces/IFighter';
import { API_ENDPOINTS, API_ROOTS, EARLY_STOP_RESULT, ENVIRONMENTS, ROUTES } from '../Utils/Constants';
import axios from 'axios';
import { FaPlus } from "react-icons/fa6";
import { IApiResponse } from '../Interfaces/IApiResponse';
import UserScorecardBravo from '../Components/UserScorecardBravo';
import { useAuth } from '../Context/auth';


export default function ScoreFight() {
  const location = useLocation()
  const { ctxFighters, ctxBoxingMatches } = useData()
  const { auth } = useAuth()



  const [scorecard, setScorecard] = useState<IScorecard>(location.state.scorecard)
  const [rounds, setRounds] = useState<IRound[]>(location.state.rounds)
  const [activeRound, setActiveRound] = useState<IRound>()
  const [fighterA, setFighterA] = useState<IFighter>(location.state.fighterA)
  const [fighterB, setFighterB] = useState<IFighter>(location.state.fighterB)
  const [boxingMatch, setBoxingMatch] = useState<IBoxingMatch>()
  const [roundScoreCount, setRoundScoreCount] = useState(0)
  const navigate = useNavigate()
  // console.log(scorecard)

  const API_BASE_URL =
    process.env.REACT_APP_ENVIRONMENT === ENVIRONMENTS.DEV
      ? API_ROOTS.DEV
      : process.env.REACT_APP_ENVIRONMENT === ENVIRONMENTS.PROD
        ? API_ROOTS.PROD
        : API_ROOTS.WORK

  const API_ENDPOINT_ROUNDS =
    process.env.REACT_APP_ENVIRONMENT === ENVIRONMENTS.DEV
      ? API_ENDPOINTS.ROUNDS.DEV
      : process.env.REACT_APP_ENVIRONMENT === ENVIRONMENTS.PROD
        ? API_ENDPOINTS.ROUNDS.PROD
        : API_ENDPOINTS.ROUNDS.WORK

  const API_ENDPOINT_COMMENTS =
    process.env.REACT_APP_ENVIRONMENT === ENVIRONMENTS.DEV
      ? API_ENDPOINTS.COMMENTS.DEV
      : process.env.REACT_APP_ENVIRONMENT === ENVIRONMENTS.PROD
        ? API_ENDPOINTS.COMMENTS.PROD
        : API_ENDPOINTS.COMMENTS.WORK

  useEffect(() => {
    // console.log(location.state, 'STATE')
    setScorecard(location.state.scorecard)
    findActiveRound();
    findActiveFighters();

  }, [])

  useEffect(() => {
    //TODO: GET UPDATED ROUNDS FROM DB
    const getUpdates = async () => {
      const data: IApiResponse<IRound[]> = await axios.get(API_BASE_URL + API_ENDPOINT_ROUNDS)

      setRounds(data.result)

      // const roundsForThisCard = rounds.filter(r => r.scorecard_ID === scorecard.scorecard_ID)

      // navigate(ROUTES.SCORE_FIGHT, {
      //     state: { scorecard: scorecard, rounds: roundsForThisCard, fighterA: fighterA, fighterB: fighterB }

      // })
      // window.location.reload()
    }

    getUpdates()
    findActiveRound()
    //SET THE NEW ACTIVE ROUND
  }, [roundScoreCount])

  const handleSubmitScore = () => {
    //POST ROUND TO THE "PUT" ENDPOINT
    //INCREMENT THE "ACTIVEROUND" STATE, PASS IT TO THE SCORE-ROUND-COMPONENT AND RE-RENDER
  }

  const submitScore = async (fighterAScore: string, fighterBScore: string, comments: string) => {
    // alert('testing...')    
    try {
      //COMMENTS ENDPOINT
      if (comments && comments.trim().length > 0) {
        let data = new FormData();
        data.append("Round_ID", String(activeRound?.round_ID));
        data.append("User_ID", String(auth.id));
        data.append("Thoughts", comments);
        data.append("RoundNumber", String(activeRound?.roundNumber))

        const commentResponse = await axios.post(API_BASE_URL + API_ENDPOINT_COMMENTS, data, {
          headers: { 'Content-Type': 'multipart/form-data' },
        })

        if(commentResponse.data.isSuccess){
          console.log('Comment aded sucessfully', commentResponse.data.result)
        }else{
          console.error('Error updating comments:', commentResponse.data.message);
        }
      }

      //ROUND ENDPOINT
      let data = new FormData();
      data.append("Scorecard_ID"
        , String(scorecard.scorecard_ID));
      data.append("RoundNumber", String(activeRound?.roundNumber ?? 1));
      data.append("FighterA_ID", String(activeRound?.fighterA_ID ?? ''));
      data.append("FighterB_ID", String(activeRound?.fighterB_ID ?? ''));
      data.append("FighterA_Score", fighterAScore);
      data.append("FighterB_Score", fighterBScore);
      // data.append("Comments", comments ?? '');

      const response = await axios.put(API_BASE_URL + API_ENDPOINT_ROUNDS, data, {
        headers: { 'Content-Type': 'multipart/form-data' },
      })

      if (response.data.isSuccess) {
        console.log('Round updated successfully:', response.data.result);
        //Increment to re-render what is needed:
        setRoundScoreCount(roundScoreCount + 1)
        window.location.reload()

      }
      else {
        console.error('Error updating round:', response.data.message);
      }

      //TODO: If the fighter A or B score is 100 or -100, this indicates that the fight was stopped early.
      if(fighterAScore === "Win" || fighterBScore === "Def"){
       //HIT API ENDPOINT TO DELETE THE REST OF THE ROUNDS OF SCORECARDS THAT ARE GOING UNUSED: 
      }

    } catch (error) {
      console.error('PUT request failed:', error);
    }

  }

  const findActiveFighters = () => {
    ctxBoxingMatches.some(b => {
      // console.log(b.boxingMatch_ID, 'BID', scorecard.boxingMatch_ID)
      if (b.boxingMatch_ID === scorecard.boxingMatch_ID) {
        // console.log('FOUND?')
        setBoxingMatch(b)
        return true
      }
    })
    ctxFighters.some(f => {
      if (f.fighter_ID == boxingMatch?.fighterA_ID) {
        setFighterA(f)
        return true
      }
    })

    ctxFighters.some(f => {
      if (f.fighter_ID == boxingMatch?.fighterB_ID) {
        setFighterB(f)
        return true
      }
    })

    // console.log(boxingMatch, 'MATCH')

  }

  const findActiveRound = async () => {

    const data = await axios.get(API_BASE_URL + API_ENDPOINT_ROUNDS)

    // console.log(data.data.result, 'FINDING')

    let roundsFromDB: IRound[] = data.data.result

    let roundsForThisCard = roundsFromDB.filter(r => r.scorecard_ID === scorecard.scorecard_ID)

    if (roundsForThisCard) {
      roundsForThisCard.sort((a, b) => a.roundNumber - b.roundNumber)
      roundsForThisCard.some(r => {
        if (!r.isScored) {
          setActiveRound(r)
          return true
        }
      })
    }

  }


  return (
    <div>
      ScoreFight
      <div className='mx-auto' style={{ maxWidth: '90%' }}>
        <FadeInSection>
          <UserScorecardBravo isActive={false} scorecard={location.state.scorecard} />
        </FadeInSection>
        {/* <FadeInSection>
                  <CommentsForScorecard fighterAName={fighterA.firstname + ' ' + fighterA.lastname} fighterBName={fighterB.firstname + ' ' + fighterB.lastname} scorecard={location.state.scorecard} />
                </FadeInSection> */}
      </div>
      <FadeInSection>
        <ScoreRound handleScoreRound={submitScore} fighterA={fighterA} fighterB={fighterB} scorecard={scorecard} round={activeRound} />
      </FadeInSection>
    </div>
  )
}

/* VERSION WITH THE UPDATES WORKING VIA CHAT GPT BUT GAVE ERRORS WHEN CREATING A NEW CARD 

import React, { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { FadeInSection, ScoreRound, UserScorecard } from '../Components'
import { IScorecard } from '../Interfaces/IScorecard'
import { IRound } from '../Interfaces/IRound'
import { useData } from '../Context/data'
import { IBoxingMatch } from '../Interfaces/IBoxingMatch'
import { IFighter } from '../Interfaces/IFighter'
import { API_ENDPOINTS, API_ROOTS, ENVIRONMENTS } from '../Utils/Constants'
import axios from 'axios'
import { IApiResponse } from '../Interfaces/IApiResponse'

export default function ScoreFight() {
  const location = useLocation()
  const navigate = useNavigate()
  const { ctxFighters, ctxBoxingMatches } = useData()

  const [scorecard, setScorecard] = useState<IScorecard>(location.state.scorecard)
  const [rounds, setRounds] = useState<IRound[]>(location.state.rounds)
  const [activeRound, setActiveRound] = useState<IRound>()
  const [fighterA, setFighterA] = useState<IFighter>(location.state.fighterA)
  const [fighterB, setFighterB] = useState<IFighter>(location.state.fighterB)
  const [boxingMatch, setBoxingMatch] = useState<IBoxingMatch>()
  const [refreshTrigger, setRefreshTrigger] = useState(0)

  const API_BASE_URL =
    process.env.REACT_APP_ENVIRONMENT === ENVIRONMENTS.DEV
      ? API_ROOTS.DEV
      : process.env.REACT_APP_ENVIRONMENT === ENVIRONMENTS.PROD
      ? API_ROOTS.PROD
      : API_ROOTS.WORK

  const API_ENDPOINT_ROUNDS =
    process.env.REACT_APP_ENVIRONMENT === ENVIRONMENTS.DEV
      ? API_ENDPOINTS.ROUNDS.DEV
      : process.env.REACT_APP_ENVIRONMENT === ENVIRONMENTS.PROD
      ? API_ENDPOINTS.ROUNDS.PROD
      : API_ENDPOINTS.ROUNDS.WORK

  // Initial load
  useEffect(() => {
    findActiveRound(location.state.rounds)
    findActiveFighters()
  }, [])

  // Refresh rounds from DB when triggered
  useEffect(() => {
    const getUpdatedRounds = async () => {
      try {
        const response = await axios.get<IApiResponse<IRound[]>>(API_BASE_URL + API_ENDPOINT_ROUNDS)
        const allRounds = response.data.result || []

        const roundsForThisCard = allRounds.filter(r => r.scorecard_ID === scorecard.scorecard_ID)
        setRounds(roundsForThisCard)
        findActiveRound(roundsForThisCard)
      } catch (error) {
        console.error('Failed to refresh rounds:', error)
      }
    }

    if (refreshTrigger > 0) {
      getUpdatedRounds()
    }
  }, [refreshTrigger])

  const findActiveFighters = () => {
    const match = ctxBoxingMatches.find(b => b.boxingMatch_ID === scorecard.boxingMatch_ID)
    if (!match) return

    setBoxingMatch(match)
    const fA = ctxFighters.find(f => f.fighter_ID === match.fighterA_ID)
    const fB = ctxFighters.find(f => f.fighter_ID === match.fighterB_ID)
    if (fA) setFighterA(fA)
    if (fB) setFighterB(fB)
  }

  const findActiveRound = (roundList: IRound[]) => {
    const sorted = [...roundList].sort((a, b) => a.roundNumber - b.roundNumber)
    const next = sorted.find(r => !r.isScored)
    setActiveRound(next)
  }

  const submitScore = async (fighterAScore: string, fighterBScore: string, comments: string) => {
    try {
      const data = new FormData()
      data.append('Scorecard_ID', String(scorecard.scorecard_ID))
      data.append('RoundNumber', String(activeRound?.roundNumber ?? 1))
      data.append('FighterA_ID', String(activeRound?.fighterA_ID ?? ''))
      data.append('FighterB_ID', String(activeRound?.fighterB_ID ?? ''))
      data.append('FighterA_Score', fighterAScore)
      data.append('FighterB_Score', fighterBScore)
      data.append('Comments', comments ?? '')

      const response = await axios.put(API_BASE_URL + API_ENDPOINT_ROUNDS, data, {
        headers: { 'Content-Type': 'multipart/form-data' },
      })

      if (response.data.isSuccess) {
        console.log('✅ Round updated successfully:', response.data.result)
        // Trigger round refresh (which will fetch updated data)
        setRefreshTrigger(prev => prev + 1)
        // window.location.reload()
      } else {
        console.error('Error updating round:', response.data.message)
      }
    } catch (error) {
      console.error('PUT request failed:', error)
    }
  }

  // If all rounds are done, navigate back automatically
  useEffect(() => {
    if (rounds.length > 0 && rounds.every(r => r.isScored)) {
      navigate('/user-scorecards') // or ROUTES.USER_SCORECARDS
    }
  }, [rounds])

  return (
    <div>
      <div className='mx-auto' style={{ maxWidth: '90%' }}>
        <FadeInSection>
          <UserScorecard isActive={false} scorecard={scorecard} />
        </FadeInSection>
      </div>

      <FadeInSection>
        {activeRound ? (
          <ScoreRound
            handleScoreRound={submitScore}
            fighterA={fighterA}
            fighterB={fighterB}
            scorecard={scorecard}
            round={activeRound}
          />
        ) : (
          <p className='text-center mt-4'>✅ All rounds scored!</p>
        )}
      </FadeInSection>
    </div>
  )
}



*/
import React, { useEffect, useState } from 'react'
import { IBoxingMatch } from '../Interfaces/IBoxingMatch'
import { IFighter } from '../Interfaces/IFighter'
import { useNavigate } from 'react-router-dom'
import { useData } from '../Context/data'
import { useAuth } from '../Context/auth'
import jwtDecode from 'jwt-decode'
import { IAuth } from '../Interfaces/IAuth'
import { ROUTES } from '../Utils/Constants'

interface Props {
  boxingMatch: IBoxingMatch
  fighters: IFighter[]
}



export default function BoxingMatchCard(props: Props) {
  const { fighters, boxingMatch } = props
  const [fighterAName, setFighterAName] = useState('')
  const [fighterBName, setFighterBName] = useState('')
  const [fighterA, setFighterA] = useState<IFighter>()
  const [fighterB, setFighterB] = useState<IFighter>()
  const navigate = useNavigate()
  const { ctxScorecards, ctxRounds } = useData()
  const { auth } = useAuth()
  let decoded: IAuth | null = null

  if (auth?.token) {
    try {
      decoded = jwtDecode<IAuth>(auth.token)
    } catch (err) {
      console.error("Invalid JWT token", err)
      // Optional: redirect to login or clear token if necessary
    }
  }

  useEffect(() => {
    fighters.forEach((f) => {
      if (f.fighter_ID === boxingMatch.fighterA_ID){
        setFighterAName(`${f.firstname} ${f.lastname}`)
        setFighterA(f);
      }
        
      if (f.fighter_ID === boxingMatch.fighterB_ID){
        setFighterBName(`${f.firstname} ${f.lastname}`)
        setFighterB(f)
      }
        
    })


  }, [])

  const checkScorecardExist = () => {
    // console.log(decoded)
    const existingCard = ctxScorecards.find(s => s.boxingMatch_ID == boxingMatch.boxingMatch_ID && s.user_ID == decoded?.id)
    if (existingCard) {
      //FIND ROUNDS FOR THIS CARD:

      const roundsForThisCard = ctxRounds.filter(r => r.scorecard_ID === existingCard.scorecard_ID)
      // setRoundsForThisCard(rounds);
      // console.log(rounds)

      navigate(ROUTES.SCORE_FIGHT, {
        state: { scorecard: existingCard, rounds: roundsForThisCard, fighterA: fighterA, fighterB: fighterB }
        //state: { scorecard: scorecard, rounds: roundsForThisCard, fighterA: fighterA, fighterB: fighterB }
      })
    } else {
      navigate(ROUTES.CREATE_CARD, {
        state: {
          fighterAName,
          fighterBName,
          boxingMatchID: boxingMatch.boxingMatch_ID,
        },
      })
    }
  }

  const createNewScorecard = () => {
    navigate('/create-scorecard', {
      state: {
        fighterAName,
        fighterBName,
        boxingMatchID: boxingMatch.boxingMatch_ID,
      },
    })
  }

  return (
    <div
      onClick={() => checkScorecardExist()}
      className="boxingMatchCard"
      style={{ borderBottom: '1px solid' }}
    >
      <p className="mb-0">
        {fighterAName} vs {fighterBName}
      </p>
    </div>
  )
}



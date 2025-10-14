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
  const navigate = useNavigate()
  const { ctxScorecards } = useData()
  const { auth } = useAuth()
  const decoded:IAuth = jwtDecode(auth.token)

  useEffect(() => {
    fighters.forEach((f) => {
      if (f.fighter_ID === boxingMatch.fighterA_ID)
        setFighterAName(`${f.firstname} ${f.lastname}`)
      if (f.fighter_ID === boxingMatch.fighterB_ID)
        setFighterBName(`${f.firstname} ${f.lastname}`)
    })


  }, [])

  const checkScorecardExist = () => {
    // console.log(decoded)
    const existingCard = ctxScorecards.find(s =>  s.boxingMatch_ID == boxingMatch.boxingMatch_ID && s.user_ID == decoded.id )
    if(existingCard){
      navigate(ROUTES.SCORE_FIGHT, {
        state: {scorecard: existingCard}
      })
    }else{
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



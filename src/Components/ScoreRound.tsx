import React from 'react'
import { IScorecard } from '../Interfaces/IScorecard'
import { IRound } from '../Interfaces/IRound'

interface Props{
    scorecard: IScorecard,
    round: IRound[] 
}
export default function ScoreRound(props: Props) {
    const getRounds = () => {

    }
  return (
    <div>ScoreRound</div>
  )
}

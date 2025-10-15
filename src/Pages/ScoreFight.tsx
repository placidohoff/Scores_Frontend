import React, { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'
import { UserScorecard } from '../Components'
import { IScorecard } from '../Interfaces/IScorecard'
import { IRound } from '../Interfaces/IRound';

interface IScoreRoundsProps {
    scorecard: IScorecard;
    round: IRound | undefined
}

export default function ScoreFight() {
    const location = useLocation()

    console.log(location.state.scorecard, 'STATE')

    const [scorecard, setScorecard] = useState(location.state.scorecard)
    const [rounds, setRounds] = useState(location.state.rounds)
    const [activeRound, setActiveRound] = useState<IRound>()
    // console.log(scorecard)

    useEffect(() => {
        setScorecard(location.state)
    }, [])

    const handleSubmitScore = () => {
        //POST ROUND TO THE "PUT" ENDPOINT
        //INCREMENT THE "ACTIVEROUND" STATE, PASS IT TO THE SCORE-ROUND-COMPONENT AND RE-RENDER
    }

    const ScoreRound = (props: IScoreRoundsProps) => {
        return (
            <div>
                Score Round
                <button>Submit Score</button>
            </div>
        )
    }
    return (
        <div>
            ScoreFight
            <div className='mx-auto' style={{ maxWidth: '90%' }}>
                <UserScorecard isActive={false} scorecard={location.state.scorecard} />
            </div>
            <ScoreRound scorecard={scorecard} round={activeRound} />
        </div>
    )
}

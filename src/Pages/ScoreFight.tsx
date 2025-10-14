import React, { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'
import { UserScorecard } from '../Components'
import { IScorecard } from '../Interfaces/IScorecard'

export default function ScoreFight() {
    const location = useLocation()

    // console.log(location.state, 'STATE')

    const [scorecard, setScorecard] = useState(location.state)
    // console.log(scorecard)

    useEffect(() => {
        setScorecard(location.state)
    }, [])
    return (
        <div>
            ScoreFight
            <div className='mx-auto' style={{maxWidth: '90%'}}>
                <UserScorecard isActive={false} scorecard={location.state.scorecard} />
            </div>
            TODO: RENDER SCORE_ROUND_COMPONENT
        </div>
    )
}

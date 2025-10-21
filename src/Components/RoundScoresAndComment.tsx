import React from 'react'
import { IRound } from '../Interfaces/IRound'

interface Props {
    round: IRound
}

export default function RoundScoresAndComment(props: Props) {
    const { round } = props
    return (
        <div className="d-flex flex-column p-2 justify-content-evenly" style={{ border: '1px solid' }}>
            {/* <p style={{ position: 'absolute', marginTop: '-140px', marginLeft: '14px' }}>{round.roundNumber}</p> */}
            <p style={{ position: 'absolute', marginTop: '-112px', marginLeft: '10px' }}>{round.roundNumber}</p>
            <p>{round.isScored? round.fighterA_Score : ' --- '}</p>
            <p>{round.isScored? round.fighterB_Score : ' --- '}</p>
            <p style={{ position: 'absolute', marginTop: '80px' }}>&nbsp;</p>

        </div>
    )
}

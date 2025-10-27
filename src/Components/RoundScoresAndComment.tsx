import React from 'react'
import { IRound } from '../Interfaces/IRound'

interface Props {
    round: IRound
    isBravo?: boolean
}

export default function RoundScoresAndComment(props: Props) {
    const { round, isBravo } = props
    return (
        <div className="scoreround-cell d-flex flex-column p-2 justify-content-evenly" style={{ border: '1px solid' }}>
            {/* <p style={{ position: 'absolute', marginTop: '-140px', marginLeft: '14px' }}>{round.roundNumber}</p> */}
            { isBravo && <p style={{ position: 'absolute', marginTop: '-120px', marginLeft: '10px' }}>{round.roundNumber}</p>}
            <p>{round.isScored ? round.fighterA_Score : ' --- '}</p>
            <p>{round.isScored ? round.fighterB_Score : ' --- '}</p>
            {isBravo && <p className='comment-icon' style={{ position: 'absolute', marginTop: '138px'}}>
                <i style={{fontSize: 'x-large'}} className="comment-icon bi bi-chat-text"></i>
            </p>}

        </div>
    )
}

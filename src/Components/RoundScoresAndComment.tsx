import React, { useEffect, useState } from 'react'
import { IRound } from '../Interfaces/IRound'
import { useData } from '../Context/data'
import { IComment } from '../Interfaces/IComment'

interface Props {
    round: IRound
    isBravo?: boolean
}

export default function RoundScoresAndComment(props: Props) {
    const { round, isBravo } = props
    const { ctxComments } = useData()
    const [isRoundComment, setIsRoundComment] = useState(false)
    const [roundComment, setRoundComment] = useState<IComment>()

    useEffect(() => {
        if (ctxComments) {
            ctxComments.forEach(c => {
                if (c.round_ID === round.round_ID){
                    setIsRoundComment(true)
                    setRoundComment(c)
                }
            })
        }
    }, [ctxComments])

    const ViewComment = () => {
        return (
            <div>
                HELLO, {roundComment?.comments}
            </div>
        )
    }

    const openComments = () => {
        alert(roundComment?.comments)
    }

    return (
        <div className="scoreround-cell d-flex flex-column p-2 justify-content-evenly" style={{ border: '1px solid' }}>
            {/* <p style={{ position: 'absolute', marginTop: '-140px', marginLeft: '14px' }}>{round.roundNumber}</p> */}
            {isBravo && <p style={{ position: 'absolute', marginTop: '-120px', marginLeft: '10px' }}>{round.roundNumber}</p>}
            <p>{round.isScored ? round.fighterA_Score : ' --- '}</p>
            <p>{round.isScored ? round.fighterB_Score : ' --- '}</p>

            {isRoundComment && isBravo && 
            
            <p onClick={() => openComments()} className='comment-icon' style={{ position: 'absolute', marginTop: '138px' }}>
                <i style={{ fontSize: 'x-large' }} className="comment-icon bi bi-chat-text"></i>
            </p>}

        </div>
    )
}

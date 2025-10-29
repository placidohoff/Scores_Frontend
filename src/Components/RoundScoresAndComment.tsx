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
    const [showModal, setShowModal] = useState(false)

    useEffect(() => {
        if (ctxComments) {
            const comment = ctxComments.find(c => c.round_ID === round.round_ID)
            if (comment) {
                setIsRoundComment(true)
                setRoundComment(comment)
            }
        }
    }, [ctxComments, round.round_ID])

    const openComments = () => {
        setShowModal(true)
    }

    const closeModal = () => {
        setShowModal(false)
    }

    return (
        <div className="scoreround-cell d-flex flex-column p-2 justify-content-evenly" style={{ border: '1px solid' }}>
            {isBravo && (
                <p style={{ position: 'absolute', marginTop: '-120px', marginLeft: '10px' }}>
                    {round.roundNumber}
                </p>
            )}
            <p>{round.isScored ? round.fighterA_Score : ' --- '}</p>
            <p>{round.isScored ? round.fighterB_Score : ' --- '}</p>

            {isRoundComment && isBravo && (
                <p
                    onClick={openComments}
                    className="comment-icon"
                    style={{ position: 'absolute', marginTop: '138px', cursor: 'pointer' }}
                >
                    <i style={{ fontSize: 'x-large' }} className="bi bi-chat-text"></i>
                </p>
            )}

            {/* Modal */}
            {showModal && (
                <div
                    className="modal-overlay"
                    style={{
                        position: 'fixed',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        backgroundColor: 'rgba(0,0,0,0.5)',
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        zIndex: 9999,
                    }}
                >
                    <div
                        className="modal-content"
                        style={{
                            backgroundColor: '#000',
                            padding: '20px',
                            borderRadius: '10px',
                            width: '300px',
                            textAlign: 'center',
                            boxShadow: '0 2px 10px rgba(0,0,0,0.2)',
                            border: '1px solid'
                        }}
                    >
                        <h5 style={{ marginBottom: '10px' }}>Round Comment</h5>
                        <p style={{ marginBottom: '20px' }}>
                            {roundComment?.comments || 'No comment available.'}
                        </p>
                        <div>
                            <button
                                onClick={closeModal}
                                className="btn btn-primary"
                                style={{ padding: '8px 20px', borderRadius: '5px' }}
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

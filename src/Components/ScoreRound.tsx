import React, { useEffect, useState } from 'react'
import { IScorecard } from '../Interfaces/IScorecard'
import { IRound } from '../Interfaces/IRound'
import { useData } from '../Context/data';
import { API_ENDPOINTS, API_ROOTS, EARLY_STOP_RESULT, ENVIRONMENTS } from '../Utils/Constants';
import { IFighter } from '../Interfaces/IFighter';
import axios from 'axios';

interface IScoreRoundsProps {
    scorecard: IScorecard;
    round: IRound | undefined;
    fighterA: IFighter;
    fighterB: IFighter;
    handleScoreRound: Function;
}

export default function ScoreRound(props: IScoreRoundsProps) {
    const { scorecard, round, fighterA, fighterB, handleScoreRound } = props
    const { setCTXRounds } = useData()
    const [fighterAScore, setFighterAScore] = useState<string>('10')
    const [fighterBScore, setFighterBScore] = useState<string>('10')
    const [comments, setComments] = useState<string>()
    const [isPosted, setIsPosted] = useState(false)
    const [isFighterADefeated, setIsFighterADefeated] = useState(false)
    const [isFighterAWon, setIsFighterAWon] = useState(false)
    const [isFighterBDefeated, setIsFighterBDefeated] = useState(false)
    const [isFighterBWon, setIsFighterBWon] = useState(false)
    const [isFightOver, setIsFightOver] = useState(false)
    const [showModal, setShowModal] = useState(false)
    const [winnerName, setWinnerName] = useState('')
    const [loserName, setLoserName] = useState();
    const [earlyFinishResult, setEarlyFinishResult] = useState('FighterA');

    useEffect(() => {

    }, [isPosted])



    const handleChangeScore = (e: React.ChangeEvent<HTMLInputElement>, id: string) => {
        let score = e.target.value;


        if (Number.parseInt(e.target.value) > 10) {
            score = '10';
        } else if (Number.parseInt(e.target.value) < 6) {
            score = '6'
        }
        if (id === "scoreA") {
            setFighterAScore(score)
        }

        if (id === "scoreB") {
            setFighterBScore(score)
        }
    }

    const scoreUp = (id: string) => {

        setIsFightOver(false)

        if (id == "scoreA") {
            // setIsFighterADefeated(false)
            // setIsFighterBWon(false)
            let score = Number.parseInt(fighterAScore) + 1;
            if (score > 10) {
                score = 10;
                setEarlyFinishResult(EARLY_STOP_RESULT.FIGHTER_A)
                theWinnerIs('fighterA')
            }
            // else if(score < 6){
            //     setFighterAScore(score.toString())
            //     theWinnerIs('fighterB')
            // }
            else {
                setIsFighterADefeated(false)
                setIsFighterBWon(false)
                setIsFightOver(false)
                setFighterAScore(score.toString())

            }
            setFighterAScore(score.toString())
        }
        else if (id == "scoreB") {
            let score = Number.parseInt(fighterBScore) + 1;

            if (score > 10) {
                score = 10;
                setEarlyFinishResult(EARLY_STOP_RESULT.FIGHTER_B)
                theWinnerIs('fighterB')
            }
            setFighterBScore(score.toString())
        }
    }

    const scoreDown = (id: string) => {

        setIsFightOver(false)

        if (id == "scoreA") {
            let score = Number.parseInt(fighterAScore) - 1;
            if (score < 6) {
                score = 6
                setFighterAScore(score.toString())

                theWinnerIs('fighterB')
                setEarlyFinishResult(EARLY_STOP_RESULT.FIGHTER_B)
                // setIsFighterADefeated(true)
                // setIsFighterBWon(true)
                // setIsFightOver(true)
                // setFighterAScore('DEF') //MUST MAKE THE TEXT BOX APPEAR INSTEAD OF THE NUMBER BOX TO PUT THE 'DEF'
            } else if (score > 10) {
                score = 10
                setFighterAScore(score.toString())
                theWinnerIs('fighterA')
            }

            else {
                // setIsFighterADefeated(false)
                // setIsFighterBWon(false)
                // setIsFightOver(false)
                setFighterAScore(score.toString())
            }


        }
        else if (id == "scoreB") {
            let score = Number.parseInt(fighterBScore) - 1;
            if (score < 6) {
                {
                    score = 6

                    // setIsFighterBDefeated(true)
                    // setIsFighterAWon(true)
                    // setIsFightOver(true)
                    // setFighterBScore('DEF')
                    theWinnerIs('fighterA')
                }
                setFighterBScore(score.toString())
            } else {
                setFighterBScore(score.toString())
            }
        }
    }


    const theWinnerIs = (fighterAOrB: string) => {
        const fighterName =
            fighterAOrB === 'fighterA' ? fighterA.firstname + ' ' + fighterA.lastname
                : fighterB.firstname + ' ' + fighterB.lastname;
        // alert("This will indicate that " + fighterName + " has won the fight. Please select the method of victory" )
        setWinnerName(fighterName)
        openModal();
    }

    const closeModal = () => {
        setShowModal(false)
    }

    const openModal = () => {
        setShowModal(true)
    }

    const fightOver = () => {
        setIsFightOver(true)
        setShowModal(false)

        if(earlyFinishResult === "FigherA"){
            setFighterAScore("Win");
            setFighterBScore("Def");
        }
        if(earlyFinishResult === "FigherB"){
            setFighterAScore("Def");
            setFighterBScore("Win");
        }

        console.log(earlyFinishResult)
    }


    return (
        <div className='d-flex flex-column align-items-center'>

            <div className='mx-auto d-flex flex-column align-items-end back-color-box p-4' style={{ padding: '10px', minWidth: '240px', borderRadius: '10px' }}>
                <span className='bold d-flex justify-content-center w-100 border-bottom mb-3'>Round {round?.roundNumber} of {scorecard.scheduledRounds}</span>
                <div className='mx-auto'>
                    <div className='d-flex w-100 justify-content-end align-items-center mb-3'>
                        <div>
                            <p className='mx-2 mb-0'>{fighterA?.firstname + ' ' + fighterA?.lastname}:</p>
                        </div>
                        <div>
                            {
                                !isFightOver && <input id='figherATextBox' className='score-round-input' value={fighterAScore} onChange={(e) => handleChangeScore(e, 'scoreA')} type="number" />

                            }
                            {
                                isFightOver && earlyFinishResult === EARLY_STOP_RESULT.FIGHTER_A && <input className='score-round-input' value={"WIN"} onChange={(e) => handleChangeScore(e, 'scoreA')} type="string" />
                            }
                            {
                                isFightOver && earlyFinishResult === EARLY_STOP_RESULT.FIGHTER_B && <input className='score-round-input' value={"DEF"} onChange={(e) => handleChangeScore(e, 'scoreA')} type="string" />
                            }
                            {
                                isFightOver && earlyFinishResult === EARLY_STOP_RESULT.NO_CONTEST //TODO: DISPLAY AS 'NC'
                            }
                        </div>
                        <span onClick={() => scoreDown('scoreA')} className='score-up-down'><i className="bi bi-dash"></i></span>
                        <span onClick={() => scoreUp('scoreA')} className="score-up-down"><i className="bi bi-plus"></i></span>
                    </div>
                    <div className='d-flex w-100 justify-content-end align-items-center mb-3'>
                        <div>
                            <p className='mx-2 mb-0'>{fighterB?.firstname + ' ' + fighterB?.lastname}:</p>
                        </div>
                        {
                            !isFightOver && <input id='figherBTextBox' className='score-round-input' value={fighterBScore} onChange={(e) => handleChangeScore(e, 'scoreB')} type="number" />

                        }
                        {
                            isFightOver && earlyFinishResult === EARLY_STOP_RESULT.FIGHTER_B && <input className='score-round-input' value={"WIN"} onChange={(e) => handleChangeScore(e, 'scoreB')} type="string" />
                        }
                        {
                            isFightOver && earlyFinishResult === EARLY_STOP_RESULT.FIGHTER_A && <input className='score-round-input' value={"DEF"} onChange={(e) => handleChangeScore(e, 'scoreB')} type="string" />
                        }
                        <span onClick={() => scoreDown('scoreB')} className='score-up-down'><i className="bi bi-dash"></i></span>
                        <span onClick={() => scoreUp('scoreB')} className="score-up-down"><i className="bi bi-plus"></i></span>
                    </div>
                </div>
                <div className='d-flex flex-column align-items-baseline'>
                    <p className='mb-0'>Comments:</p>
                    <textarea style={{ width: '24vw', height: '16vh' }} className='mb-4 mx-auto' name="comment" id="comment" value={comments} onChange={(e => setComments(e.target.value))}></textarea>
                </div>
                {
                    !isFightOver &&
                    <>
                        <button className='py-2 btn btn-gold mx-auto' style={{ width: "88%", marginLeft: 'auto' }} onClick={() => handleScoreRound(fighterAScore, fighterBScore, comments)}>Submit Score</button>
                        <button className='py-2 btn btn-danger mt-2 mx-auto' style={{ width: "50%", marginLeft: 'auto' }} onClick={() => setShowModal(true)}>End Fight</button>
                    </>
                }
                {
                    isFightOver &&
                    <>
                        <button className='py-2 btn btn-gold mx-auto' style={{ width: "88%", marginLeft: 'auto' }} onClick={() => handleScoreRound(fighterAScore, fighterBScore, comments)}>Submit Score</button>
                        <button className='py-2 btn btn-danger mt-2 mx-auto' style={{ width: "50%", marginLeft: 'auto' }} onClick={() => setShowModal(true)}>Cancel</button>
                    </>
                }

            </div>

            {showModal && (
                <div
                    className="modal-overlay"
                    style={{
                        position: 'fixed',
                        top: -500,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        backgroundColor: 'rgba(0,0,0,0.5)',
                        color: '#fff',
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        zIndex: 9999,
                        fontSize: 'larger'
                    }}
                >
                    <div
                        className="modal-content"
                        style={{
                            backgroundColor: '#000',
                            padding: '20px',
                            borderRadius: '10px',
                            width: '400px',
                            textAlign: 'center',
                            boxShadow: '0 2px 10px rgba(0,0,0,0.2)',
                            border: '1px solid'
                        }}
                    >
                        <p style={{ marginBottom: '10px', fontSize: '24px' }}>Has The Fight Ended Early?</p>
                        <p>Select the winner/result</p>
                        <p></p>
                        {/* <p style={{ marginBottom: '20px' }}>
                            {`Select to confirm that ${winnerName} has won`}
                        </p> */}
                        <div className='d-flex justify-content-around' style={{ width: '100%' }}>
                            <p className='mb-0'>Winner:</p>
                            <select name="test" onChange={(e) => { setEarlyFinishResult(e.target.value); }} id="test" style={{ width: '70%' }}>
                                <option value={EARLY_STOP_RESULT.FIGHTER_A}>{fighterA.firstname + ' ' + fighterA.lastname} </option>
                                <option value={EARLY_STOP_RESULT.FIGHTER_B}>{fighterB.firstname + ' ' + fighterB.lastname} </option>
                                <option value={EARLY_STOP_RESULT.FOUL_DAMAGE}>Early Scorecard: Cuts or Foul&nbsp;&nbsp;&nbsp;</option>
                                <option value={EARLY_STOP_RESULT.NO_CONTEST}>No Contest</option>
                            </select>
                            {/* <p>Comments:</p> */}

                        </div>
                        <div className='d-flex flex-column mx-auto' style={{ width: '80%' }}>
                            <button
                                onClick={() => fightOver()}
                                className="btn btn-primary mt-3 mx-auto"
                                style={{ width: "65%", padding: '8px 20px', borderRadius: '5px' }}
                            >
                                Confirm
                            </button>
                            <button
                                onClick={closeModal}
                                className="btn btn-danger mt-3 mx-auto"
                                style={{ width: "65%", padding: '8px 20px', borderRadius: '5px' }}
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}

        </div>
    )
}
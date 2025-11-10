import React, { useEffect, useState } from 'react'
import { IScorecard } from '../Interfaces/IScorecard'
import { IRound } from '../Interfaces/IRound'
import { useData } from '../Context/data';
import { API_ENDPOINTS, API_ROOTS, ENVIRONMENTS } from '../Utils/Constants';
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

    useEffect(() => {

    }, [isPosted])



    // const submitScore = async () => {
    //     try {
    //         const data = new FormData();
    //         data.append("Scorecard_ID", String(scorecard.scorecard_ID));
    //         data.append("RoundNumber", String(round?.roundNumber ?? 1));
    //         data.append("FighterA_ID", String(round?.fighterA_ID ?? ''));
    //         data.append("FighterB_ID", String(round?.fighterB_ID ?? ''));
    //         data.append("FighterA_Score", fighterAScore);
    //         data.append("FighterB_Score", fighterBScore);
    //         data.append("Comments", comments ?? '');

    //         const response = await axios.put(API_BASE_URL + API_ENDPOINT_ROUNDS, data, {
    //             headers: { 'Content-Type': 'multipart/form-data' },
    //         })

    //         if (response.data.isSuccess) {
    //             console.log('Round updated successfully:', response.data.result);
    //             // const findMatchingRounds = () => {
    //             //     const rounds = ctxRounds.filter(r => r.scorecard_ID === scorecard.scorecard_ID)
    //             //     setRoundsForThisCard(rounds);
    //             //     // console.log(rounds)
    //             // }

    //             // findMatchingRounds();
    //             // //TODO: GET UPDATED ROUNDS FOR THIS CARD.
    //             // navigate(ROUTES.SCORE_FIGHT, {
    //             //     state: { scorecard: scorecard, rounds: roundsForThisCard, fighterA: fighterA, fighterB: fighterB }

    //             // })

    //             // Optionally advance to next round here
    //         } else {
    //             console.error('Error updating round:', response.data.message);
    //         }
    //     } catch (error) {
    //         console.error('PUT request failed:', error);
    //     }

    // }

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
            setIsFighterADefeated(false)
            setIsFighterBWon(false)
            let score = Number.parseInt(fighterAScore) + 1;
            if (score > 10){
                
            } score = 10
            setFighterAScore(score.toString())
        }
        else if (id == "scoreB") {
            let score = Number.parseInt(fighterBScore) + 1;
            if (score > 10) score = 10
            setFighterBScore(score.toString())
        }
    }

    const scoreDown = (id: string) => {

        if (id == "scoreA") {
            let score = Number.parseInt(fighterAScore) - 1;
            if (score < 6) {
                score = 5

                setIsFighterADefeated(true)
                setIsFighterBWon(true)
                setIsFightOver(true)
                // setFighterAScore('DEF') //MUST MAKE THE TEXT BOX APPEAR INSTEAD OF THE NUMBER BOX TO PUT THE 'DEF'
            } else {
                setIsFighterADefeated(false)
                setIsFighterBWon(false)
                setIsFightOver(false)
                setFighterAScore(score.toString())
            }


        }
        else if (id == "scoreB") {
            let score = Number.parseInt(fighterBScore) - 1;
            if (score < 6) {
                {
                    score = 5

                    setIsFighterBDefeated(true)
                    setIsFighterAWon(true)
                    setIsFightOver(true)
                    setFighterBScore('DEF')
                }
                setFighterBScore(score.toString())
            }
        }
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

                            }                            {
                                isFighterADefeated && <input className='score-round-input' value={"DEF"} onChange={(e) => handleChangeScore(e, 'scoreA')} type="string" />
                            }
                        </div>
                        <span onClick={() => scoreDown('scoreA')} className='score-up-down'><i className="bi bi-dash"></i></span>
                        <span onClick={() => scoreUp('scoreA')} className="score-up-down"><i className="bi bi-plus"></i></span>
                    </div>
                    <div className='d-flex w-100 justify-content-end align-items-center mb-3'>
                        <div>
                            <p className='mx-2 mb-0'>{fighterB?.firstname + ' ' + fighterB?.lastname}:</p>
                        </div>
                        <div>
                            <input className='score-round-input' value={fighterBScore} onChange={e => handleChangeScore(e, 'scoreB')} type="number" />
                        </div>
                        <span onClick={() => scoreDown('scoreB')} className='score-up-down'><i className="bi bi-dash"></i></span>
                        <span onClick={() => scoreUp('scoreB')} className="score-up-down"><i className="bi bi-plus"></i></span>
                    </div>
                </div>
                <div className='d-flex flex-column align-items-baseline'>
                    <p className='mb-0'>Comments:</p>
                    <textarea style={{ width: '24vw', height: '16vh' }} className='mb-4 mx-auto' name="comment" id="comment" value={comments} onChange={(e => setComments(e.target.value))}></textarea>
                </div>
                <button className='py-2 btn btn-gold' style={{ width: "88%", marginLeft: 'auto' }} onClick={() => handleScoreRound(fighterAScore, fighterBScore, comments)}>Submit Score</button>
                {isFightOver &&
                    <button className='py-2 btn btn-gold' style={{ width: "88%", marginLeft: 'auto' }} onClick={() => handleScoreRound(fighterAScore, fighterBScore, comments)}>End Scorecard</button>
                }
                {/* <button>Submit Score</button> */}
            </div>
        </div>
    )
}
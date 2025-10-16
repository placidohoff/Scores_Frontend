import React, { useEffect, useState } from 'react'
import { Form, useLocation } from 'react-router-dom'
import { UserScorecard } from '../Components'
import { IScorecard } from '../Interfaces/IScorecard'
import { IRound } from '../Interfaces/IRound';
import { useData } from '../Context/data';
import { IBoxingMatch } from '../Interfaces/IBoxingMatch';
import { IFighter } from '../Interfaces/IFighter';
import { API_ENDPOINTS, API_ROOTS, ENVIRONMENTS } from '../Utils/Constants';
import axios from 'axios';

interface IScoreRoundsProps {
    scorecard: IScorecard;
    round: IRound | undefined
}

export default function ScoreFight() {
    const location = useLocation()
    const { ctxFighters, ctxBoxingMatches } = useData()



    const [scorecard, setScorecard] = useState<IScorecard>(location.state.scorecard)
    const [rounds, setRounds] = useState<IRound[]>(location.state.rounds)
    const [activeRound, setActiveRound] = useState<IRound>()
    const [fighterA, setFighterA] = useState<IFighter>(location.state.fighterA)
    const [fighterB, setFighterB] = useState<IFighter>(location.state.fighterB)
    const [boxingMatch, setBoxingMatch] = useState<IBoxingMatch>()
    // console.log(scorecard)

    useEffect(() => {
        console.log(location.state, 'STATE')
        setScorecard(location.state.scorecard)
        findActiveRound();
        findActiveFighters();

    }, [])

    const handleSubmitScore = () => {
        //POST ROUND TO THE "PUT" ENDPOINT
        //INCREMENT THE "ACTIVEROUND" STATE, PASS IT TO THE SCORE-ROUND-COMPONENT AND RE-RENDER
    }

    const findActiveFighters = () => {
        ctxBoxingMatches.some(b => {
            // console.log(b.boxingMatch_ID, 'BID', scorecard.boxingMatch_ID)
            if (b.boxingMatch_ID === scorecard.boxingMatch_ID) {
                // console.log('FOUND?')
                setBoxingMatch(b)
                return true
            }
        })
        ctxFighters.some(f => {
            if (f.fighter_ID == boxingMatch?.fighterA_ID) {
                setFighterA(f)
                return true
            }
        })

        ctxFighters.some(f => {
            if (f.fighter_ID == boxingMatch?.fighterB_ID) {
                setFighterB(f)
                return true
            }
        })

        // console.log(boxingMatch, 'MATCH')

    }

    const findActiveRound = () => {
        if (rounds) {
            rounds.sort((a, b) => a.roundNumber - b.roundNumber)
            rounds.some(r => {
                if (!r.isScored) {
                    setActiveRound(r)
                    return true
                }
            })
        }

    }

    const ScoreRound = (props: IScoreRoundsProps) => {
        const { scorecard, round } = props
        const [fighterAScore, setFighterAScore] = useState<string>('10')
        const [fighterBScore, setFighterBScore] = useState<string>('10')
        const [comments, setComments] = useState<string>()

        const API_BASE_URL =
            process.env.REACT_APP_ENVIRONMENT === ENVIRONMENTS.DEV
                ? API_ROOTS.DEV
                : process.env.REACT_APP_ENVIRONMENT === ENVIRONMENTS.PROD
                    ? API_ROOTS.PROD
                    : API_ROOTS.WORK

        const API_ENDPOINT_ROUNDS =
            process.env.REACT_APP_ENVIRONMENT === ENVIRONMENTS.DEV
                ? API_ENDPOINTS.ROUNDS.DEV
                : process.env.REACT_APP_ENVIRONMENT === ENVIRONMENTS.PROD
                    ? API_ENDPOINTS.ROUNDS.PROD
                    : API_ENDPOINTS.ROUNDS.WORK

        const submitScore = async () => {
            try{
                const data = new FormData();
            data.append("Scorecard_ID", String(scorecard.scorecard_ID));
            data.append("RoundNumber", String(round?.roundNumber ?? 1));
            data.append("FighterA_ID", String(round?.fighterA_ID ?? ''));
            data.append("FighterB_ID", String(round?.fighterB_ID ?? ''));
            data.append("FighterA_Score", fighterAScore);
            data.append("FighterB_Score", fighterBScore);
            data.append("Comments", comments ?? '');

            const response = await axios.put(API_BASE_URL + API_ENDPOINT_ROUNDS, data, {
                headers: { 'Content-Type': 'multipart/form-data' },
            })

            if (response.data.isSuccess) {
                console.log('Round updated successfully:', response.data.result);
                // Optionally advance to next round here
            } else {
                console.error('Error updating round:', response.data.message);
            }
            }catch(error){
                console.error('PUT request failed:', error);
            }
            
        }

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


        return (
            <div className='d-flex flex-column align-items-center'>
                <span className='bold'>Round {round?.roundNumber} of {scorecard.scheduledRounds}</span>
                <div className='mx-auto d-flex flex-column align-items-end' style={{ padding: '10px', minWidth: '240px' }}>
                    <div className='d-flex w-100 justify-content-end'>
                        <div>
                            <p className='mx-2'>{fighterA?.firstname + ' ' + fighterA?.lastname}:</p>
                        </div>
                        <div>
                            <input className='score-round-input' value={fighterAScore} onChange={(e) => handleChangeScore(e, 'scoreA')} type="number" />
                        </div>
                    </div>
                    <div className='d-flex w-100 justify-content-end'>
                        <div>
                            <p className='mx-2'>{fighterB?.firstname + ' ' + fighterB?.lastname}:</p>
                        </div>
                        <div>
                            <input className='score-round-input' value={fighterBScore} onChange={e => handleChangeScore(e, 'scoreB')} type="number" />
                        </div>
                    </div>
                    <div className='d-flex flex-column align-items-baseline'>
                        <p className='mb-0'>Comments:</p>
                        <textarea style={{ width: '16vw', height: '16vh' }} className='mb-4 mx-auto' name="comment" id="comment" value={comments} onChange={(e => setComments(e.target.value))}></textarea>
                    </div>
                    <button className='py-2' style={{ width: "88%", marginLeft: 'auto' }} onClick={() => submitScore()}>Submit Score</button>

                    {/* <button>Submit Score</button> */}
                </div>
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

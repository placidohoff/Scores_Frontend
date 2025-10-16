import React, { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'
import { UserScorecard } from '../Components'
import { IScorecard } from '../Interfaces/IScorecard'
import { IRound } from '../Interfaces/IRound';
import { useData } from '../Context/data';
import { IBoxingMatch } from '../Interfaces/IBoxingMatch';
import { IFighter } from '../Interfaces/IFighter';

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

        console.log(boxingMatch, 'MATCH')

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
        const [fighterAScore, setFighterAScore] = useState<string>()
        const [fighterBScore, setFighterBScore] = useState<string>()
        const [comments, setComments] = useState<string>()

        const submitScore = () => {
            console.log(comments, 'COMM')
        }


        return (
            <div className='d-flex flex-column align-items-center'>
                Round {round?.roundNumber} of {scorecard.scheduledRounds}
                <div className='mx-auto'>
                    <div className='d-flex'>
                        <div>
                            <p>{fighterA?.firstname + ' ' + fighterA?.lastname}</p>
                        </div>
                        <div>
                            <input value={fighterAScore} onChange={e => setFighterAScore(e.target.value)} type="number" />
                        </div>
                    </div>
                    <div className='d-flex'>
                        <div>
                            <p>{fighterB?.firstname + ' ' + fighterB?.lastname}</p>
                        </div>
                        <div>
                            <input value={fighterBScore} onChange={e => setFighterBScore(e.target.value)} type="number" />
                        </div>
                    </div>
                    <div className='d-flex'>
                        <p>Comments:</p>
                        <textarea name="comment" id="comment" value={comments} onChange={(e => setComments(e.target.value))}></textarea>
                    </div>
                    <button onClick={() => submitScore()}>Submit Score</button>

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

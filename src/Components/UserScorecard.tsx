import { useEffect, useState } from "react";
import { IScorecard } from "../Interfaces/IScorecard";
import { useData } from "../Context/data";
import { IFighter } from "../Interfaces/IFighter";
import BoxingMatchCard from "./BoxingMatchCard";
import { IRound } from "../Interfaces/IRound";
import { API_ENDPOINTS, API_ROOTS, ENVIRONMENTS, ROUTES } from "../Utils/Constants";
import axios from "axios";
import RoundScoresAndComment from "./RoundScoresAndComment";
import { useNavigate } from "react-router-dom";
import ScorecardTotals from "./ScorecardTotals";

interface Props {
    scorecard: IScorecard,
    isActive: boolean
}

export default function UserScorecard(props: Props) {
    const { scorecard, isActive } = props
    const { ctxFighters, ctxBoxingMatches, ctxRounds } = useData();
    const [fighterA, setFighterA] = useState<IFighter>();
    const [fighterB, setFighterB] = useState<IFighter>();
    const [roundsForThisCard, setRoundsForThisCard] = useState<IRound[]>();
    const [status, setStatus] = useState<string>('');
    // console.log(ctxFighters, 'FIGHTERS')
    // console.log(ctxBoxingMatches, 'MATCHES')
    const roundScoresToRender = []
    const navigate = useNavigate();

    // console.log(props)

    const API_BASE_URL =
        process.env.REACT_APP_ENVIRONMENT === ENVIRONMENTS.DEV
            ? API_ROOTS.DEV
            : process.env.REACT_APP_ENVIRONMENT === ENVIRONMENTS.PROD
                ? API_ROOTS.PROD
                : API_ROOTS.WORK

    const API_ENDPOINT_SCORECARDS =
        process.env.REACT_APP_ENVIRONMENT === ENVIRONMENTS.DEV
            ? API_ENDPOINTS.SCORECARDS.DEV
            : process.env.REACT_APP_ENVIRONMENT === ENVIRONMENTS.PROD
                ? API_ENDPOINTS.SCORECARDS.PROD
                : API_ENDPOINTS.SCORECARDS.WORK



    const deleteScorecard = async (scorecardID: number) => {
        try {
            // Confirm user intent (optional)
            if (!window.confirm("Are you sure you want to delete this scorecard?")) return;

            // Send DELETE request to your .NET endpoint
            const response = await axios.delete(
                `${API_BASE_URL}${API_ENDPOINT_SCORECARDS}/${scorecardID}`
            );

            // Log and show response
            console.log("Delete response:", response.data);

            // Check if backend returned success
            if (response.data.isSuccess) {
                setStatus(`Scorecard #${scorecardID} and all its rounds deleted successfully!`);

                // Optionally update context or local state:
                // setCTXScorecards(prev => prev.filter(s => s.scorecard_ID !== scorecardID));

            } else {
                setStatus(response.data.errorMessages?.[0] || "Failed to delete scorecard");
            }
        } catch (error: any) {
            console.error("Delete error:", error);
            setStatus(
                error.response?.data?.errorMessages?.[0] ||
                "An error occurred while deleting the scorecard"
            );
        }
    };

    const scoreFight = (cardID: number) => {
        if (isActive) {
            navigate(ROUTES.SCORE_FIGHT, {
                state: { scorecard: scorecard, rounds: roundsForThisCard, fighterA: fighterA, fighterB: fighterB }

            })
        }
    }


    useEffect(() => {
        const findMatchingFighters = () => {
            const boxingMatch = ctxBoxingMatches.find(m => m.boxingMatch_ID === scorecard.boxingMatch_ID)
            // console.log(boxingMatch, 'BOXINGMATCH')
            const fighters = ctxFighters.filter(f => f.fighter_ID === boxingMatch?.fighterA_ID || f.fighter_ID === boxingMatch?.fighterB_ID)

            fighters.forEach(f => {
                f.fighter_ID === boxingMatch?.fighterA_ID && setFighterA(f)
                f.fighter_ID === boxingMatch?.fighterB_ID && setFighterB(f)
            })
        }

        const findMatchingRounds = () => {
            const rounds = ctxRounds.filter(r => r.scorecard_ID === scorecard.scorecard_ID)
            setRoundsForThisCard(rounds);
            // console.log(rounds)
        }

        findMatchingFighters();
        findMatchingRounds();


        //TODO: GETTING/SETTING THE ROUNDS FOR THIS SCORECARD
        // for(let i = 0; i < scorecard.scheduledRounds; i++){
        //     //IF SCORED ROUND EXIST, ADD IT TO BE RENDERED. IF NOT, RENDER GENERIC BLANK ROUND
        //     const currentRound = roundsForThisCard?.find(r => r.roundNumber === i);
        //     currentRound
        //     ? setRoundsForThisCard([...roundScoresToRender, currentRound])
        //     : setRoundsForThisCard(...roundScoresToRender, )

        // }

    }, [])

    return (
        <div onClick={() => scoreFight(scorecard.scorecard_ID)} className='userScorecard mb-2 d-flex'>
            <div className="d-flex flex-column mx-3 userScorecardScores" style={{ border: "1px solid"}}>
                <div style={{ border: "1px solid" }}>
                    <span>&nbsp;</span>
                </div>
                <div className="d-flex">
                    <div className="d-flex flex-column" style={{ textAlign: 'left', borderRight: '1px solid', width: 'fit-content' }}>
                        <p className="px-2">{fighterA?.firstname + ' ' + fighterA?.lastname}</p>
                        <p className="px-2" style={{ borderTop: '1px solid' }}>{fighterB?.firstname + ' ' + fighterB?.lastname}</p>
                    </div>
                    <div className="d-flex">
                        {

                            roundsForThisCard?.map(r => <RoundScoresAndComment round={r} />)
                        }
                        {/* TOTAL */}
                        <ScorecardTotals rounds={roundsForThisCard} />

                    </div>
                </div>
                <div style={{ border: "1px solid" }}>
                    <span>&nbsp;</span>
                </div>
            </div>
            {
                isActive && (
                    <div className="d-flex flex-column justify-content-center align-items-center mx-3">
                        <button onClick={() => deleteScorecard(scorecard.scorecard_ID)} className="btn text-danger view-card-button">DELETE</button>
                        <button onClick={() => scoreFight(scorecard.scorecard_ID)} className="btn text-success view-card-button">SCORE FIGHT</button>
                    </div>
                )
            }


        </div>
    )
}
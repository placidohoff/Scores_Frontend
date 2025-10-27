import { useEffect, useState } from "react";
import { IScorecard } from "../Interfaces/IScorecard";
import { useData } from "../Context/data";
import { IFighter } from "../Interfaces/IFighter";
import { IRound } from "../Interfaces/IRound";
import { API_ENDPOINTS, API_ROOTS, ENVIRONMENTS, ROUTES } from "../Utils/Constants";
import axios from "axios";
import RoundScoresAndComment from "./RoundScoresAndComment";
import { useNavigate } from "react-router-dom";
import ScorecardTotals from "./ScorecardTotals";
import CommentsIcon from "./CommentsIcon";

interface Props {
    scorecard: IScorecard;
    fighterAName: string;
    fighterBName: string;
}

export default function CommentsForScorecard(props: Props) {
    const { ctxFighters, ctxBoxingMatches, ctxRounds } = useData();
    const { scorecard, fighterAName, fighterBName } = props;
    const [fighterA, setFighterA] = useState<IFighter>();
    const [fighterB, setFighterB] = useState<IFighter>();
    const [roundsForThisCard, setRoundsForThisCard] = useState<IRound[]>([]);
    const [status, setStatus] = useState<string>("");
    const navigate = useNavigate();

    const API_BASE_URL =
        process.env.REACT_APP_ENVIRONMENT === ENVIRONMENTS.DEV
            ? API_ROOTS.DEV
            : process.env.REACT_APP_ENVIRONMENT === ENVIRONMENTS.PROD
                ? API_ROOTS.PROD
                : API_ROOTS.WORK;

    const API_ENDPOINT_SCORECARDS =
        process.env.REACT_APP_ENVIRONMENT === ENVIRONMENTS.DEV
            ? API_ENDPOINTS.SCORECARDS.DEV
            : process.env.REACT_APP_ENVIRONMENT === ENVIRONMENTS.PROD
                ? API_ENDPOINTS.SCORECARDS.PROD
                : API_ENDPOINTS.SCORECARDS.WORK;



    //   useEffect(() => {
    //     const findMatchingFighters = () => {
    //       const boxingMatch = ctxBoxingMatches.find(
    //         (m) => m.boxingMatch_ID === scorecard.boxingMatch_ID
    //       );
    //       if (!boxingMatch) return;

    //       const fighterAFound = ctxFighters.find(
    //         (f) => f.fighter_ID === boxingMatch.fighterA_ID
    //       );
    //       const fighterBFound = ctxFighters.find(
    //         (f) => f.fighter_ID === boxingMatch.fighterB_ID
    //       );

    //       if (fighterAFound) setFighterA(fighterAFound);
    //       if (fighterBFound) setFighterB(fighterBFound);
    //     };

    //     const findMatchingRounds = () => {
    //       const rounds = ctxRounds.filter(
    //         (r) => r.scorecard_ID === scorecard.scorecard_ID
    //       );
    //       setRoundsForThisCard(rounds);
    //     };

    //     findMatchingFighters();
    //     findMatchingRounds();
    //   }, [ctxRounds, ctxBoxingMatches, ctxFighters, scorecard]);

    useEffect(() => {
        const findMatchingRounds = () => {
            const rounds = ctxRounds.filter(
                (r) => r.scorecard_ID === scorecard.scorecard_ID
            );
            setRoundsForThisCard(rounds);
        };

        findMatchingRounds();
    }, [])

    return (
        <div
            //   onClick={() => scoreFight(scorecard.scorecard_ID)}
            style={{ width: "90%" }}
            className=" mb-2 d-flex justify-content-center"
        >
            <div
                className="d-flex flex-column mx-3 userScorecardScores"
                style={{ border: "1px solid", background: 'black'}}
            >
                <div style={{ border: "1px solid", background: "black" }}>
                    <span>&nbsp;</span>
                </div>
                <div className="scorecard-cell d-flex">
                    <div
                        className="d-flex flex-column"
                        style={{
                            textAlign: "left",
                            borderRight: "1px solid",
                            width: "fit-content",
                        }}
                    >
                        <p className="px-2 invisible">
                            {fighterAName}
                        </p>
                        <p
                            className="px-2 invisible"
                            style={{ borderTop: "1px solid" }}
                        >
                            {fighterBName}
                        </p>
                    </div>
                    <div className="d-flex">
                        {roundsForThisCard?.map((r) => (
                            // <RoundScoresAndComment key={r.round_ID} round={r} />
                            <CommentsIcon key={r.round_ID} round={r} />
                        ))}

                        {/* ADDING A BLANK .SCOREROUND-CELL FOR COMMENTS OF THE TOTAL SCORES*/}
                        {/* PASSING IN A BLANK ROUND AS A PROP FOR ROUND */}
                        <CommentsIcon round={{
                            round_ID: 0,
                            scorecard_ID: 0,
                            roundNumber: 0,
                            fighterA_Score: 0,
                            fighterB_Score: 0,
                            fighterA_ID: 0,
                            fighterB_ID: 0,
                            isScored: true,
                            scorecard: null
                        }} />
                    </div>
                </div>
                <div style={{ border: "1px solid", background: 'black' }}>
                    <span>&nbsp;</span>
                </div>
            </div>
        </div>
    );
}

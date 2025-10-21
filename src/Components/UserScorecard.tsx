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

interface Props {
  scorecard: IScorecard;
  isActive: boolean;
}

export default function UserScorecard({ scorecard, isActive }: Props) {
  const { ctxFighters, ctxBoxingMatches, ctxRounds } = useData();
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

  const deleteScorecard = async (scorecardID: number) => {
    try {
      if (!window.confirm("Are you sure you want to delete this scorecard?")) return;

      const response = await axios.delete(`${API_BASE_URL}${API_ENDPOINT_SCORECARDS}/${scorecardID}`);

      if (response.data.isSuccess) {
        setStatus(`Scorecard #${scorecardID} and all its rounds deleted successfully!`);
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
        state: { 
          scorecard,
          rounds: roundsForThisCard,
          fighterA,
          fighterB
        },
      });
    }
  };

  useEffect(() => {
    const findMatchingFighters = () => {
      const boxingMatch = ctxBoxingMatches.find(
        (m) => m.boxingMatch_ID === scorecard.boxingMatch_ID
      );
      if (!boxingMatch) return;

      const fighterAFound = ctxFighters.find(
        (f) => f.fighter_ID === boxingMatch.fighterA_ID
      );
      const fighterBFound = ctxFighters.find(
        (f) => f.fighter_ID === boxingMatch.fighterB_ID
      );

      if (fighterAFound) setFighterA(fighterAFound);
      if (fighterBFound) setFighterB(fighterBFound);
    };

    const findMatchingRounds = () => {
      const rounds = ctxRounds.filter(
        (r) => r.scorecard_ID === scorecard.scorecard_ID
      );
      setRoundsForThisCard(rounds);
    };

    findMatchingFighters();
    findMatchingRounds();
  }, [ctxRounds, ctxBoxingMatches, ctxFighters, scorecard]);

  return (
    <div
      onClick={() => scoreFight(scorecard.scorecard_ID)}
      style={{ width: "90%" }}
      className="userScorecard mb-2 d-flex justify-content-center mx-auto"
    >
      <div
        className="d-flex flex-column mx-3 userScorecardScores"
        style={{ border: "1px solid" }}
      >
        <div style={{ border: "1px solid" }}>
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
            <p className="px-2">
              {fighterA?.firstname} {fighterA?.lastname}
            </p>
            <p
              className="px-2"
              style={{ borderTop: "1px solid" }}
            >
              {fighterB?.firstname} {fighterB?.lastname}
            </p>
          </div>
          <div className="d-flex">
            {roundsForThisCard?.map((r) => (
              <RoundScoresAndComment key={r.round_ID} round={r} />
            ))}
            {/* TOTAL */}
            <ScorecardTotals
              scorecard={scorecard}
              rounds={roundsForThisCard}
            />
          </div>
        </div>
        <div style={{ border: "1px solid" }}>
          <span>&nbsp;</span>
        </div>
      </div>
      {isActive && (
        <div className="d-flex flex-column justify-content-center align-items-center mx-3">
          <button
            onClick={() => scoreFight(scorecard.scorecard_ID)}
            className="btn text-success view-card-button userScorecardScoreOrDeleteBtn"
          >
            SCORE FIGHT
          </button>
          <button
            onClick={() => deleteScorecard(scorecard.scorecard_ID)}
            className="btn text-danger view-card-button userScorecardScoreOrDeleteBtn"
          >
            DELETE
          </button>
        </div>
      )}
    </div>
  );
}

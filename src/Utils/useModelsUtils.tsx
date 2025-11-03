import { useEffect, useState } from 'react';
import { useData } from '../Context/data'
import { API_ENDPOINTS, API_ROOTS, ENVIRONMENTS } from './Constants';
import axios from 'axios';
import { IApiResponse } from '../Interfaces/IApiResponse';
import { IFighter } from '../Interfaces/IFighter';
import { IScorecard } from '../Interfaces/IScorecard';
import { IRound } from '../Interfaces/IRound';
import { IBoxingMatch } from '../Interfaces/IBoxingMatch';

const API_BASE_URL =
    process.env.REACT_APP_ENVIRONMENT === ENVIRONMENTS.DEV
        ? API_ROOTS.DEV
        : process.env.REACT_APP_ENVIRONMENT === ENVIRONMENTS.PROD
            ? API_ROOTS.PROD
            : API_ROOTS.WORK;

const API_ENDPOINT_ROUNDS =
    process.env.REACT_APP_ENVIRONMENT === ENVIRONMENTS.DEV
        ? API_ENDPOINTS.ROUNDS.DEV
        : process.env.REACT_APP_ENVIRONMENT === ENVIRONMENTS.PROD
            ? API_ENDPOINTS.ROUNDS.PROD
            : API_ENDPOINTS.ROUNDS.WORK;

const API_ENDPOINT_SCORECARDS =
    process.env.REACT_APP_ENVIRONMENT === ENVIRONMENTS.DEV
        ? API_ENDPOINTS.SCORECARDS.DEV
        : process.env.REACT_APP_ENVIRONMENT === ENVIRONMENTS.PROD
            ? API_ENDPOINTS.SCORECARDS.PROD
            : API_ENDPOINTS.SCORECARDS.WORK;


const API_ENDPOINT_FIGHTERS =
    process.env.REACT_APP_ENVIRONMENT === ENVIRONMENTS.DEV
        ? API_ENDPOINTS.FIGHTERS.DEV
        : process.env.REACT_APP_ENVIRONMENT === ENVIRONMENTS.PROD
            ? API_ENDPOINTS.FIGHTERS.PROD
            : API_ENDPOINTS.FIGHTERS.WORK;


const API_ENDPOINT_BOXING_MATCHES =
    process.env.REACT_APP_ENVIRONMENT === ENVIRONMENTS.DEV
        ? API_ENDPOINTS.BOXING_MATCHES.DEV
        : process.env.REACT_APP_ENVIRONMENT === ENVIRONMENTS.PROD
            ? API_ENDPOINTS.BOXING_MATCHES.PROD
            : API_ENDPOINTS.BOXING_MATCHES.WORK;

export const useModelsUtils = () => {
    // State for your data
  const [ctxFighters, setCtxFighters] = useState<IFighter[]>([]);
  const [ctxScorecards, setCtxScorecards] = useState<IScorecard[]>([]);
  const [ctxRounds, setCtxRounds] = useState<IRound[]>([]);
  const [ctxBoxingMatches, setCtxBoxingMatches] = useState<IBoxingMatch[]>([]);

  // Loading & error states
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
    // const { ctxFighters, ctxScorecards, ctxBoxingMatches, ctxRounds } = useData();

    const getFighters = async () => {
        const dataFighters = await axios.get<IApiResponse<IFighter[]>>(API_BASE_URL + API_ENDPOINT_FIGHTERS);
        setCtxFighters(dataFighters.data.result);
        // console.log(dataFighters)
    }

    const getScorecards = async () => {
        const dataScorecards = await axios.get<IApiResponse<IScorecard[]>>(API_BASE_URL + API_ENDPOINT_SCORECARDS);
        setCtxScorecards(dataScorecards.data.result);
        // console.log(dataScorecards)
    }

    const getRounds = async () => {
        const dataRounds = await axios.get<IApiResponse<IRound[]>>(API_BASE_URL + API_ENDPOINT_ROUNDS)
        setCtxRounds(dataRounds.data.result);
        // console.log(dataRounds)
    }

    const getBoxingMatches = async () => {
        const dataMatches = await axios.get<IApiResponse<IBoxingMatch[]>>(API_BASE_URL + API_ENDPOINT_BOXING_MATCHES)
        setCtxBoxingMatches(dataMatches.data.result)
        // console.log(dataMatches)
    }

    useEffect(() => {
    const fetchAll = async () => {
      try {
        setLoading(true);
        const [fightersRes, scorecardsRes, roundsRes, matchesRes] = await Promise.all([
          axios.get<IApiResponse<IFighter[]>>(API_BASE_URL + API_ENDPOINT_FIGHTERS),
          axios.get<IApiResponse<IScorecard[]>>(API_BASE_URL + API_ENDPOINT_SCORECARDS),
          axios.get<IApiResponse<IRound[]>>(API_BASE_URL + API_ENDPOINT_ROUNDS),
          axios.get<IApiResponse<IBoxingMatch[]>>(API_BASE_URL + API_ENDPOINT_BOXING_MATCHES),
        ]);

        setCtxFighters(fightersRes.data.result);
        setCtxScorecards(scorecardsRes.data.result);
        setCtxRounds(roundsRes.data.result);
        setCtxBoxingMatches(matchesRes.data.result);
      } catch (err: any) {
        setError(err.message || "Error fetching model data");
      } finally {
        setLoading(false);
      }
    };

    fetchAll();
  }, []);



    // ✅ Fix: use `find` instead of `filter` when you only need one item
    const getFighterByName = (name: string) => {
        return ctxFighters?.find(f => `${f.firstname} ${f.lastname}` === name) || null;
    };

    const getFighterByScorecardID = (id: number, fighterType: "fighterA" | "fighterB") => {
        const targetScorecard = ctxScorecards?.find(s => s.scorecard_ID === id);
        if (!targetScorecard) return null;

        const targetBoxingMatch = ctxBoxingMatches?.find(
            b => b.boxingMatch_ID === targetScorecard.boxingMatch_ID
        );
        if (!targetBoxingMatch) return null;

        const fighterID =
            fighterType === "fighterA"
                ? targetBoxingMatch.fighterA_ID
                : targetBoxingMatch.fighterB_ID;

        return ctxFighters?.find(f => f.fighter_ID === fighterID) || null;
    };

    const getScorecardByScorecardID = (id: number) => {

        getScorecards();
        console.log(ctxScorecards, 'CARDS')
        const result = ctxScorecards?.find(s => s.scorecard_ID === id) || null;
        console.log(result)
        console.log(ctxScorecards)
        return result;
    };

    const getFighterFromRoundID = (roundID: number, fighterType: "fighterA" | "fighterB") => {
        const targetRound = ctxRounds?.find(r => r.round_ID === roundID);
        if (!targetRound) return null;

        const fighterID =
            fighterType === "fighterA"
                ? targetRound.fighterA_ID
                : targetRound.fighterB_ID;

        return ctxFighters?.find(f => f.fighter_ID === fighterID) || null;
    };

    return {
    loading,
    error,
    ctxFighters,
    ctxScorecards,
    ctxRounds,
    ctxBoxingMatches,
    getFighterByName,
    getFighterByScorecardID,
    getScorecardByScorecardID,
    getFighterFromRoundID,
  };
};

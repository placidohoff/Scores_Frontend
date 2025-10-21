import { useState, createContext, useContext, useEffect } from "react";
import axios from "axios";
import {
  API_ENDPOINTS,
  API_ROOTS,
  ENVIRONMENTS,
  LOCAL_STORAGE,
} from "../Utils/Constants";
import { IBoxingMatch } from "../Interfaces/IBoxingMatch";
import { IScorecard } from "../Interfaces/IScorecard";
import { IFighter } from "../Interfaces/IFighter";
import { IComment } from "../Interfaces/IComment";
import { IRound } from "../Interfaces/IRound";

/* -----------------------------------
   Context Interfaces
----------------------------------- */
interface IDataContext {
  ctxBoxingMatches: IBoxingMatch[];
  ctxScorecards: IScorecard[];
  ctxFighters: IFighter[];
  ctxComments: IComment[];
  ctxRounds: IRound[];

  setCTXBoxingMatches: React.Dispatch<React.SetStateAction<IBoxingMatch[]>>;
  setCTXScorecards: React.Dispatch<React.SetStateAction<IScorecard[]>>;
  setCTXFighters: React.Dispatch<React.SetStateAction<IFighter[]>>;
  setCTXComments: React.Dispatch<React.SetStateAction<IComment[]>>;
  setCTXRounds: React.Dispatch<React.SetStateAction<IRound[]>>;
}

interface IDataProviderProps {
  children: React.ReactNode;
}

/* -----------------------------------
   Context Setup
----------------------------------- */
const DataContext = createContext<IDataContext | undefined>(undefined);

// Determine API base URL
const API_BASE_URL =
  process.env.REACT_APP_ENVIRONMENT === ENVIRONMENTS.DEV
    ? API_ROOTS.DEV
    : process.env.REACT_APP_ENVIRONMENT === ENVIRONMENTS.PROD
    ? API_ROOTS.PROD
    : API_ROOTS.WORK;

// Helper: Load cached data from localStorage (for faster UI)
const loadFromLocalStorage = <T,>(key: string): T[] => {
  try {
    const stored = localStorage.getItem(key);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
};

/* -----------------------------------
   Provider
----------------------------------- */
const DataProvider = ({ children }: IDataProviderProps) => {
  // Load cached values immediately (optional UX improvement)
  const [ctxBoxingMatches, setCTXBoxingMatches] = useState<IBoxingMatch[]>(() =>
    loadFromLocalStorage<IBoxingMatch>(LOCAL_STORAGE.BOXING_MATCHES)
  );
  const [ctxScorecards, setCTXScorecards] = useState<IScorecard[]>(() =>
    loadFromLocalStorage<IScorecard>(LOCAL_STORAGE.SCORECARDS)
  );
  const [ctxFighters, setCTXFighters] = useState<IFighter[]>(() =>
    loadFromLocalStorage<IFighter>(LOCAL_STORAGE.FIGHTERS)
  );
  const [ctxComments, setCTXComments] = useState<IComment[]>(() =>
    loadFromLocalStorage<IComment>(LOCAL_STORAGE.COMMENTS)
  );
  const [ctxRounds, setCTXRounds] = useState<IRound[]>(() =>
    loadFromLocalStorage<IRound>(LOCAL_STORAGE.ROUNDS)
  );

  /* -----------------------------------
     Fetch Rounds
  ----------------------------------- */
  useEffect(() => {
    const fetchRounds = async () => {
      const API_ENDPOINT_ROUNDS =
        process.env.REACT_APP_ENVIRONMENT === ENVIRONMENTS.DEV
          ? API_ENDPOINTS.ROUNDS.DEV
          : process.env.REACT_APP_ENVIRONMENT === ENVIRONMENTS.PROD
          ? API_ENDPOINTS.ROUNDS.PROD
          : API_ENDPOINTS.ROUNDS.WORK;

      try {
        const { data } = await axios.get(API_BASE_URL + API_ENDPOINT_ROUNDS);
        const rounds: IRound[] = data.result || data;
        setCTXRounds(rounds);
        localStorage.setItem(LOCAL_STORAGE.ROUNDS, JSON.stringify(rounds));
      } catch (error) {
        console.error("Failed to fetch rounds:", error);
      }
    };

    fetchRounds(); // Always fetch fresh data
  }, []);

  /* -----------------------------------
     Fetch Boxing Matches
  ----------------------------------- */
  useEffect(() => {
    const fetchBoxingMatches = async () => {
      const endpoint =
        process.env.REACT_APP_ENVIRONMENT === ENVIRONMENTS.DEV
          ? API_ENDPOINTS.BOXING_MATCHES.DEV
          : process.env.REACT_APP_ENVIRONMENT === ENVIRONMENTS.PROD
          ? API_ENDPOINTS.BOXING_MATCHES.PROD
          : API_ENDPOINTS.BOXING_MATCHES.WORK;

      try {
        const { data } = await axios.get(API_BASE_URL + endpoint);
        const matches: IBoxingMatch[] = data.result || data;
        setCTXBoxingMatches(matches);
        localStorage.setItem(
          LOCAL_STORAGE.BOXING_MATCHES,
          JSON.stringify(matches)
        );
      } catch (error) {
        console.error("Failed to fetch boxing matches:", error);
      }
    };

    fetchBoxingMatches();
  }, []);

  /* -----------------------------------
     Fetch Scorecards
  ----------------------------------- */
  useEffect(() => {
    const fetchScorecards = async () => {
      const API_ENDPOINT_SCORECARDS =
        process.env.REACT_APP_ENVIRONMENT === ENVIRONMENTS.DEV
          ? API_ENDPOINTS.SCORECARDS.DEV
          : process.env.REACT_APP_ENVIRONMENT === ENVIRONMENTS.PROD
          ? API_ENDPOINTS.SCORECARDS.PROD
          : API_ENDPOINTS.SCORECARDS.WORK;

      try {
        const { data } = await axios.get(API_BASE_URL + API_ENDPOINT_SCORECARDS);
        const scorecards: IScorecard[] = data.result || data;
        setCTXScorecards(scorecards);
        localStorage.setItem(
          LOCAL_STORAGE.SCORECARDS,
          JSON.stringify(scorecards)
        );
      } catch (error) {
        console.error("Failed to fetch scorecards:", error);
      }
    };

    fetchScorecards();
  }, []);

  /* -----------------------------------
     Fetch Fighters
  ----------------------------------- */
  useEffect(() => {
    const fetchFighters = async () => {
      const endpoint =
        process.env.REACT_APP_ENVIRONMENT === ENVIRONMENTS.DEV
          ? API_ENDPOINTS.FIGHTERS.DEV
          : process.env.REACT_APP_ENVIRONMENT === ENVIRONMENTS.PROD
          ? API_ENDPOINTS.FIGHTERS.PROD
          : API_ENDPOINTS.FIGHTERS.WORK;

      try {
        const { data } = await axios.get(API_BASE_URL + endpoint);
        const fighters: IFighter[] = data.result || data;
        setCTXFighters(fighters);
        localStorage.setItem(LOCAL_STORAGE.FIGHTERS, JSON.stringify(fighters));
      } catch (error) {
        console.error("Failed to fetch fighters:", error);
      }
    };

    fetchFighters();
  }, []);

  /* -----------------------------------
     Fetch Comments
  ----------------------------------- */
  useEffect(() => {
    const fetchComments = async () => {
      const endpoint =
        process.env.REACT_APP_ENVIRONMENT === ENVIRONMENTS.DEV
          ? API_ENDPOINTS.COMMENTS.DEV
          : process.env.REACT_APP_ENVIRONMENT === ENVIRONMENTS.PROD
          ? API_ENDPOINTS.COMMENTS.PROD
          : API_ENDPOINTS.COMMENTS.WORK;

      try {
        const { data } = await axios.get(API_BASE_URL + endpoint);
        const comments: IComment[] = data.result || data;
        setCTXComments(comments);
        localStorage.setItem(LOCAL_STORAGE.COMMENTS, JSON.stringify(comments));
      } catch (error) {
        console.error("Failed to fetch comments:", error);
      }
    };

    fetchComments();
  }, []);

  /* -----------------------------------
     Context Value
  ----------------------------------- */
  return (
    <DataContext.Provider
      value={{
        ctxBoxingMatches,
        setCTXBoxingMatches,
        ctxScorecards,
        setCTXScorecards,
        ctxFighters,
        setCTXFighters,
        ctxComments,
        setCTXComments,
        ctxRounds,
        setCTXRounds,
      }}
    >
      {children}
    </DataContext.Provider>
  );
};

/* -----------------------------------
   Hook
----------------------------------- */
const useData = (): IDataContext => {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error("useData must be used within a DataProvider");
  }
  return context;
};

export { DataProvider, useData };

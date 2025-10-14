import { useState, createContext, useContext, useEffect } from "react";
import axios from "axios";
import { LOCAL_STORAGE } from "../Utils/Constants";


const DataContext = createContext();

const getInitialBoxingMatches = () => {
    // Load saved auth (if any) synchronously from localStorage
    const stored = localStorage.getItem(LOCAL_STORAGE.BOXING_MATCHES);
    if (stored) {
        try {
            return JSON.parse(stored);
        } catch {
            return { boxingMatches: [] };
        }
    }
    return { boxingMatches: [] };
};

const getInitialScorecards = () => {
    const stored = localStorage.getItem(LOCAL_STORAGE.SCORECARDS);
    if (stored) {
        try {
            return JSON.parse(stored);
        } catch {
            return { scorecards: [] };
        }
    }
    return { scorecards: [] };
};

const getInitialFighters = () => {
    const stored = localStorage.getItem(LOCAL_STORAGE.FIGHTERS);
    if (stored) {
        try {
            return JSON.parse(stored);
        } catch {
            return { fighters: [] };
        }
    }
    return { fighters: [] };
};

const getInitialComments = () => {
    const stored = localStorage.getItem(LOCAL_STORAGE.COMMENTS);
    if (stored) {
        try {
            return JSON.parse(stored);
        } catch {
            return { comments: [] };
        }
    }
    return { comments: [] };
};

const getInitialRounds = () => {
    const stored = localStorage.getItem(LOCAL_STORAGE.ROUNDS);
    if (stored) {
        try {
            return JSON.parse(stored);
        } catch {
            return { rounds: [] };
        }
    }
    return { rounds: [] };
};


const DataProvider = ({ children }) => {
    const [ctxBoxingMatches, setCTXBoxingMatches] = useState(getInitialBoxingMatches);
    const [ctxScorecards, setCTXScorecards] = useState(getInitialScorecards);
    const [ctxFighters, setCTXFighters] = useState(getInitialFighters);
    const [ctxComments, setCTXComments] = useState(getInitialComments);
    const [ctxRounds, setCTXRounds] = useState(getInitialRounds);





    // Keep localStorage in sync with state
    // useEffect(() => {
    //     if (auth?.token) {
    //         localStorage.setItem("auth", JSON.stringify(auth));
    //     } else {
    //         localStorage.removeItem("auth");
    //     }
    // }, [auth]);

    return (
        <DataContext.Provider value={{ ctxBoxingMatches, setCTXBoxingMatches, ctxScorecards, setCTXScorecards, ctxFighters, setCTXFighters, ctxComments, setCTXComments, ctxRounds, setCTXRounds }}>
            {children}
        </DataContext.Provider>
    );
};


const useData = () => useContext(DataContext);

export { DataProvider, useData };

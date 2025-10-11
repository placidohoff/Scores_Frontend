export const ROUTES = {
    HOME: "/",
    LOGIN: "/login",
    REGISTER: "/register",
    DASHBOARD: "/dashboard",
    VIEW_MY_CARDS: "/view-scorecards",
    CREATE_CARD: "/create-scorecard",
    VIEW_ROUND: "/view-round",
    VIEW_CARD_TOTAL: "/view-scorecard-total",
    CREATE_MATCH: "/create-match",
    CREATE_FIGHTER: "/create-fighter",
    SCORE_FIGHT: "/score-fight"
}

export const ENVIRONMENTS = {
    DEV:"development",
    WORK: "work_domain",
    PROD: "production"
}

export const API_ROOTS = {
    DEV: "https://localhost:44327/api/",
    PROD: "",
    WORK: "../Data/"
}

export const API_ENDPOINTS = {
    FIGHTERS: {
        DEV: 'Fighter',
        WORK: 'Fighters.json',
        PROD: ''
    },
    BOXING_MATCHES: {
        DEV: 'BoxingMatch',
        WORK: 'BoxingMatches.json',
        PROD: ''
    },
    SCORECARDS: {
        DEV: 'Scorecard',
        WORK: 'Scorecards.json',
        PROD: ''
    }
}
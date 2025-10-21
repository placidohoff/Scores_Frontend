export const ROUTES = {
    HOME: "/",
    LOGIN: "/login",
    REGISTER: "/register",
    DASHBOARD: "/dashboard",
    VIEW_MY_CARDS: "/my-scorecards",
    CREATE_CARD: "/create-scorecard",
    VIEW_ROUND: "/view-round",
    VIEW_CARD_TOTAL: "/view-scorecard-total",
    CREATE_MATCH: "/create-match",
    CREATE_FIGHTER: "/create-fighter",
    SCORE_FIGHT: "/score-fight",
    SCORE_ROUND: "/score-round",
    VIEW_MY_SCORES: "/my-scorecards",
    CREATE_ROUNDS_NEW_SCORECARD: '/create-rounds',
    RECENT_SCORECARDS: '/recent-scores',
    RECENT_FIGHTS: '/recent-fights'
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
    },
    AUTH:{
        DEV: 'Auth',
        WORK: 'Users.json',
        PROD: ''
    },
    ROUNDS:{
        DEV: 'Round',
        WORK: 'Rounds.json',
        PROD: '',
        CREATE_ROUNDS_DEV: 'Round/create-rounds'
    },
    COMMENTS:{
        DEV: 'Comment',
        WORK: 'Comments.json',
        PROD: ''
    }
}

 export const LOCAL_STORAGE = {
        AUTH: 'majority_decision_auth',
        BOXING_MATCHES: 'majority_decision_matches',
        COMMENTS: 'majority_decison_comments',
        FIGHTERS: 'majority_decision_fighters',
        ROUNDS: 'majority_decision_rounds',
        SCORECARDS: 'majority_decision_scorecards'
    }
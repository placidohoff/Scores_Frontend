export const ROUTES = {
    HOME: "/",
    LOGIN: "/login",
    REGISTER: "/register",
    DASHBOARD: "/dashboard",
    VIEW_MY_CARDS: "/viewscorecards",
    CREATE_CARD: "/createscorecard",
    VIEW_ROUND: "/view-round",
    VIEW_CARD_TOTAL: "/view-scorecard-total",
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
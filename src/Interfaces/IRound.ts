export interface IRound {
  round_ID: number;
  scorecard_ID: number;
  roundNumber: number;
  fighterA_Score: number;
  fighterB_Score: number;
  fighterA_ID: number;
  fighterB_ID: number;
  scorecard?: any; //NAVIGATION PROP
}
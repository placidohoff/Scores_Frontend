export interface IScorecard {
  scorecard_ID: number;
  boxingMatch_ID: number;
  user_ID: string;
  ruling?: string; //number but will be "any" for now
  totalRoundsFought?: number; 
  fighterA_ScoreTotal?: number;
  fighterB_ScoreTotal?: number;
  isScorecardComplete: boolean;
  scheduledRounds: number;
  boxingMatch?: any; //Navigation Prop (REMOVE?)
  user?: any; ////Navigation Prop (REMOVE?)
}
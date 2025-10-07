export interface IBoxingMatch {
  boxingMatch_ID: number;
  fighterA_ID: number;
  fighterB_ID: number;
  fighterA?: any; //NAVIGATION PROP
  fighterB?: any; //NAVIGATION PROP
  scheduledRounds: number;
}
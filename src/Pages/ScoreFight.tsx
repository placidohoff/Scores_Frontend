import React, { useEffect, useState } from 'react'
import { Form, useLocation, useNavigate } from 'react-router-dom'
import { CommentsForScorecard, FadeInSection, ScoreRound, UserScorecard } from '../Components'
import { IScorecard } from '../Interfaces/IScorecard'
import { IRound } from '../Interfaces/IRound';
import { useData } from '../Context/data';
import { IBoxingMatch } from '../Interfaces/IBoxingMatch';
import { IFighter } from '../Interfaces/IFighter';
import { API_ENDPOINTS, API_ROOTS, EARLY_STOP_RESULT, ENVIRONMENTS, ROUTES, TOKENS } from '../Utils/Constants';
import axios from 'axios';
import { FaPlus } from "react-icons/fa6";
import { IApiResponse } from '../Interfaces/IApiResponse';
import UserScorecardBravo from '../Components/UserScorecardBravo';
import { useAuth } from '../Context/auth';


export default function ScoreFight() {
  const location = useLocation()
  const { ctxFighters, ctxBoxingMatches } = useData()
  const { auth } = useAuth()



  const [scorecard, setScorecard] = useState<IScorecard>(location.state.scorecard)
  const [rounds, setRounds] = useState<IRound[]>(location.state.rounds)
  const [activeRound, setActiveRound] = useState<IRound>()
  const [fighterA, setFighterA] = useState<IFighter>(location.state.fighterA)
  const [fighterB, setFighterB] = useState<IFighter>(location.state.fighterB)
  const [boxingMatch, setBoxingMatch] = useState<IBoxingMatch>()
  const [roundScoreCount, setRoundScoreCount] = useState(0)
  const [status, setStatus] = useState<string>("");
  const navigate = useNavigate()
  // console.log(scorecard)

  const API_BASE_URL =
    process.env.REACT_APP_ENVIRONMENT === ENVIRONMENTS.DEV
      ? API_ROOTS.DEV
      : process.env.REACT_APP_ENVIRONMENT === ENVIRONMENTS.PROD
        ? API_ROOTS.PROD
        : API_ROOTS.WORK

  const API_ENDPOINT_ROUNDS =
    process.env.REACT_APP_ENVIRONMENT === ENVIRONMENTS.DEV
      ? API_ENDPOINTS.ROUNDS.DEV
      : process.env.REACT_APP_ENVIRONMENT === ENVIRONMENTS.PROD
        ? API_ENDPOINTS.ROUNDS.PROD
        : API_ENDPOINTS.ROUNDS.WORK

  const API_ENDPOINT_COMMENTS =
    process.env.REACT_APP_ENVIRONMENT === ENVIRONMENTS.DEV
      ? API_ENDPOINTS.COMMENTS.DEV
      : process.env.REACT_APP_ENVIRONMENT === ENVIRONMENTS.PROD
        ? API_ENDPOINTS.COMMENTS.PROD
        : API_ENDPOINTS.COMMENTS.WORK

  const API_ENDPOINT_SCORECARDS = API_ENDPOINTS.SCORECARDS.FINALIZE

  const API_ENDPOINT_END_SCORECARD =
    process.env.REACT_APP_ENVIRONMENT === ENVIRONMENTS.DEV
      ? API_ENDPOINTS.SCORECARDS.DEV
      : process.env.REACT_APP_ENVIRONMENT === ENVIRONMENTS.PROD
        ? API_ENDPOINTS.SCORECARDS.PROD
        : API_ENDPOINTS.SCORECARDS.WORK;


  useEffect(() => {
    // console.log(location.state, 'STATE')
    setScorecard(location.state.scorecard)
    findActiveRound();
    findActiveFighters();

  }, [])

  useEffect(() => {
    //TODO: GET UPDATED ROUNDS FROM DB
    const getUpdates = async () => {
      const data: IApiResponse<IRound[]> = await axios.get(API_BASE_URL + API_ENDPOINT_ROUNDS)

      setRounds(data.result)

      // const roundsForThisCard = rounds.filter(r => r.scorecard_ID === scorecard.scorecard_ID)

      // navigate(ROUTES.SCORE_FIGHT, {
      //     state: { scorecard: scorecard, rounds: roundsForThisCard, fighterA: fighterA, fighterB: fighterB }

      // })
      // window.location.reload()
    }

    getUpdates()
    findActiveRound()
    //SET THE NEW ACTIVE ROUND
  }, [roundScoreCount])

  const handleSubmitScore = () => {
    //POST ROUND TO THE "PUT" ENDPOINT
    //INCREMENT THE "ACTIVEROUND" STATE, PASS IT TO THE SCORE-ROUND-COMPONENT AND RE-RENDER
  }

  const submitScore = async (fighterAScore: string, fighterBScore: string, comments: string) => {

    try {
      let isFightStopped = false;

      //ONLY EXECUTES IF USER HAS COMMENTS ADDED FOR THE ROUND
      if (comments && comments.trim().length > 0) {
        let data = new FormData();
        data.append("Round_ID", String(activeRound?.round_ID));
        data.append("User_ID", String(auth.id));
        data.append("Thoughts", comments);
        data.append("RoundNumber", String(activeRound?.roundNumber))

        const commentResponse = await axios.post(API_BASE_URL + API_ENDPOINT_COMMENTS, data, {
          headers: { 'Content-Type': 'multipart/form-data' },
        })

        if (commentResponse.data.isSuccess) {
          console.log('Comment aded sucessfully', commentResponse.data.result)
        } else {
          console.error('Error updating comments:', commentResponse.data.message);
        }
      }


      //TODO: If the fighter A or B score is 99 or -99, this indicates that the fight was stopped early.
      if (fighterAScore === TOKENS.WIN_STRING || fighterBScore === TOKENS.WIN_STRING) {
        alert('FIGHT OVER');
        isFightStopped = true;
        let winner;
        if (fighterAScore === TOKENS.WIN_STRING) {
          fighterAScore = TOKENS.WIN_NUMBER.toString();
          fighterBScore = TOKENS.LOSE_NUMBER.toString();
          winner = "fighter_A"
        } else {
          fighterBScore = TOKENS.WIN_NUMBER.toString();
          fighterAScore = TOKENS.LOSE_NUMBER.toString();
          winner = "fighte_B"
        }
        endScorecard(activeRound?.round_ID, winner);
      }




      //ROUND ENDPOINT
      let data = new FormData();
      data.append("Scorecard_ID"
        , String(scorecard.scorecard_ID));
      data.append("RoundNumber", String(activeRound?.roundNumber ?? 1));
      data.append("FighterA_ID", String(activeRound?.fighterA_ID ?? ''));
      data.append("FighterB_ID", String(activeRound?.fighterB_ID ?? ''));
      data.append("FighterA_Score", fighterAScore);
      data.append("FighterB_Score", fighterBScore);
      // data.append("Comments", comments ?? '');

      const response = await axios.put(API_BASE_URL + API_ENDPOINT_ROUNDS, data, {
        headers: { 'Content-Type': 'multipart/form-data' },
      })

      if (response.data.isSuccess) {
        //NOTE: If flag is set to isFightStopped = true, then instead of reload we will navigate back to '/my-scorecards'
        if (!isFightStopped) {
          console.log('Round updated successfully:', response.data.result);
          //Increment to re-render what is needed:
          setRoundScoreCount(roundScoreCount + 1)
          window.location.reload()
        } else {
          //TODO: Have a modal stating the fight scorecard is marked as a stoppage and we will be returned to our list of scorecards.
          navigate("/my-scorecards");
        }

      }
      else {
        console.error('Error updating round:', response.data.message);
      }





    } catch (error) {
      console.error('PUT request failed:', error);
    }

  }

  const endScorecard = async (round_ID: Number | undefined, winner: string) => {
    //HIT API ENDPOINT TO DELETE THE REST OF THE ROUNDS OF SCORECARDS THAT ARE GOING UNUSED: 

    let data = new FormData();
    data.append("scorecardID", String(scorecard.scorecard_ID))
    data.append("roundID", String(round_ID))
    data.append("winner", winner)

    const response = await axios.put(API_BASE_URL + API_ENDPOINT_SCORECARDS, data, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })

    if (response.data.isSuccess) {
      console.log('The scorecard is finalized successfully:', response.data.result);

      //TODO: Have a modal stating the fight scorecard is marked as a stoppage and we will be returned to our list of scorecards.
      //NOTE: Moving this logic up to SubmitScore.ROUND_ENDPOINT.SUCCESS.ELSE
      navigate("/my-scorecards");

    }
    else {
      console.error('Error finalizing scorecard:', response.data.message);
    }
  }

  const findActiveFighters = () => {
    ctxBoxingMatches.some(b => {
      // console.log(b.boxingMatch_ID, 'BID', scorecard.boxingMatch_ID)
      if (b.boxingMatch_ID === scorecard.boxingMatch_ID) {
        // console.log('FOUND?')
        setBoxingMatch(b)
        return true
      }
    })
    ctxFighters.some(f => {
      if (f.fighter_ID == boxingMatch?.fighterA_ID) {
        setFighterA(f)
        return true
      }
    })

    ctxFighters.some(f => {
      if (f.fighter_ID == boxingMatch?.fighterB_ID) {
        setFighterB(f)
        return true
      }
    })

    // console.log(boxingMatch, 'MATCH')

  }

  const findActiveRound = async () => {

    const data = await axios.get(API_BASE_URL + API_ENDPOINT_ROUNDS)

    // console.log(data.data.result, 'FINDING')

    let roundsFromDB: IRound[] = data.data.result

    let roundsForThisCard = roundsFromDB.filter(r => r.scorecard_ID === scorecard.scorecard_ID)

    if (roundsForThisCard) {
      roundsForThisCard.sort((a, b) => a.roundNumber - b.roundNumber)
      roundsForThisCard.some(r => {
        if (!r.isScored) {
          setActiveRound(r)
          return true
        }
      })
    }

  }

  const deleteScorecard = async (scorecardID: number) => {
    try {
      if (!window.confirm("Are you sure you want to delete this scorecard?")) return;

      const response = await axios.delete(`${API_BASE_URL}${API_ENDPOINT_END_SCORECARD}/${scorecardID}`);

      if (response.data.isSuccess) {
        setStatus(`Scorecard #${scorecardID} and all its rounds deleted successfully!`);
      } else {
        setStatus(response.data.errorMessages?.[0] || "Failed to delete scorecard");
      }

      navigate('/my-scorecards')

    } catch (error: any) {
      console.error("Delete error:", error);
      setStatus(
        error.response?.data?.errorMessages?.[0] ||
        "An error occurred while deleting the scorecard"
      );
    }
  };


  return (
    <div>
      ScoreFight
      <div className='mx-auto' style={{ maxWidth: '90%' }}>
        <FadeInSection>
          <UserScorecardBravo isActive={false} scorecard={location.state.scorecard} />
        </FadeInSection>
        {/* <FadeInSection>
                  <CommentsForScorecard fighterAName={fighterA.firstname + ' ' + fighterA.lastname} fighterBName={fighterB.firstname + ' ' + fighterB.lastname} scorecard={location.state.scorecard} />
                </FadeInSection> */}
      </div>
      <FadeInSection>
        {
          scorecard.isScorecardComplete && (
            // <p style={{color: "#fff"}}>SCORECARD COMPLETE</p>
            <button
              onClick={() => deleteScorecard(scorecard.scorecard_ID)}
              className="btn text-danger view-card-button userScorecardScoreOrDeleteBtn"
            >
              DELETE
            </button>
          )
        }
        {
          !scorecard.isScorecardComplete && <ScoreRound handleScoreRound={submitScore} fighterA={fighterA} fighterB={fighterB} scorecard={scorecard} round={activeRound} />
        }

      </FadeInSection>
    </div>
  )
}

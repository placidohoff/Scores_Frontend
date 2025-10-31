import { useLocation, useNavigate } from "react-router-dom";
import { API_ENDPOINTS, API_ROOTS, ENVIRONMENTS, ROUTES } from "../Utils/Constants";
import { useAuth } from "../Context/auth";
import axios from "axios";
import { useEffect, useState } from "react";
import { IApiResponse } from "../Interfaces/IApiResponse";
import { IBoxingMatch } from "../Interfaces/IBoxingMatch";

export default function CreateScorecard() {
  const { auth } = useAuth();
  const location = useLocation();
  // const { fighterAName, fighterBName, boxingMatchID } = location.state || {};
  const [fighterAName, setFighterAName] = useState('');
  const [fighterBName, setFighterBName] = useState('');
  const [boxingMatchID, setBoxingMatchID] = useState('');
  const [userID, setUserID] = useState('');
  const [status, setStatus] = useState('');

  const navigate = useNavigate();

  const API_BASE_URL = process.env.REACT_APP_ENVIRONMENT === ENVIRONMENTS.DEV
    ? API_ROOTS.DEV
    : process.env.REACT_APP_ENVIRONMENT === ENVIRONMENTS.PROD
      ? API_ROOTS.PROD
      : API_ROOTS.WORK

  const API_ENDPOINT_SCORECARDS = process.env.REACT_APP_ENVIRONMENT === ENVIRONMENTS.DEV
    ? API_ENDPOINTS.SCORECARDS.DEV
    : process.env.REACT_APP_ENVIRONMENT === ENVIRONMENTS.PROD
      ? API_ENDPOINTS.SCORECARDS.PROD
      : API_ENDPOINTS.SCORECARDS.WORK


  const API_ENDPOINT_CREATE_ROUNDS = process.env.REACT_APP_ENVIRONMENT === ENVIRONMENTS.DEV
    ? API_ENDPOINTS.ROUNDS.CREATE_ROUNDS_DEV
    : process.env.REACT_APP_ENVIRONMENT === ENVIRONMENTS.PROD
      ? API_ENDPOINTS.ROUNDS.CREATE_ROUNDS_DEV
      : API_ENDPOINTS.ROUNDS.WORK

  useEffect(() => {
    console.log(location.state)
    setFighterAName(location.state.fighterAName);
    setFighterBName(location.state.fighterBName);
    setBoxingMatchID(location.state.boxingMatchID);
    setUserID(auth.id)


    // console.log(location.state.fighterAName);
  }, [])

  const handleSubmit = async (e: any) => {
    //TODO: Hits the "CREATE-SCORECARD" enpoint
    // const {data} = await axios.post(API_BASE_URL+API_ENDPOINT_SCORECARDS)

    process.env.REACT_APP_ENVIRONMENT === ENVIRONMENTS.DEV ? createScorecard(e) : createScorecardSimulation(e)


  }

  const createScorecard = async (e: any) => {
    e.preventDefault();
    //TODO: Front-end validations
    // Since backend uses [FromForm], we must send FormData
    const data = new FormData();
    data.append("BoxingMatch_ID", boxingMatchID);
    data.append("User_ID", userID);

    try {
      const response = await axios.post(
        API_BASE_URL + API_ENDPOINT_SCORECARDS,
        data,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      setStatus(`Scorecard created successfully!`);

      console.log(response.data)

      navigate(ROUTES.CREATE_ROUNDS_NEW_SCORECARD, {
        state: {
          userID,
          scorecardID: response.data.result.scorecard_ID,
          boxingMatchID
        }
      });


    } catch (error) {
      console.error(error);
      console.log(data, "SENT")
      setStatus("Failed to create Scorecard");
    }
  }

  const createScorecardSimulation = (e: any) => {
    alert("test")
    try {

    } catch (e) {

    }
  }

  return (
    <div>
      <div className="back-color-box mx-auto mt-4 border-20" style={{width: '85%'}}>
        <h1>Create Scorecard</h1>
        <b>{fighterAName} vs {fighterBName}</b>
        {/* {boxingMatchID && <p>Match ID: {boxingMatchID}</p>} */}
        <p style={{ color: "#fff" }}>Your account does not yet have a scorecard for this fight. Create one now.</p>

        <div style={{maxWidth: "250px"}} className="d-flex flex-column mx-auto">
          <button className="btn btn-gold my-2" onClick={(e) => handleSubmit(e)}>Create Scorecard</button>
          <button className="btn btn-danger my-2" onClick={(e) => handleSubmit(e)}>Cancel</button>
        </div>
      </div>
      <p>{status}</p>
    </div>
  );
}

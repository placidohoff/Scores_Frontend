import { useLocation } from "react-router-dom";
import { API_ENDPOINTS, API_ROOTS, ENVIRONMENTS } from "../Utils/Constants";
import { useAuth } from "../Context/auth";
import axios from "axios";
import { useState } from "react";

export default function CreateScorecard() {
  const { auth } = useAuth();
  const location = useLocation();
  const { fighterAName, fighterBName, boxingMatchID } = location.state || {};
  const [status, setStatus] = useState('')

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

  const handleSubmit = async (e: any) => {
    //TODO: Hits the "CREATE-SCORECARD" enpoint
    // const {data} = await axios.post(API_BASE_URL+API_ENDPOINT_SCORECARDS)
    console.log('test')
    process.env.REACT_APP_ENVIRONMENT === ENVIRONMENTS.DEV ? createScorecard(e) : createScorecardSimulation(e)


  }

  const createScorecard = async (e: any) => {
    e.preventDefault();
    //TODO: Front-end validations
    // Since backend uses [FromForm], we must send FormData
    const data = new FormData();
    data.append("BoxingMatch_ID", boxingMatchID);
    data.append("User_ID", auth.id);

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
      console.log(response.data);
    } catch (error) {
      console.error(error);
      setStatus("Failed to create Scorecard");
    }
  }

  const createScorecardSimulation = (e: any) => {
    alert("test")
    try{

    }catch(e){
      
    }
  }

  return (
    <div>
      <h1>Create Scorecard</h1>
      <p>Match: {fighterAName} vs {fighterBName}</p>
      {/* {boxingMatchID && <p>Match ID: {boxingMatchID}</p>} */}
      <button onClick={(e) => handleSubmit(e)}>Begin Scoring</button>
      <p>{status}</p>
    </div>
  );
}

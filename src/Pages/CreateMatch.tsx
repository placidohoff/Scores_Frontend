import React, { useEffect, useState } from "react";
import axios from "axios";
import { API_ENDPOINTS, API_ROOTS, ENVIRONMENTS } from "../Utils/Constants";
import { IFighter } from "../Interfaces/IFighter";

const CreateBoxingMatch = () => {
    const [formData, setFormData] = useState({
        FighterA_ID: "",
        FighterB_ID: "",
        ScheduledRounds: "",
    });

    const [status, setStatus] = useState("");
    const [fighters, setFighters] = useState<IFighter[]>();

    const API_BASE_URL = process.env.REACT_APP_ENVIRONMENT === ENVIRONMENTS.DEV
        ? API_ROOTS.DEV
        : process.env.REACT_APP_ENVIRONMENT === ENVIRONMENTS.PROD
            ? API_ROOTS.PROD
            : API_ROOTS.WORK

    const API_ENDPOINT_FIGHTERS = process.env.REACT_APP_ENVIRONMENT === ENVIRONMENTS.DEV
        ? API_ENDPOINTS.FIGHTERS.DEV
        : process.env.REACT_APP_ENVIRONMENT === ENVIRONMENTS.PROD
            ? API_ENDPOINTS.FIGHTERS.PROD
            : API_ENDPOINTS.FIGHTERS.PROD

    const API_ENDPOINT_MATCHES = process.env.REACT_APP_ENVIRONMENT === ENVIRONMENTS.DEV
        ? API_ENDPOINTS.BOXING_MATCHES.DEV
        : process.env.REACT_APP_ENVIRONMENT === ENVIRONMENTS.PROD
            ? API_ENDPOINTS.BOXING_MATCHES.PROD
            : API_ENDPOINTS.BOXING_MATCHES.PROD

    useEffect(() => {
        const getFighters = async () => {
            // const { data } = await axios.get<IFighter[]>(API_BASE_URL + API_ENDPOINT)
            const { data } = await axios.get(API_BASE_URL + API_ENDPOINT_FIGHTERS)
            console.log(data)
            // setFighters(data);
            setFighters(data.result);
        }

        console.log(API_BASE_URL + API_ENDPOINT_FIGHTERS)

        getFighters()

    }, [])

    const handleChange = (e: any) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (e: any) => {
        e.preventDefault();

        //TODO: Front-end validations

        // Since backend uses [FromForm], we must send FormData
        const data = new FormData();
        data.append("FighterA_ID", formData.FighterA_ID);
        data.append("FighterB_ID", formData.FighterB_ID);
        data.append("ScheduledRounds", formData.ScheduledRounds);

        try {
            const response = await axios.post(
                API_BASE_URL + API_ENDPOINT_MATCHES,
                data,
                {
                    headers: {
                        "Content-Type": "multipart/form-data",
                    },
                }
            );
            setStatus(`Match created successfully!`);
            console.log(response.data);
        } catch (error) {
            console.error(error);
            setStatus("Failed to create match");
        }
    };

    return (
        <div className="container mx-auto p-6 max-w-md bg-gray-100 rounded-lg shadow-lg back-color-box mt-5" style={{ borderRadius: "20px", maxWidth: '1000px' }}>
            <h2 className="text-2xl font-semibold mb-4 text-center">
                Create Boxing Match
            </h2>
            <form onSubmit={handleSubmit} className="d-flex flex-column gap-3 align-items-center">
                <div className="d-flex flex-column">
                    <label style={{ textAlign: 'left' }} className="font-medium mt-3">Fighter A:</label>
                    <select
                        name="FighterA_ID"
                        value={formData.FighterA_ID}
                        onChange={handleChange}
                        className="border rounded p-2 inputAlpha"
                        required
                        title="Select Figher A"
                    >
                        <option value="">Select Fighter A</option>
                        {fighters?.map((fighter) => (
                            <option key={fighter.fighter_ID} value={fighter.fighter_ID}>
                                {fighter.firstname} {fighter.lastname}
                            </option>
                        ))}
                    </select>

                    <label style={{ textAlign: 'left' }} className="font-medium mt-3">Fighter B:</label>
                    <select
                        name="FighterB_ID"
                        value={formData.FighterB_ID}
                        onChange={handleChange}
                        className="border rounded p-2 inputAlpha"
                        required
                    >
                        <option value="">Select Fighter B</option>
                        {fighters?.map((fighter) => (
                            <option key={fighter.fighter_ID} value={fighter.fighter_ID}>
                                {fighter.firstname} {fighter.lastname}
                            </option>
                        ))}
                    </select>
                    <label style={{ textAlign: 'left' }} className="font-medium mt-3">Scheduled Rounds:</label>
                    <input
                        type="number"
                        name="ScheduledRounds"
                        value={formData.ScheduledRounds}
                        onChange={handleChange}
                        className="border rounded p-2"
                        required
                    />

                    <button
                        type="submit"
                        className="bg-blue-600 py-2 px-4 rounded hover:bg-blue-700 my-4"
                        // style={{ width: "50%" }}
                    >
                        Submit
                    </button>
                </div>
            </form>

            {status && <p className="mt-4 text-center">{status}</p>}
        </div>
    );
};

export default CreateBoxingMatch;

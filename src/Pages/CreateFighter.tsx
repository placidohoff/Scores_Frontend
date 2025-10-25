import React, { useEffect, useState } from "react";
import axios from "axios";
import { API_ENDPOINTS, API_ROOTS, ENVIRONMENTS } from "../Utils/Constants";
import { IFighter } from "../Interfaces/IFighter";

const CreateFighter = () => {
    const [formData, setFormData] = useState({
        FighterA_ID: "",
        FighterB_ID: "",
        ScheduledRounds: "",
    });

    const [fighterFirstName, setFighterFirstName] = useState('');
    const [fighterLastName, setFighterLastName] = useState('');
    const [status, setStatus] = useState('');



    const API_BASE_URL = process.env.REACT_APP_ENVIRONMENT === ENVIRONMENTS.DEV
        ? API_ROOTS.DEV
        : process.env.REACT_APP_ENVIRONMENT === ENVIRONMENTS.PROD
            ? API_ROOTS.PROD
            : API_ROOTS.WORK

    const API_ENDPOINT = process.env.REACT_APP_ENVIRONMENT === ENVIRONMENTS.DEV
        ? API_ENDPOINTS.FIGHTERS.DEV
        : process.env.REACT_APP_ENVIRONMENT === ENVIRONMENTS.PROD
            ? API_ENDPOINTS.FIGHTERS.PROD
            : API_ENDPOINTS.FIGHTERS.PROD


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
        data.append("Firstname", fighterFirstName);
        data.append("Lastname", fighterLastName);

        try {
            const response = await axios.post(
                API_BASE_URL + API_ENDPOINT,
                data,
                {
                    headers: {
                        "Content-Type": "multipart/form-data",
                    },
                }
            );
            setStatus(`Fighter created successfully!`);
            console.log(response.data);
        } catch (error) {
            console.error(error);
            setStatus("Failed to create match");
        }
    };

    return (
        <div className="container mx-auto p-6 max-w-md bg-gray-100 rounded-lg shadow-lg back-color-box mt-5 border-20 justify-content-center d-flex">
            <div className="d-flex flex-column">
                <h2 className="text-2xl font-semibold mb-4 text-center">
                    Create Fighter
                </h2>
                <form onSubmit={handleSubmit} className="d-flex flex-column gap-3">
                    <label style={{ textAlign: 'left' }} className="font-medium">Firstname:</label>
                    <input
                        type="text"
                        value={fighterFirstName}
                        onChange={(e) => setFighterFirstName(e.target.value)}
                        className="inputAlpha"
                    />

                    <label style={{ textAlign: 'left' }} className="font-medium">Lastname</label>
                    <input
                        type="text"
                        value={fighterLastName}
                        onChange={(e) => setFighterLastName(e.target.value)}
                        className="inputAlpha"
                    />


                    <button
                        type="submit"
                        className="bg-blue-600 py-2 px-4 rounded hover:bg-blue-700 mx-auto mb-4"
                        style={{ width: "100%" }}
                    >
                        Submit
                    </button>
                </form>
            </div>
            {status && <p className="mt-4 text-center">{status}</p>}
        </div>
    );
};

export default CreateFighter;

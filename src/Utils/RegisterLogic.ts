import axios from "axios";
import bcrypt from "bcryptjs";
import { IUser, IUserRegister, IUserTest } from "../Interfaces/IUser";
import { API_ENDPOINTS, API_ROOTS, ENVIRONMENTS } from "./Constants";
import { IApiResponse } from "../Interfaces/IApiResponse";

interface RegisterRequest {
    displayName: string;
    email: string;
    password: string;
    role: string; // "Admin" | "Customer"
}

interface RegisterResponse {
    message: string;
    success: boolean;
    //   token: string;
}

const API_BASE_URL = process.env.REACT_APP_ENVIRONMENT === ENVIRONMENTS.DEV
    ? API_ROOTS.DEV
    : process.env.REACT_APP_ENVIRONMENT === ENVIRONMENTS.PROD
        ? API_ROOTS.PROD
        : API_ROOTS.WORK

const API_ENDPOINT_AUTH = process.env.REACT_APP_ENVIRONMENT === ENVIRONMENTS.DEV
    ? API_ENDPOINTS.AUTH.DEV
    : process.env.REACT_APP_ENVIRONMENT === ENVIRONMENTS.PROD
        ? API_ENDPOINTS.AUTH.PROD
        : API_ENDPOINTS.AUTH.WORK

export const RegisterLogic = async (
    model: RegisterRequest
): Promise<RegisterResponse> => {
    try {

        const res = await axios.get(API_BASE_URL + API_ENDPOINT_AUTH);

        console.log(res, 'FETCH')

        // Step 2: Check if display name or email already exists
        const existingUser = res.data.result.find(
            (u: IUser) =>
                u.displayName.toLowerCase() === model.displayName.toLowerCase() ||
                u.email.toLowerCase() === model.email.toLowerCase()
        );

        if (existingUser) {
            throw new Error("Display name or email already exists");
        }

        // Step 3: Hash password using bcrypt
        const salt = await bcrypt.genSalt(10);
        const passwordHash = await bcrypt.hash(model.password, salt);

        const formData = new FormData();
        formData.append("DisplayName", model.displayName);
        formData.append("Email", model.email);
        formData.append("Password", model.password);
        formData.append("Role", model.role);


        const result: IApiResponse<RegisterResponse> = await axios.post(API_BASE_URL + API_ENDPOINT_AUTH+'/register', formData, {
            headers: { "Content-Type": "multipart/form-data" },
        })

        if (!result.IsSuccess) {
            throw new Error(result.ErrorMessages?.[0] || "Login failed");
        }

        // Step 6: Return simulated API-style response
        return {
            message: "User successfully registered",
            success: true
        }

    } catch (err: any) {
        return {
            message: err.message || "Registration failed",
            success: false,
            //   token: null
        };
    }
};

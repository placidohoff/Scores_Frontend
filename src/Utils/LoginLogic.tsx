import axios from "axios";
import { API_ROOTS, ENVIRONMENTS } from "./Constants";
import jwtDecode from "jwt-decode";

interface LoginRequest {
  displayName: string;
  password: string;
}

interface LoginResponse {
  displayName: string;
  token: string;
  id: string;
}

interface JwtPayload{
  displayName: string;
  email: string;
  exp: number;
  iat: number;
  id: string;
  nbf: number;
  role: string;
}

const API_BASE_URL =
  process.env.REACT_APP_ENVIRONMENT === ENVIRONMENTS.DEV
    ? API_ROOTS.DEV
    : process.env.REACT_APP_ENVIRONMENT === ENVIRONMENTS.PROD
    ? API_ROOTS.PROD
    : API_ROOTS.WORK;

export const LoginLogic = async (
  model: LoginRequest
): Promise<LoginResponse> => {
  try {
    const formData = new FormData();
    formData.append("DisplayName", model.displayName);
    formData.append("Password", model.password);

    // ✅ Make sure there's a "/" before "api"
    const response = await axios.post(
      `${API_BASE_URL}Auth/login`,
      formData,
      {
        headers: { "Content-Type": "multipart/form-data" },
      }
    );

    console.log("API response:", response.data);

    const data = response.data;
    if (!data.isSuccess) {
      throw new Error(data.errorMessages?.[0] || "Login failed");
    }

    const result = data.result;
    localStorage.setItem("token", result.token);
    localStorage.setItem("displayName", result.displayName);

    const decoded = jwtDecode<JwtPayload>(result.token)
    console.log(decoded, 'DECODED')

    const payload = {
    id: decoded.id,
    displayName: decoded.displayName,
    role: decoded.role,
    token: result.token
  };

    return payload;
  } catch (err: any) {
    console.error("Login error:", err.response?.data || err.message);
    throw new Error(
      err.response?.data?.errorMessages?.[0] ||
        err.message ||
        "An error occurred during login"
    );
  }
};

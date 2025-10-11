import axios from "axios";
import bcrypt from "bcryptjs";
// import * as jwt from "jsonwebtoken";
import { IUser } from "../Interfaces/IUser";

interface LoginRequest {
  displayName: string;
  password: string;
}

interface LoginResponse {
  displayName: string;
  token: string;
  id: string,
}

const mockSecret = "super_secret_for_testing"; // only for simulation

export const LoginSimulation = async (
  model: LoginRequest
): Promise<LoginResponse> => {
  // Step 1: Load users (simulate from local JSON or localStorage)
  let users: IUser[] = [];

  try {
    // const stored = localStorage.getItem("users");
    const { data } = await axios.get("/Data/Users.json");
    users = data;
    // if (stored) {
    //   users = JSON.parse(stored);
    // } else {
    //   const { data } = await axios.get("/Data/Users.json");
    //   users = data;
    // }
  } catch (err) {
    console.error("Could not load users:", err);
    throw new Error("Failed to load user data.");
  }


  // Step 2: Find user by username/display name (case-insensitive)
  const user = users.find(
    (u: IUser) => u.displayName.toLowerCase() === model.displayName.toLowerCase()
  );


  if (!user) {
    throw new Error("Username or password is incorrect");
  }

  // Step 3: Manual compare password (simulation)
  const isValid = model.password == "123456" ? true : false;
  // const isValid = await bcrypt.compare(model.password, user.passwordHash);
  if (!isValid) {
    throw new Error("Username or password is incorrect");
  }

  // Step 4: Create JWT token using jsonwebtoken
  const payload = {
    id: user.id,
    displayName: user.displayName,
    role: user.role,
    token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJkaXNwbGF5TmFtZSI6InBtaG9mZiIsImlkIjoiZGFkMDUxMDItYjFjOC00ODhlLWEyNmEtNGRiZTI1MzZlMTY3IiwiZW1haWwiOiJwbWhvZmZAdGVzdC5jb20iLCJyb2xlIjoiYWRtaW4iLCJuYmYiOjE3NTk5NzgxMjIsImV4cCI6MTc2MDU4MjkyMiwiaWF0IjoxNzU5OTc4MTIyfQ.eivh_tQ5KD5TgWS9sgjSiNmeCZl3Xs8UECJTbrk2YYA"
  };

  // expiresIn can be "1h", "7d", etc.
  // const token = jwt.sign(payload, mockSecret, { expiresIn: "7d" });

  // Step 5: Return simulated response
  return payload;
};

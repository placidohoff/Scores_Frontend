import React from 'react';
import axios from 'axios';
import bcrypt  from "bcryptjs"
import { IUser } from '../Interfaces/IUser';
// import jwt from "jsonwebtoken";

interface LoginRequest {
    userName: string;
    password: string;
}

interface LoginResponse {
    displayName: string;
    token: string;
}

const mockSecret = "super_secret_for_testing"

// export const createMockToken = (user: any) => {
//     return jwt.sign(user, mockSecret, {expiresIn: "1h"});
// }

export const LoginSimulation = async (model: LoginRequest): Promise<LoginResponse> => {
    // Step 1: Fetch local user data
    const { data: users } = await axios.get("/data/users.json");

    // Step 2: Find the user by DisplayName (case-insensitive)
    const user = users.find(
        (u: IUser) => u.userName.toLowerCase() === model.userName.toLowerCase()
    );

    if (!user) {
        throw new Error("Username or password is incorrect");
    }

// Step 3: Compare hashed password using bcrypt
  const isValid = await bcrypt.compare(model.password, user.passwordHash);
  if (!isValid) {
    throw new Error("Username or password is incorrect");
  }


     // Step 4: Create fake JWT token
  const header = btoa(JSON.stringify({ alg: "HS256", typ: "JWT" }));
  const payload = btoa(
    JSON.stringify({
      id: user.id,
      displayName: user.displayName,
      role: user.role,
      exp: Date.now() + 7 * 86400000,
    })
  );
  const signature = btoa("fake-signature");
  const fakeToken = `${header}.${payload}.${signature}`;

    // Step 5: Return a structure similar to your real API response
    return {
        displayName: user.displayName,
        token: fakeToken,
    };
}

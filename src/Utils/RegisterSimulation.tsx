import axios from "axios";
import bcrypt from "bcryptjs";
import { IUser, IUserTest } from "../Interfaces/IUser";

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

export const RegisterSimulation = async (
  model: RegisterRequest
): Promise<RegisterResponse> => {
  try {
    // Step 1: Load existing users (from public/data/users.json)
    const { data: users } = await axios.get("/data/users.json");

    // Step 2: Check if display name or email already exists
    const existingUser = users.find(
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

    // Step 4: Create new user object
    const newUser: IUserTest = {
      id: users.length + 1,
      displayName: model.displayName,
      userName: model.displayName, // mirror .NET mapping
      email: model.email,
      passwordHash,
      role: model.role?.toLowerCase() === "admin" ? "Admin" : "Customer",
    };

    // Step 5: Simulate saving to "database" (localStorage fallback)
    const updatedUsers = [...users, newUser];
    localStorage.setItem("users", JSON.stringify(updatedUsers));

    // Step 6: Return simulated API-style response
    return {
      message: `User ${model.displayName} registered successfully as ${newUser.role}`,
      success: true,
    //   token: 'test'
    };
  } catch (err: any) {
    return {
      message: err.message || "Registration failed",
      success: false,
    //   token: null
    };
  }
};

import React, { useState } from "react";
import { RegisterSimulation } from "../Utils/RegisterSimulation";
import { API_ENDPOINTS, API_ROOTS, ENVIRONMENTS } from "../Utils/Constants";
import { RegisterLogic } from "../Utils/RegisterLogic";

export default function Register() {
  const [form, setForm] = useState({
    displayName: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "Customer",
  });

  const [message, setMessage] = useState("");


  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();

    if (form.password !== form.confirmPassword) {
      setMessage("Passwords do not match.");
      return;
    }

    try {
      // const res = await RegisterSimulation({
      const res = await RegisterLogic({
        displayName: form.displayName,
        email: form.email,
        password: form.password,
        role: form.role,
      });

      if (res.success) {
        setMessage(res.message);
        setForm({
          displayName: "",
          email: "",
          password: "",
          confirmPassword: "",
          role: "Customer",
        });
      } else {
        setMessage(res.message || "Registration failed.");
      }
    } catch (err: any) {
      console.error(err);
      setMessage("An unexpected error occurred.");
    }
  };

  return (
    <div className="register-container" style={{ maxWidth: 400, margin: "0 auto" }}>
      <h2>Register (Simulated)</h2>

      <form onSubmit={handleRegister} className="d-flex flex-column">
        <input
          type="text"
          name="displayName"
          placeholder="Display Name"
          value={form.displayName}
          onChange={handleChange}
          required
        />
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={form.email}
          onChange={handleChange}
          required
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={form.password}
          onChange={handleChange}
          required
        />
        <input
          type="password"
          name="confirmPassword"
          placeholder="Confirm Password"
          value={form.confirmPassword}
          onChange={handleChange}
          required
        />
        <select name="role" value={form.role} onChange={handleChange}>
          <option value="User">User</option>
          <option value="Admin">Admin</option>
        </select>

        <button type="submit" style={{ marginTop: "10px" }}>
          Register
        </button>
      </form>

      {message && <p style={{ marginTop: "15px" }}>{message}</p>}
    </div>
  );
}

import React, { useState } from "react";
import { RegisterSimulation } from "../Utils/RegisterSimulation";
import { API_ENDPOINTS, API_ROOTS, ENVIRONMENTS } from "../Utils/Constants";
import { RegisterLogic } from "../Utils/RegisterLogic";
import { FadeInSection } from "../Components";

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
    <FadeInSection>
      <div className="container d-flex justify-content-center mt-5 back-color-box b-rad-20" >
        <div className="row">
          <h2>Register a new account</h2>

          <form onSubmit={handleRegister} className="d-flex flex-column">
            <label className="mb-4 text-left" htmlFor="displayName">
              Display Name:
              <input
                type="text"
                name="displayName"
                placeholder="Display Name"
                value={form.displayName}
                onChange={handleChange}
                className="form-control"
                required
              />
            </label>
            <label className="text-left mb-4" htmlFor="email">
              Email:
              <input
                type="email"
                name="email"
                placeholder="Email"
                value={form.email}
                onChange={handleChange}
                className="form-control"
                required
              />
            </label>
            <label className="text-left mb-4" htmlFor="password">
              Password:
              <input
                type="password"
                name="password"
                placeholder="Password"
                value={form.password}
                onChange={handleChange}
                className="form-control"
                required
              />
            </label>
            <label className="text-left mb-4" htmlFor="confirmPassword">
              Confirm Password:
              <input
                type="password"
                name="confirmPassword"
                placeholder="Confirm Password"
                value={form.confirmPassword}
                onChange={handleChange}
                className="form-control"
                required
              />
            </label>
            <select name="role" value={form.role} onChange={handleChange}>
              <option value="User">User</option>
              <option value="Admin">Admin</option>
            </select>

            <button type="submit" className="btn btn-gold my-4" style={{ marginTop: "10px" }}>
              Register
            </button>
          </form>
        </div>
        {message && <p style={{ marginTop: "15px" }}>{message}</p>}
      </div>
    </FadeInSection>
  );
}

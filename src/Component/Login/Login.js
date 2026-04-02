import React, { useState } from "react";
import { useNavigate, Navigate } from "react-router-dom";
import api from "../../api/api";

const Login = () => {
  const navigate = useNavigate();

  const loggedUser = localStorage.getItem("token");

  const [credentials, setCredentials] = useState({
    username: "",
    password: "",
    role: "user",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // AFTER hooks conditional return
if (loggedUser) {
  return <Navigate to="/" replace />;
}


  const handleChange = (e) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value });
  };
  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await api.post("/login", {
        username: credentials.username,
        password: credentials.password,
      });

      const data = res.data;

      localStorage.setItem("token", data.token);
     
      navigate("/", { replace: true });
    } catch (err) {
      setError("Server error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <form
        onSubmit={handleLogin}
        className="w-full max-w-md bg-white rounded-xl shadow-lg p-8"
      >
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">
          User Login
        </h2>

        {error && (
          <p className="text-red-500 text-sm mb-3 text-center">{error}</p>
        )}

        <input
          type="text"
          name="username"
          placeholder="👤 Username"
          value={credentials.username}
          onChange={handleChange}
          required
          className="w-full mb-4 px-4 py-2 border rounded-md"
        />

        <input
          type="password"
          name="password"
          placeholder="🔒 Password"
          value={credentials.password}
          onChange={handleChange}
          required
          className="w-full mb-6 px-4 py-2 border rounded-md"
        />
        <select
          name="role"
          value={credentials.role}
          onChange={handleChange}
          className="w-full mb-4 px-4 py-2 border rounded-md"
        >
          <option value="user">User</option>
          <option value="admin">Admin</option>
        </select>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 text-white py-2 rounded-md"
        >
          {loading ? "Logging in..." : "Login"}
        </button>

        <div className="mt-6 text-center text-sm">
          <p>Don’t have an account?</p>
          <button
            type="button"
            onClick={() => navigate("/register")}
            className="text-blue-600 hover:underline"
          >
            Register
          </button>
        </div>
      </form>
    </div>
  );
};

export default Login;

import React, { useState } from "react";
import { useNavigate, Navigate } from "react-router-dom";
import { isLoggedIn } from "../../utils/auth";

const Login = () => {
  const navigate = useNavigate();

  const [credentials, setCredentials] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  if (isLoggedIn()) {
    return <Navigate to="/" replace />;
  }


  const handleChange = (e) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value });
  };
  const handleLogin = (e) => {
    e.preventDefault();
    setError("");

    const users = JSON.parse(localStorage.getItem("users")) || [];
    const user = users.find(
      (u) => u.email === credentials.email && u.password === credentials.password
    );

    if (!user) {
      setError("Invalid email or password");
      return;
    }

    localStorage.setItem("token", "local-auth");
    localStorage.setItem("user", JSON.stringify({ username: user.name, role: user.role || "user" }));
    navigate("/", { replace: true });
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
          type="email"
          name="email"
          placeholder="📧 Email"
          value={credentials.email}
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
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 text-white py-2 rounded-md"
        >
          Login
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

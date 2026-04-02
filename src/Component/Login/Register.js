import React from "react";
import { useNavigate } from "react-router-dom";

const Register = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = React.useState({
    name: "",
    email: "",
    password: "",
    role: "user",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleRegister = (e) => {
    e.preventDefault();

    const users = JSON.parse(localStorage.getItem("users")) || [];

    // Check if email already exists
    if (users.find((user) => user.email === formData.email)) {
      alert("Email already registered");
      return;
    }

    // Save new user
    users.push(formData);
    localStorage.setItem("users", JSON.stringify(users));

    alert("Registration Successful");
    navigate("/login"); // redirect to login
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <form
        onSubmit={handleRegister}  
        className="w-full max-w-md bg-white rounded-xl shadow-lg p-8"
      >
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">
          User Register
        </h2>

        <input
          className="w-full mb-4 px-4 py-2 border border-gray-300 rounded-md
             focus:outline-none focus:ring-2 focus:ring-blue-600"
          type="text"
          name="name"
          placeholder="👤 Name"
          value={formData.name}
          onChange={handleChange}
          required
        />

        <input
          className="w-full mb-4 px-4 py-2 border border-gray-300 rounded-md
             focus:outline-none focus:ring-2 focus:ring-blue-600"
          type="email"
          name="email"
          placeholder="📧 Email"
          value={formData.email}
          onChange={handleChange}
          required
        />

        <input
          className="w-full mb-6 px-4 py-2 border border-gray-300 rounded-md
             focus:outline-none focus:ring-2 focus:ring-blue-600"
          type="password"
          name="password"
          placeholder="🔑 Password"
          value={formData.password}
          onChange={handleChange}
          required
        />

        <button
          className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-md
             font-medium transition duration-200"
          type="submit"
        >
          Register
        </button>
      </form>
    </div>
  );
};

export default Register;

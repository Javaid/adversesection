const jwt = require("jsonwebtoken");
const sequelize = require("../config/db");
const { QueryTypes, Sequelize } = require("sequelize");
const crypto = require("crypto");
const { login } = require("../services/user.service");

const loginController = async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      throw new Error("Username and password are required");
    }

    const { user, token } = await login(username, password);

    if (!user) {
      throw new Error("Invalid username or password");
    }

    res.json({
      message: "Login successful",
      // user: { id: user.user_id, username: user.username, role: user.role },
      token,
    });
  } catch (error) {
    res.status(401).json({ message: error.message });
  }
};

// const User = require("../models/user");

// const login=async(req,res)=>{
//   try{
//     const{email,password}=req.body;

//       const user = await User.findOne({ where: { email } });
//     if (!user) {
//       return res.status(401).json({ message: "Invalid Email" });
//     }
//       if (password !== user.password) {
//       return res.status(401).json({ message: "Invalid Password" });
//     }
//     //yhis is for token
//      const token = jwt.sign(
//       { id: user.id, email: user.email },
//       process.env.JWT_SECRET,
//       { expiresIn: "1h" }
//     );
//       res.status(200).json({ message: "Login successful", token });
//      } catch (err) {

//     res.status(500).json({ message: "Server Error", error: err.message });
//   }
// };

// const login = (req, res) => {
//   const { email, password } = req.body;
//   const user = {
//     email: "maryam@gmail.com",
//   
//   };

//   if (email !== user.email) {
//     return res.status(401).json({ message: "Invalid Email" });
//   } else if (password !== user.password) {
//     return res.status(401).json({ message: "Invalid password" });
//   } else {
//     const token = jwt.sign({ email: user.email }, process.env.JWT_SECRET, {
//       expiresIn: "1h",
//     });
//     res.json({ message: "Login Successfull", token });
//   }
// };

//this logic for search

const search = (req, res) => {
  const { name, Npi } = req.body;
  const Providers = [
    { providerName: "Dr. Sarah Elizabeth Mitchell", npi: "1234567890" },
    { providerName: "Dr. James Robert Chen", npi: "9876543210" },
    { providerName: "Dr. Maria Elena Rodriguez", npi: "5678901234" },
    { providerName: "Dr. William Thomas Anderson", npi: "3456789012" },
    { providerName: "Dr.Patricia Ann Thompson", npi: "4567890123" },
  ];

  const searchUser = Providers.find(
    (p) => (name && p.providerName === name) || (Npi && p.npi === Npi),
  );

  if (!searchUser) {
    return res.status(404).json({ message: "Search not found" });
  } else {
    res.json({ message: "Search Successfull" });
  }
};

//api fot stats
const stats = (req, res) => {
  // const{name,status}=req.body;
  const statsData = [
    { name: "Dr. Sarah Elizabeth Mitchell", status: "Clear" },
    { name: "Dr. James Robert Chen", status: "Review" },
    { name: "Dr. Maria Elena Rodriguez", status: "Clear" },
    { name: "Dr. William Thomas Anderson", status: "Risk" },
    { name: "Dr.Patricia Ann Thompson", status: "Clear" },
    //  {providerName:"Dr. Sarah Elizabeth Mitchell", npi:"1234567890" }
  ];
  const totalProviders = statsData.length;
  //this is for clear status
  const clear = statsData.filter((s) => s.status === "Clear").length;
  //this is for review status
  const underReview = statsData.filter((s) => s.status === "Review").length;

  //this is for risk status
  const At_Risk = statsData.filter((s) => s.status === "Risk").length;

  res.json({
    totalProviders,
    clear,
    underReview,
    At_Risk,
  });
};

//this api for providers list
const providersList = (req, res) => {
  const List = [
    {
      providersName: "Dr. Sarah Elizabeth Mitchell, MD, FACP",
      npi: "1234567890",
      Speciality: "Internal Medicine",
      Location: "New York, NY",
      NPI_Status: "Active",
      MIPS: "92.5/100",
      Payment: "$45.7k",
      Medicare: "Active",
      Risk: "Clear",
    },
    {
      providersName: "Dr. James Robert Chen, MD,PhD",
      npi: "9876543210",
      Speciality: "Cardiology",
      Location: "San Francisco, CA",
      NPI_Status: "Active",
      MIPS: "78.3/100",
      Payment: "$89.2k",
      Medicare: "Active",
      Risk: "Review",
    },
    {
      providersName: "Dr. Maria Elena Rodriguez, MD,FACOG",
      npi: "5678901234",
      Speciality: "Obstetrics & Gynecology",
      Location: "Houston, TX",
      NPI_Status: "Active",
      MIPS: "95.2/100",
      Payment: "$12.5k",
      Medicare: "Active",
      Risk: "Clear",
    },
    {
      providersName: "Dr. William Thomas Anderson, MD",
      npi: "3456789012",
      Speciality: "Orthopedic Surgery",
      Location: "Sarasota, FL",
      NPI_Status: "Inactive",
      MIPS: "0/100",
      Payment: "$0.0k",
      Medicare: "Active",
      Risk: "Risk",
    },
    {
      providersName: "Dr.Patricia Ann Thompson, MD,MPH",
      npi: "4567890123",
      Speciality: "Family Medicine",
      Location: "Seattle, WA",
      NPI_Status: "Active",
      MIPS: "88.7/100",
      Payment: "$3,2k",
      Medicare: "Active",
      Risk: "Clear",
    },
  ];
  res.json({
    totalProviders: List.length,
    List,
  });
};

module.exports = { loginController, search, stats, providersList };

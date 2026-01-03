const express = require("express");

const cors = require("cors");
const jwt = require("jsonwebtoken");



const app = express();
const JWT_SECRET = "mysecretkey";



app.use(express.json());

app.use(cors());
app.use(express.static("../"));



const users = [];



app.get("/", (req, res) => {
  res.send("Backend is running");
});
app.get("/test", (req, res) => {
  res.send("Test route working");
});



app.post("/register", (req, res) => {
  const { email, password } = req.body;

  users.push({ email, password });
  res.send("User registered");
});

app.post("/login", (req, res) => {
  const { email, password } = req.body;

  const user = users.find(
    u => u.email === email && u.password === password
  );

  if (!user) {
    return res.status(401).json({
      message: "Invalid credentials"
  });
  
  }

  const token = jwt.sign(
    { email: user.email },
    JWT_SECRET,
    { expiresIn: "1h" }
  );

  res.json({
    message: "Login successful",
    token: token
  });
});
// Secure VPN config API (JWT protected)
app.get("/vpn-config", (req, res) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
      return res.status(401).send("Access denied");
  }

  const token = authHeader.split(" ")[1];

  try {
      jwt.verify(token, JWT_SECRET);

      const sampleConfig = `
# SecureVPN Demo Config
# This is a sample VPN configuration

client
dev tun
proto udp
remote vpn.example.com 1194
resolv-retry infinite
nobind
persist-key
persist-tun
cipher AES-256-CBC
auth SHA256
verb 3
`;

      res.send(sampleConfig);

  } catch (error) {
      res.status(401).send("Invalid token");
  }
});






app.listen(3000, () => {
  console.log("Server running on http://localhost:3000");
});



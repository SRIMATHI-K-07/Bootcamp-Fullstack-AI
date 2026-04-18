require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors"); 
const Student = require("./models/Student");

const app = express();
app.use(cors());              
app.use(express.json());

app.post("/add", async (req, res) => {
  const student = new Student(req.body);
  await student.save();
  res.send(student);
});

app.get("/students", async (req, res) => {
  const students = await Student.find({ isDeleted: false });
  res.send(students);
});

app.put("/update/:id", async (req, res) => {
  const updated = await Student.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true }
  );
  res.send(updated);
});


mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Connected"))
  .catch(err => console.log(err));

app.get("/", (req, res) => {
  res.send("Server is running");
});

app.delete("/delete/:id", async (req, res) => {
  await Student.findByIdAndUpdate(req.params.id, {
    isDeleted: true
  });
  res.send("Soft deleted");
});

const jwt = require("jsonwebtoken");
const verifyToken = (req, res, next) => {
  const header = req.headers.authorization;

  if (!header) return res.status(403).send("No token");

  const token = header.split(" ")[1];

  try {
    const decoded = jwt.verify(token, "secretkey");
    req.user = decoded;
    next();
  } catch {
    res.status(401).send("Invalid token");
  }
};

app.post("/login", (req, res) => {
  const { username, password } = req.body;

  if (username === "admin" && password === "1234") {
    const token = jwt.sign({ username }, "secretkey", {
      expiresIn: "1h"
    });

    res.json({ token });
  } else {
    res.status(401).send("Invalid credentials");
  }
});

app.get("/profile", verifyToken, (req, res) => {
  res.send("Welcome " + req.user.username);
});

app.listen(5000, () => {
  console.log("Server running on port 5000");
});

app.get("/students", verifyToken, async (req, res) => {
  const students = await Student.find({ isDeleted: false });
  res.send(students);
});
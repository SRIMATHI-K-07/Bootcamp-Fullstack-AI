const express = require("express");
const mongoose = require("mongoose");
const Student = require("./models/Student");

const app = express();
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


mongoose.connect("mongodb://Srimathi:Srimathi@ac-rqiqnty-shard-00-00.mrefsk2.mongodb.net:27017,ac-rqiqnty-shard-00-01.mrefsk2.mongodb.net:27017,ac-rqiqnty-shard-00-02.mrefsk2.mongodb.net:27017/studentDB?ssl=true&replicaSet=atlas-2p9lyw-shard-0&authSource=admin&appName=Cluster0")
  .then(() => console.log("MongoDB Connected"))
  .catch(err => console.log(err));

app.get("/", (req, res) => {
  res.send("Server is running");
});

app.listen(5000, () => {
  console.log("Server running on port 5000");
});

app.delete("/delete/:id", async (req, res) => {
  await Student.findByIdAndUpdate(req.params.id, {
    isDeleted: true
  });
  res.send("Soft deleted");
});
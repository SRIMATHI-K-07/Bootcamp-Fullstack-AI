import React, { useState, useEffect } from "react";
import StudentCard from "./StudentCard";

function App() {
  const [students, setStudents] = useState([]);
  const [name, setName] = useState("");
  const [course, setCourse] = useState("");
  const [editIndex, setEditIndex] = useState(null);
  const [search, setSearch] = useState("");

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("students"));
    if (saved) setStudents(saved);
  }, []);

  useEffect(() => {
    localStorage.setItem("students", JSON.stringify(students));
  }, [students]);

  const handleSubmit = () => {
    if (!name || !course) return;

    if (editIndex !== null) {
      const updated = [...students];
      updated[editIndex] = { name, course, status: "Active" };
      setStudents(updated);
      setEditIndex(null);
    } else {
      setStudents([
        ...students,
        { name, course, status: "Active" },
      ]);
    }

    setName("");
    setCourse("");
  };

  const handleDelete = (index) => {
    setStudents(students.filter((_, i) => i !== index));
  };

  const handleEdit = (index) => {
    setName(students[index].name);
    setCourse(students[index].course);
    setEditIndex(index);
  };

 
  const filteredStudents = students.filter((s) =>
    s.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #0f172a, #1e293b)",
        padding: "20px",
        fontFamily: "Poppins",
        color: "white",
        textAlign: "center",
      }}
    >
      <h1>🎓 Student Manager Pro</h1>

      {}
      <input
        type="text"
        placeholder="🔍 Search student..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        style={{
          padding: "10px",
          width: "250px",
          borderRadius: "8px",
          border: "none",
          marginBottom: "20px",
        }}
      />

      {}
      <div
        style={{
          background: "#1e293b",
          padding: "20px",
          borderRadius: "15px",
          maxWidth: "400px",
          margin: "auto",
        }}
      >
        <input
          type="text"
          placeholder="Enter Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          style={{ width: "100%", padding: "10px", marginBottom: "10px" }}
        />

        <input
          type="text"
          placeholder="Enter Course"
          value={course}
          onChange={(e) => setCourse(e.target.value)}
          style={{ width: "100%", padding: "10px", marginBottom: "10px" }}
        />

        <button
          onClick={handleSubmit}
          style={{
            width: "100%",
            padding: "10px",
            background: editIndex !== null ? "#f59e0b" : "#22c55e",
            border: "none",
            borderRadius: "8px",
            color: "white",
          }}
        >
          {editIndex !== null ? "Update Student" : "Add Student"}
        </button>
      </div>

      {}
      <div style={{ maxWidth: "400px", margin: "20px auto" }}>
        {filteredStudents.length === 0 ? (
          <p>No students found</p>
        ) : (
          filteredStudents.map((student, index) => (
            <StudentCard
              key={index}
              student={student}
              onDelete={() => handleDelete(index)}
              onEdit={() => handleEdit(index)}
            />
          ))
        )}
      </div>
    </div>
  );
}

export default App;
import React, { useState, useEffect } from "react";
import StudentCard from "./StudentCard";

function App() {
  const [students, setStudents] = useState([
    { id: 1, name: "Sassy", course: "AI" },
    { id: 2, name: "Ram", course: "React" },
    { id: 3, name: "Priya", course: "Node" },
    { id: 4, name: "John", course: "JS" },
    { id: 5, name: "Anu", course: "Python" }
  ]);

  const [name, setName] = useState("");
  const [course, setCourse] = useState("");
  const [editIndex, setEditIndex] = useState(null);
  const [search, setSearch] = useState("");
  const [apiUsers, setApiUsers] = useState([]);

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("students"));
    if (saved) setStudents(saved);
  }, []);

  useEffect(() => {
    localStorage.setItem("students", JSON.stringify(students));
  }, [students]);

  useEffect(() => {
    fetch("https://jsonplaceholder.typicode.com/users")
      .then((res) => res.json())
      .then((data) => setApiUsers(data));
  }, []);

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
        { id: students.length + 1, name, course, status: "Active" }
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
        padding: "30px",
        fontFamily: "Poppins",
        color: "white"
      }}
    >
      <h1 style={{ textAlign: "center", marginBottom: "20px" }}>
        🎓 Student Manager Pro
      </h1>

      {/* Initial List */}
      <div style={{ textAlign: "center", marginBottom: "20px" }}>
        <h2>📋 Initial Student List</h2>
        {students.map((student) => (
          <p key={student.id}>
            {student.name} - {student.course}
          </p>
        ))}
      </div>

      {/* Search */}
      <div style={{ textAlign: "center", marginBottom: "20px" }}>
        <input
          type="text"
          placeholder="🔍 Search student..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{
            padding: "12px",
            width: "300px",
            borderRadius: "10px",
            border: "none",
            outline: "none"
          }}
        />
      </div>

      {/* Main Layout */}
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          gap: "20px",
          flexWrap: "wrap"
        }}
      >
        {/* Form Section */}
        <div
          
  style={{
    background: "rgba(255,255,255,0.05)",
    backdropFilter: "blur(10px)",
    border: "1px solid rgba(255,255,255,0.1)",
    padding: "20px",
    borderRadius: "15px",
    width: "300px"
  }}

        >
          <h2>Add Student</h2>

          <input
            type="text"
            placeholder="Enter Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            style={{
              width: "100%",
              padding: "10px",
              marginBottom: "10px",
              borderRadius: "8px",
              border: "none"
            }}
          />

          <input
            type="text"
            placeholder="Enter Course"
            value={course}
            onChange={(e) => setCourse(e.target.value)}
            style={{
              width: "100%",
              padding: "10px",
              marginBottom: "10px",
              borderRadius: "8px",
              border: "none"
            }}
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
              cursor: "pointer"
            }}
          >
            {editIndex !== null ? "Update Student" : "Add Student"}
          </button>
        </div>

        {/* Student Cards */}
        <div style={{ width: "350px" }}>
          <h2 style={{ textAlign: "center" }}>👨‍🎓 Students</h2>

          {filteredStudents.length === 0 ? (
            <p style={{ textAlign: "center" }}>No students found</p>
          ) : (
            filteredStudents.map((student, index) => (
              <StudentCard
                key={student.id || index}
                student={student}
                onDelete={() => handleDelete(index)}
                onEdit={() => handleEdit(index)}
              />
            ))
          )}
        </div>
      </div>

      {/* API Section */}
      <div style={{ marginTop: "40px", textAlign: "center" }}>
        <h2>🌐 API Users</h2>

        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            justifyContent: "center",
            gap: "10px",
            marginTop: "10px"
          }}
        >
          {apiUsers.map((user) => (
            <div
              key={user.id}
              style={{
                background: "#334155",
                padding: "10px 15px",
                borderRadius: "10px"
              }}
            >
              {user.name}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default App;
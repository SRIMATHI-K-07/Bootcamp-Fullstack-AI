import React, { useState, useEffect } from "react";
import StudentCard from "./StudentCard";

function App() {
  const [students, setStudents] = useState([]);
  const [name, setName] = useState("");
  const [course, setCourse] = useState("");
  const [editIndex, setEditIndex] = useState(null);
  const [search, setSearch] = useState("");
  const [apiUsers, setApiUsers] = useState([]);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  useEffect(() => {
    fetch("https://jsonplaceholder.typicode.com/users")
      .then((res) => res.json())
      .then((data) => setApiUsers(data));
  }, []);

  const fetchStudents = async () => {
    const token = localStorage.getItem("token");

    const res = await fetch("http://localhost:5000/students", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await res.json();
    console.log("API DATA:", data);

    if (Array.isArray(data)) {
      setStudents(data);
    } else {
      setStudents([]);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  const handleSubmit = async () => {
    if (!name || !course) return;

    if (editIndex !== null) {
      const student = students[editIndex];

      await fetch(`http://localhost:5000/update/${student._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({ name, course }),
      });

      setEditIndex(null);
    } else {
      await fetch("http://localhost:5000/add", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({ name, course }),
      });
    }

    setName("");
    setCourse("");
    fetchStudents();
  };

  const handleDelete = async (index) => {
    const student = students[index];

    await fetch(`http://localhost:5000/delete/${student._id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });

    fetchStudents();
  };

  const handleEdit = (index) => {
    setName(students[index].name);
    setCourse(students[index].course);
    setEditIndex(index);
  };

  const filteredStudents = Array.isArray(students)
    ? students.filter((s) =>
        s?.name?.toLowerCase().includes(search.toLowerCase())
      )
    : [];

  const handleLogin = async () => {
    const res = await fetch("http://localhost:5000/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username, password }),
    });

    const data = await res.json();
    localStorage.setItem("token", data.token);

    alert("Login success");
    fetchStudents();
  };

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
      {!localStorage.getItem("token") ? (
        <>
          <h2>Login</h2>

          <input
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <button onClick={handleLogin}>Login</button>
        </>
      ) : (
        <>
          <h1>🎓 Student Manager Pro</h1>

          <button
            onClick={() => {
              localStorage.removeItem("token");
              window.location.reload();
            }}
          >
            Logout
          </button>

          <h2>Initial Student List</h2>
          {students.map((student) => (
            <p key={student._id}>
              {student.name} - {student.course}
            </p>
          ))}

          <input
            type="text"
            placeholder="🔍 Search student..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          <h2>Add Student</h2>

          <input
            type="text"
            placeholder="Enter Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />

          <input
            type="text"
            placeholder="Enter Course"
            value={course}
            onChange={(e) => setCourse(e.target.value)}
          />

          <button onClick={handleSubmit}>
            {editIndex !== null ? "Update Student" : "Add Student"}
          </button>

          <div>
            {filteredStudents.length === 0 ? (
              <p>No students found</p>
            ) : (
              filteredStudents.map((student, index) => (
                <StudentCard
                  key={student._id}
                  student={student}
                  onDelete={() => handleDelete(index)}
                  onEdit={() => handleEdit(index)}
                />
              ))
            )}
          </div>

          <h2>API Users</h2>
          {apiUsers.map((user) => (
            <p key={user.id}>{user.name}</p>
          ))}
        </>
      )}
    </div>
  );
}

export default App;
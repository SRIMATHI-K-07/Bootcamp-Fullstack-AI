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
  const [username, setUsername] = useState("");
  const [password, setPassword] =  useState("");
 

  useEffect(() => {
  fetch("https://jsonplaceholder.typicode.com/users")
    .then((res) => res.json())
    .then((data) => setApiUsers(data));
}, []);

const fetchStudents = async () => {
  const token = localStorage.getItem("token");

  const res = await fetch("http://localhost:5000/students", {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });

  const data = await res.json();
  setStudents(data);
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
    Authorization: `Bearer ${localStorage.getItem("token")}`
  },
  body: JSON.stringify({ name, course })
});

    setEditIndex(null);
  } else {
    await fetch("http://localhost:5000/add", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    Authorization: `Bearer ${localStorage.getItem("token")}`
  },
  body: JSON.stringify({ name, course })
});
  }

  setName("");
  setCourse("");

  fetchStudents(); // refresh UI
};

const handleDelete = async (index) => {
  const student = students[index];

  await fetch(`http://localhost:5000/delete/${student._id}`, {
  method: "DELETE",
  headers: {
    Authorization: `Bearer ${localStorage.getItem("token")}`
  }
});

  fetchStudents();
};

  const handleEdit = (index) => {
    setName(students[index].name);
    setCourse(students[index].course);
    setEditIndex(index);
  };

 
 const filteredStudents = students.filter((s) => {
  if (!search) return true; // 🔥 show all if search empty
  return s?.name?.toLowerCase().includes(search.toLowerCase());
});

  const token = localStorage.getItem("token");
  const handleLogin = async () => {
  const res = await fetch("http://localhost:5000/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
      
    },
    body: JSON.stringify({ username, password })
  });

  const data = await res.json();
  if (Array.isArray(data)) {
    setStudents(data);
  } else {
    console.log("Not array:", data);
    setStudents([]); // prevent crash
  }
  localStorage.setItem("token", data.token);

  alert("Login success");
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

      <h1>🎓 Student Manager Pro</h1>
      <h2>Initial Student List (map & keys)</h2>
      {students.map((student) => (
  <p key={student._id}>
    {student.name} - {student.course}
  </p>
))}

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
      <h2>Add Student (Form Submit)</h2>
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
              key={student._id || index}
              student={student}
              onDelete={() => handleDelete(index)}
              onEdit={() => handleEdit(index)}
            />
          ))
        )}
      </div>
      <h2>API Users (Fetch API)</h2>

{apiUsers.map((user) => (
  <p key={user.id}>{user.name}</p>
))}
    </div>
  );
}

export default App;

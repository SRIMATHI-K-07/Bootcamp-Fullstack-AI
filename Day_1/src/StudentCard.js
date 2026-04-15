import React from "react";

function StudentCard({ student, onDelete, onEdit }) {
  return (
    <div
      style={{
        background: "#1e293b",
        padding: "20px",
        borderRadius: "15px",
        color: "white",
        marginBottom: "15px",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
      }}
    >
      <div>
        <h3>{student.name}</h3>
        <p style={{ color: "#cbd5f5" }}>{student.course}</p>
        <span style={{ color: "#22c55e", fontSize: "12px" }}>
          ● {student.status}
        </span>
      </div>

      <div style={{ display: "flex", gap: "10px" }}>
        <button
          onClick={onEdit}
          style={{
            background: "#f59e0b",
            border: "none",
            padding: "6px 10px",
            borderRadius: "8px",
            color: "white",
          }}
        >
          ✏️
        </button>

        <button
          onClick={onDelete}
          style={{
            background: "#ef4444",
            border: "none",
            padding: "6px 10px",
            borderRadius: "8px",
            color: "white",
          }}
        >
          ❌
        </button>
      </div>
    </div>
  );
}

export default StudentCard;
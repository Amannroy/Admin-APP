import "./App.css";
import { useState } from "react";

function App() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loggedIn, setLoggedIn] = useState(false);
  const [page, setPage] = useState("");

  const handleLogin = async () => {
    try {
      const res = await fetch("https://admin-server-a08x.onrender.com/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (data.success) {
        localStorage.setItem("token", data.token);
        setLoggedIn(true);
      } else {
        alert("Invalid credentials");
      }
    } catch (err) {
      console.error(err);
    }
  };

  if (loggedIn) {
    return (
      <div style={{ padding: 20 }}>
        <h1>Admin Dashboard</h1>

        <div className="nav-buttons">
          <button onClick={() => setPage("student")}>Add Student</button>
          <button onClick={() => setPage("teacher")}>Add Teacher</button>
          <button onClick={() => setPage("fees")}>Mark Fees</button>
        </div>

        <div className="card" style={{ marginTop: 20 }}>
          {page === "student" && <StudentForm />}
          {page === "teacher" && <TeacherForm />}
          {page === "fees" && <FeesForm />}
        </div>
      </div>
    );
  }

  return (
    <div className="container">
      <div className="card">
        <h2>Admin Login</h2>

        <input placeholder="Email" onChange={(e) => setEmail(e.target.value)} />
        <input type="password" placeholder="Password" onChange={(e) => setPassword(e.target.value)} />

        <button onClick={handleLogin}>Login</button>
      </div>
    </div>
  );
}

/* ================= STUDENT ================= */

function StudentForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");

  const handleSubmit = async () => {
    try {
      const res = await fetch("https://admin-server-a08x.onrender.com/api/students", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, email, phone }),
      });

      const data = await res.json();

      if (data.error) {
        alert(data.error);
      } else {
        alert("Student Added ✅");
        setName("");
        setEmail("");
        setPhone("");
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div>
      <h2>Add Student</h2>

      <input value={name} placeholder="Name" onChange={(e) => setName(e.target.value)} />
      <input value={email} placeholder="Email" onChange={(e) => setEmail(e.target.value)} />
      <input value={phone} placeholder="Phone" onChange={(e) => setPhone(e.target.value)} />

      <button onClick={handleSubmit}>Save</button>
    </div>
  );
}

/* ================= TEACHER ================= */

function TeacherForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async () => {
    try {
      const res = await fetch("https://admin-server-a08x.onrender.com/api/teachers", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await res.json();

      if (data.error) {
        alert(data.error);
      } else {
        alert("Teacher Added ✅");
        setName("");
        setEmail("");
        setPassword("");
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div>
      <h2>Add Teacher</h2>

      <input value={name} placeholder="Name" onChange={(e) => setName(e.target.value)} />
      <input value={email} placeholder="Email" onChange={(e) => setEmail(e.target.value)} />
      <input value={password} placeholder="Password" onChange={(e) => setPassword(e.target.value)} />

      <button onClick={handleSubmit}>Save</button>
    </div>
  );
}

/* ================= FEES ================= */

function FeesForm() {
  const [studentId, setStudentId] = useState("");
  const [month, setMonth] = useState("");

  const handleSubmit = async () => {
    try {
      const res = await fetch("https://admin-server-a08x.onrender.com/api/fees", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          student_id: studentId,
          month,
          paid: true,
        }),
      });

      const data = await res.json();

      if (data.error) {
        alert(data.error);
      } else {
        alert("Fees Marked ✅");
        setStudentId("");
        setMonth("");
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div>
      <h2>Mark Fees</h2>

      <input value={studentId} placeholder="Student ID" onChange={(e) => setStudentId(e.target.value)} />
      <input value={month} placeholder="Month (e.g. May)" onChange={(e) => setMonth(e.target.value)} />

      <button onClick={handleSubmit}>Mark Paid</button>
    </div>
  );
}

export default App;
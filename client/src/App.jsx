import { useEffect } from "react";
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
          <button onClick={() => setPage("viewStudents")}>View Students</button>
        </div>

        <div className="card" style={{ marginTop: 20 }}>
          {page === "student" && <StudentForm />}
          {page === "teacher" && <TeacherForm />}
          {page === "fees" && <FeesForm />}
          {page === "viewStudents" && <ViewStudents />}
        </div>
      </div>
    );
  }

  return (
    <div className="container">
      <div className="card">
        <h2>Admin Login</h2>

        <input placeholder="Email" onChange={(e) => setEmail(e.target.value)} />
        <input
          type="password"
          placeholder="Password"
          onChange={(e) => setPassword(e.target.value)}
        />

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
      const res = await fetch(
        "https://admin-server-a08x.onrender.com/api/students",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ name, email, phone }),
        },
      );

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

      <input
        value={name}
        placeholder="Name"
        onChange={(e) => setName(e.target.value)}
      />
      <input
        value={email}
        placeholder="Email"
        onChange={(e) => setEmail(e.target.value)}
      />
      <input
        value={phone}
        placeholder="Phone"
        onChange={(e) => setPhone(e.target.value)}
      />

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
      const res = await fetch(
        "https://admin-server-a08x.onrender.com/api/teachers",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ name, email, password }),
        },
      );

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

      <input
        value={name}
        placeholder="Name"
        onChange={(e) => setName(e.target.value)}
      />
      <input
        value={email}
        placeholder="Email"
        onChange={(e) => setEmail(e.target.value)}
      />
      <input
        value={password}
        placeholder="Password"
        onChange={(e) => setPassword(e.target.value)}
      />

      <button onClick={handleSubmit}>Save</button>
    </div>
  );
}

/* ================= FEES ================= */

function FeesForm() {
  const [studentId, setStudentId] = useState("");
  const [month, setMonth] = useState("");

  const handleSubmit = async () => {
    if (!studentId || !month) {
      alert("Please fill all fields ❌");
      return;
    }

    try {
      const res = await fetch("https://admin-server-a08x.onrender.com/api/fees", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          student_id: Number(studentId), // ✅ FIX
          month: month,
          paid: true,
        }),
      });

      const data = await res.json();

      if (data.error) {
        alert(data.error);
      } else {
        alert("Fees Marked Paid");
        setStudentId("");
        setMonth("");
      }
    } catch (err) {
      console.error("Error", err);
      alert("Something went wrong");
    }
  };

  return (
    <div>
      <h2>Mark Fees</h2>

      <input
        value={studentId}
        placeholder="Student ID"
        onChange={(e) => setStudentId(e.target.value)}
      />

      <input
        value={month}
        placeholder="Month (e.g. May)"
        onChange={(e) => setMonth(e.target.value)}
      />

      <button onClick={handleSubmit}>Mark Paid</button>
    </div>
  );
}

/* ================= View Students  ================= */
function ViewStudents() {
  const [students, setStudents] = useState([]);
  const [fees, setFees] = useState([]);

  const fetchStudents = async () => {
    try {
      const res = await fetch(
        "https://admin-server-a08x.onrender.com/api/students",
      );
      const data = await res.json();
      setStudents(data);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchFees = async () => {
    try {
      const res = await fetch(
        "https://admin-server-a08x.onrender.com/api/fees");

        if(!res.ok){
          console.error("API ERROR:", res.status);
          return;
        }

      const data = await res.json();
      setFees(data);
    } catch (err) {
      console.error("FETCH ERROR:", err);
    }
  };

  // Fetch data when component loads
   useEffect(() => {
    fetchStudents();
    fetchFees();
  }, []);

  // Check if student paid fees
  const isPaid = (studentId) => {
    return fees.some((f) => f.student_id === studentId && f.paid === true);
  };

  return (
    <div>
      <h2>Students List</h2>

      <table border="1" cellPadding="10">
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Phone</th>
            <th>Fees Status</th>
          </tr>
        </thead>

        <tbody>
          {students.map((s) => (
            <tr key={s.id}>
              <td>{s.name}</td>
              <td>{s.email}</td>
              <td>{s.phone}</td>
              <td>{isPaid(s.id) ? "Paid" : "Not Paid"}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default App;

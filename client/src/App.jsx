import { useState } from "react";

function App() {
  // 🔐 Login State
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loggedIn, setLoggedIn] = useState(false);

  // 📄 Page switch (Student / Teacher / Fees)
  const [page, setPage] = useState("");

  // 🔑 LOGIN FUNCTION
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

  // 🧠 DASHBOARD UI
  if (loggedIn) {
    return (
      <div style={{ padding: 20 }}>
        <h1>Admin Dashboard</h1>

        {/* Buttons */}
        <button onClick={() => setPage("student")}>Add Student</button>
        <button onClick={() => setPage("teacher")}>Add Teacher</button>
        <button onClick={() => setPage("fees")}>Mark Fees</button>

        <hr />

        {/* Show Forms */}
        {page === "student" && <StudentForm />}
        {page === "teacher" && <TeacherForm />}
        {page === "fees" && <FeesForm />}
      </div>
    );
  }

  // 🔐 LOGIN UI
  return (
    <div style={{ padding: 50 }}>
      <h2>Admin Login</h2>

      <input
        placeholder="Email"
        onChange={(e) => setEmail(e.target.value)}
      />
      <br /><br />

      <input
        type="password"
        placeholder="Password"
        onChange={(e) => setPassword(e.target.value)}
      />
      <br /><br />

      <button onClick={handleLogin}>Login</button>
    </div>
  );
}

/* ===================================================== */
/* 🧑‍🎓 STUDENT FORM */
/* ===================================================== */

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

      if(data.error){
        alert(data.error);
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div>
      <h2>Add Student</h2>

      <input
        placeholder="Name"
        onChange={(e) => setName(e.target.value)}
      />
      <br />

      <input
        placeholder="Email"
        onChange={(e) => setEmail(e.target.value)}
      />
      <br />

      <input
        placeholder="Phone"
        onChange={(e) => setPhone(e.target.value)}
      />
      <br />

      <button onClick={handleSubmit}>Save</button>
    </div>
  );
}

/* ===================================================== */
/* 👨‍🏫 TEACHER FORM */
/* ===================================================== */

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

      if(data.error){
        alert(data.error);
      }else{
        alert("Teacher Added ✅");
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div>
      <h2>Add Teacher</h2>

      <input
        placeholder="Name"
        onChange={(e) => setName(e.target.value)}
      />
      <br />
      <input
        placeholder="Email"
        onChange={(e) => setEmail(e.target.value)}
      />
      <br />
      <input type="password"
        placeholder="Password"
        onChange={(e) => setPassword(e.target.value)}
      />
      <br />

      <button onClick={handleSubmit}>Save</button>
    </div>
  );
}

/* ===================================================== */
/* 💰 FEES FORM */
/* ===================================================== */

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

      if(data.error){
        alert(data.error);
      }else{
        alert("Fees Marked");
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div>
      <h2>Mark Fees</h2>

      <input
        placeholder="Student ID"
        onChange={(e) => setStudentId(e.target.value)}
      />
      <br />
      <input
        placeholder="Month (e.g. May)"
        onChange={(e) => setMonth(e.target.value)}
      />
      <br />

      <button onClick={handleSubmit}>Mark Paid</button>
    </div>
  );
}

export default App;
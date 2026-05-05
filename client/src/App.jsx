import { useState } from "react";

function App() {
  // Store Inputs
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // Track Login State
  const [loggedIn, setLoggedIn] = useState(false);
  const [dashboardData, setDashboardData] = useState("");

  // Function when login clicked
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

        fetchDashboard();
      } else {
        alert("Invalid credentials");
      }
    } catch (err) {
      console.error(err);
    }
  };

  // FETCH DASHBOARD(PROTECTED ROUTE)

  const fetchDashboard = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await fetch("https://admin-server-a08x.onrender.com/dashboard", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();

      console.log("Dashboard:", data);

      // Store response
      setDashboardData(data.message);

    } catch (err) {
      console.error(err);
    }
  };

  // Show dashboard UI if logged in
  if (loggedIn) {
    return (
    <div>
      <h1>{dashboardData || "Loading..."}</h1>
    </div>
    );
  }

  // Login UI
  return (
    <div style={{ padding: 50 }}>
      <h2>Admin Login</h2>

      <input placeholder="Email" onChange={(e) => setEmail(e.target.value)} />
      <br />
      <br />

      <input
        type="password"
        placeholder="Password"
        onChange={(e) => setPassword(e.target.value)}
      />
      <br />
      <br />

      <button onClick={handleLogin}>Login</button>
    </div>
  );
}

export default App;

import { useState } from "react";
import Login from "./Login";
import Students from "./Students";

export default function App() {
  const [token, setToken] = useState("");

  return (
    <div style={{ padding: "20px" }}>
      <h1>Student App (JWT)</h1>
      {!token ? (
        <Login setToken={setToken} />
      ) : (
        <>
          <button onClick={() => setToken("")}>Logout</button>
          <Students token={token} />
        </>
      )}
    </div>
  );
}

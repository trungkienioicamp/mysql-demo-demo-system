import React, { useEffect, useState } from "react";
import { createRoot } from "react-dom/client";
import "./styles.css";

const apiBaseUrl =
  import.meta.env.VITE_API_BASE_URL || (import.meta.env.DEV ? "http://localhost:3001" : "");

function App() {
  const [staffs, setStaffs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchStaffs() {
      try {
        const response = await fetch(`${apiBaseUrl}/api/staffs`);

        if (!response.ok) {
          throw new Error(`Request failed with status ${response.status}`);
        }

        setStaffs(await response.json());
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchStaffs();
  }, []);

  return (
    <main className="page">
      <section className="staffs-panel">
        <div className="header">
          <div>
            <p className="eyebrow">codex_test.staffs</p>
            <h1>Staff List</h1>
          </div>
          <span className="count">{staffs.length} rows</span>
        </div>

        {loading && <p className="status">Loading staffs...</p>}
        {error && <p className="status error">Cannot load staffs: {error}</p>}

        {!loading && !error && (
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Email</th>
                  <th>Name</th>
                </tr>
              </thead>
              <tbody>
                {staffs.map((staff) => (
                  <tr key={staff.email}>
                    <td>{staff.email}</td>
                    <td>{staff.name}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </main>
  );
}

createRoot(document.getElementById("root")).render(<App />);

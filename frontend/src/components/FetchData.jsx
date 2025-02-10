import React, { useEffect, useState } from "react";

const FetchData = () => {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch("http://127.0.0.1:8000/data/") // Update this API endpoint as needed
      .then((response) => {
        if (!response.ok) throw new Error("Network response was not ok");
        return response.json();
      })
      .then((data) => setData(data))
      .catch((error) => setError(error.message));
  }, []);

  return (
    <div style={{ padding: "20px", fontFamily: "Arial, sans-serif" }}>
      <h2>Backend Data</h2>
      {error ? (
        <p style={{ color: "red" }}>Error: {error}</p>
      ) : data ? (
        <pre style={{ background: "#f4f4f4", padding: "10px", borderRadius: "5px" }}>
          {JSON.stringify(data, null, 2)}
        </pre>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
};

export default FetchData;

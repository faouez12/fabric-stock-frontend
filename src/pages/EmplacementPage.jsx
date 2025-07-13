import React, { useState } from "react";
import axios from "axios";

const EmplacementPage = () => {
  const [emplacement, setEmplacement] = useState("");
  const [result, setResult] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleSearch = async () => {
    if (!emplacement.trim()) {
      alert("Please enter an emplacement.");
      return;
    }

    const num = parseInt(emplacement, 10);
    if (isNaN(num) || num < 101) {
      alert("Invalid emplacement number.");
      return;
    }

    try {
      setLoading(true);
      const res = await axios.get(
        `http://localhost:5000/api/articles/search/${emplacement}`
      );
      setResult(res.data);
    } catch (err) {
      console.error("❌ Error fetching emplacement:", err);
      alert("Error fetching emplacement.");
      setResult([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: "20px", maxWidth: "700px", margin: "0 auto" }}>
      <h2>📍 Emplacement Page</h2>
      <p>Search articles by stockage or déstockage emplacement.</p>

      <div style={{ marginBottom: "15px", display: "flex", gap: "10px" }}>
        <input
          value={emplacement}
          onChange={(e) => setEmplacement(e.target.value)}
          placeholder="Ex: 0101 or 1101"
        />
        <button onClick={handleSearch} disabled={loading}>
          {loading ? "Searching..." : "Search"}
        </button>
      </div>

      {result && result.length > 0 ? (
        <div>
          <h4>🧾 Articles in Emplacement {emplacement}</h4>
          {result.map((a) => (
            <div
              key={a._id}
              style={{
                border: "1px solid #ccc",
                marginBottom: "10px",
                padding: "12px",
                borderRadius: "8px",
                background: "#f8f8f8",
              }}
            >
              <strong>{a.codeArticle}</strong>
              <p>Emplacement: {a.emplacement}</p>
              <p>Quantité: {a.quantiteEntree}</p>
              <p>Date: {new Date(a.dateEntree).toLocaleDateString("fr-FR")}</p>
            </div>
          ))}
        </div>
      ) : (
        !loading && <p>No article found at this emplacement.</p>
      )}
    </div>
  );
};

export default EmplacementPage;

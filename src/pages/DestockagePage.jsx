import React, { useState, useEffect } from "react";
import axios from "axios";

const Destockage = () => {
  const [codeArticle, setCodeArticle] = useState("");
  const [emplacementStock, setEmplacementStock] = useState("");
  const [emplacementDestock, setEmplacementDestock] = useState("");
  const [articles, setArticles] = useState([]);

  const fetchArticles = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/articles");
      const filtered = res.data.filter((a) => parseInt(a.emplacement) >= 1100);
      setArticles(filtered.slice(0, 6));
    } catch (err) {
      console.error("Error fetching articles:", err);
    }
  };

  useEffect(() => {
    fetchArticles();
  }, []);

  const handleAdd = async () => {
    if (!codeArticle || !emplacementStock || !emplacementDestock) {
      alert("Fill all 3 fields");
      return;
    }

    try {
      await axios.post("http://localhost:5000/api/articles/destock", {
        codeArticle,
        emplacementStock,
        emplacementDestock,
        quantiteEntree: 1,
      });

      setCodeArticle("");
      setEmplacementStock("");
      setEmplacementDestock("");
      fetchArticles();
    } catch (err) {
      console.error("Add failed:", err);
      alert("Failed to add destockage article.");
    }
  };

  const handleDelete = async (id) => {
    const confirm = window.confirm("Delete this article?");
    if (!confirm) return;

    try {
      await axios.delete(`http://localhost:5000/api/articles/${id}`);
      fetchArticles();
    } catch (err) {
      console.error("Delete failed:", err);
      alert("Failed to delete.");
    }
  };

  return (
    <div style={{ padding: "20px", textAlign: "center" }}>
      <h2>🛒 Déstockage</h2>
      <p>Move articles from stockage to déstockage emplacement (1101+)</p>

      <div
        style={{
          display: "flex",
          gap: "10px",
          justifyContent: "center",
          marginBottom: "20px",
        }}
      >
        <input
          type="text"
          placeholder="Code Article"
          value={codeArticle}
          onChange={(e) => setCodeArticle(e.target.value)}
        />
        <input
          type="text"
          placeholder="From Emplacement"
          value={emplacementStock}
          onChange={(e) => setEmplacementStock(e.target.value)}
        />
        <input
          type="text"
          placeholder="To Emplacement"
          value={emplacementDestock}
          onChange={(e) => setEmplacementDestock(e.target.value)}
        />
        <button onClick={handleAdd}>Add</button>
      </div>

      <h4>📦 Last 6 Déstocked Articles</h4>
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: "16px",
          justifyContent: "center",
        }}
      >
        {articles.map((a) => (
          <div
            key={a._id}
            style={{
              border: "1px solid #ccc",
              padding: "12px",
              borderRadius: "8px",
              width: "180px",
              textAlign: "center",
              position: "relative",
              backgroundColor: "#f9f9f9",
            }}
          >
            <button
              onClick={() => handleDelete(a._id)}
              style={{
                position: "absolute",
                top: "5px",
                right: "5px",
                border: "none",
                background: "transparent",
                color: "red",
                fontSize: "16px",
                cursor: "pointer",
              }}
              title="Delete"
            >
              🗑️
            </button>
            <strong>{a.codeArticle}</strong>
            <p>From: {a.emplacementStock || "Unknown"}</p>
            <p>To: {a.emplacement}</p>
            <p>Quantité: {a.quantiteEntree}</p>
            <p>
              Date:{" "}
              {new Date(a.dateEntree || a.createdAt).toLocaleDateString(
                "fr-FR"
              )}
            </p>
            {a.qrCodeDataURL && (
              <img
                src={a.qrCodeDataURL}
                alt="QR"
                style={{ width: "90px", marginTop: "10px" }}
              />
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Destockage;

import React, { useEffect, useState } from "react";
import axios from "axios";
import QRCode from "react-qr-code";

const StockagePage = () => {
  const [articles, setArticles] = useState([]);
  const [form, setForm] = useState({ codeArticle: "", emplacement: "" });
  const [loading, setLoading] = useState(false);

  const fetchArticles = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/articles");
      const stockageOnly = res.data.filter((a) => {
        const num = parseInt(a.emplacement, 10);
        return num >= 101 && num <= 1099;
      });
      setArticles(stockageOnly);
    } catch (err) {
      console.error("Error fetching articles:", err);
    }
  };

  useEffect(() => {
    fetchArticles();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleAdd = async () => {
    const { codeArticle, emplacement } = form;
    const num = parseInt(emplacement, 10);

    if (!codeArticle || !emplacement || isNaN(num) || num < 101 || num > 1099) {
      alert("Enter a valid code and emplacement between 0101 and 1099.");
      return;
    }

    try {
      setLoading(true);
      await axios.post("http://localhost:5000/api/articles", {
        codeArticle,
        emplacement,
        quantiteEntree: 1,
      });
      setForm({ codeArticle: "", emplacement: "" });
      fetchArticles();
    } catch (err) {
      console.error("Add failed:", err);
      alert("Failed to add article.");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm("Delete this article?");
    if (!confirmDelete) return;

    try {
      await axios.delete(`http://localhost:5000/api/articles/${id}`);
      fetchArticles();
    } catch (err) {
      console.error("Delete failed:", err);
      alert("Failed to delete article.");
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>📦 Stockage Page</h2>
      <p>Add fabric using code & stockage emplacement (0101–1099).</p>

      <div style={{ display: "flex", gap: "10px", marginBottom: "15px" }}>
        <input
          name="codeArticle"
          placeholder="Code Article (e.g., TF_1)"
          value={form.codeArticle}
          onChange={handleChange}
        />
        <input
          name="emplacement"
          placeholder="Emplacement (0101–1099)"
          value={form.emplacement}
          onChange={handleChange}
        />
        <button onClick={handleAdd} disabled={loading}>
          {loading ? "Adding..." : "Add"}
        </button>
      </div>

      <h4>📑 Articles in Stockage</h4>
      <div style={{ display: "flex", flexWrap: "wrap", gap: "16px" }}>
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
            <p>Emplacement: {a.emplacement}</p>
            <p>Quantité: {a.quantiteEntree}</p>
            <p>
              Date:{" "}
              {new Date(a.createdAt || a.dateEntree).toLocaleDateString(
                "fr-FR"
              )}
            </p>
            <QRCode value={`${a.codeArticle} | ${a.emplacement}`} size={100} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default StockagePage;

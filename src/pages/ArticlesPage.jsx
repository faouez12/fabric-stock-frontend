import React, { useState, useEffect } from "react";
import axios from "axios";

const ArticlesPage = () => {
  const [articles, setArticles] = useState([]);
  const [form, setForm] = useState({ codeArticle: "", libelle: "" });
  const [loading, setLoading] = useState(false);

  // Fetch all article types
  const fetchArticles = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/articles-list");
      setArticles(res.data);
    } catch (err) {
      console.error("Error fetching article list:", err);
    }
  };

  useEffect(() => {
    fetchArticles();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleAdd = async () => {
    if (!form.codeArticle || !form.libelle) {
      alert("Both fields are required.");
      return;
    }

    try {
      setLoading(true);
      await axios.post("http://localhost:5000/api/articles-list", form);
      setForm({ codeArticle: "", libelle: "" });
      fetchArticles();
    } catch (err) {
      console.error("Error adding article:", err);
      alert("Failed to add article.");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this article type?")) return;

    try {
      await axios.delete(`http://localhost:5000/api/articles-list/${id}`);
      fetchArticles();
    } catch (err) {
      console.error("Error deleting:", err);
    }
  };

  return (
    <div style={{ padding: "20px", maxWidth: "600px", margin: "0 auto" }}>
      <h2>📘 Articles Management</h2>
      <p>Add and manage available article types.</p>

      <div style={{ display: "flex", gap: "10px", marginBottom: "12px" }}>
        <input
          name="codeArticle"
          placeholder="Code Article"
          value={form.codeArticle}
          onChange={handleChange}
        />
        <input
          name="libelle"
          placeholder="Libellé"
          value={form.libelle}
          onChange={handleChange}
        />
        <button onClick={handleAdd} disabled={loading}>
          {loading ? "Adding..." : "Add"}
        </button>
      </div>

      <table
        border="1"
        cellPadding="8"
        style={{ width: "100%", borderCollapse: "collapse" }}
      >
        <thead>
          <tr>
            <th>Code Article</th>
            <th>Libellé</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {articles.map((article) => (
            <tr key={article._id}>
              <td>{article.codeArticle}</td>
              <td>{article.libelle}</td>
              <td>
                <button onClick={() => handleDelete(article._id)}>🗑️</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ArticlesPage;

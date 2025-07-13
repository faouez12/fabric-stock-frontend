import React, { useEffect, useState } from "react";
import axios from "axios";

const BonDeSortiePage = () => {
  const [bons, setBons] = useState([]);
  const [articles, setArticles] = useState([]);
  const [selectedArticles, setSelectedArticles] = useState([]);
  const [client, setClient] = useState("");
  const [loading, setLoading] = useState(false);

  const fetchBons = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/bons-de-sortie");
      setBons(res.data);
    } catch (err) {
      console.error("Error fetching bons:", err);
    }
  };

  const fetchDestockedArticles = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/articles");
      const destocked = res.data.filter((a) => parseInt(a.emplacement) >= 1101);
      setArticles(destocked);
    } catch (err) {
      console.error("Error fetching destocked articles:", err);
    }
  };

  useEffect(() => {
    fetchBons();
    fetchDestockedArticles();
  }, []);

  const toggleSelect = (article) => {
    const exists = selectedArticles.find((a) => a._id === article._id);
    if (exists) {
      setSelectedArticles(
        selectedArticles.filter((a) => a._id !== article._id)
      );
    } else {
      setSelectedArticles([
        ...selectedArticles,
        {
          _id: article._id,
          codeArticle: article.codeArticle,
          emplacement: article.emplacement,
        },
      ]);
    }
  };

  const handleCreateBon = async () => {
    if (!client.trim() || selectedArticles.length === 0) {
      alert("Client name and at least one article required.");
      return;
    }

    try {
      setLoading(true);
      await axios.post("http://localhost:5000/api/bons-de-sortie", {
        client,
        articles: selectedArticles.map((a) => ({
          codeArticle: a.codeArticle,
          emplacement: a.emplacement,
        })),
      });

      setClient("");
      setSelectedArticles([]);
      fetchBons();
      fetchDestockedArticles(); // Refresh to update quantities
    } catch (err) {
      console.error("Error creating bon:", err);
      alert("Failed to create Bon de Sortie.");
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadPDF = async (bonId) => {
    try {
      const res = await axios.get(
        `http://localhost:5000/api/bons-de-sortie/${bonId}/pdf`,
        {
          responseType: "blob",
        }
      );

      const url = window.URL.createObjectURL(
        new Blob([res.data], { type: "application/pdf" })
      );
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `Bon_De_Sortie_${bonId}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (err) {
      console.error("PDF download failed:", err);
    }
  };

  const handleDeleteBon = async (bonId) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this Bon?"
    );
    if (!confirmDelete) return;

    try {
      await axios.delete(`http://localhost:5000/api/bons-de-sortie/${bonId}`);
      fetchBons();
      fetchDestockedArticles(); // Also refresh articles after delete
    } catch (err) {
      console.error("Error deleting Bon:", err);
      alert("Failed to delete Bon.");
    }
  };

  return (
    <div style={{ padding: "20px", maxWidth: "1000px", margin: "0 auto" }}>
      <h2>📄 Bon de Sortie</h2>

      <div style={{ marginBottom: "20px" }}>
        <input
          type="text"
          placeholder="Client Name"
          value={client}
          onChange={(e) => setClient(e.target.value)}
          style={{ marginRight: "10px", padding: "5px" }}
        />
        <button onClick={handleCreateBon} disabled={loading}>
          {loading ? "Creating..." : "Create Bon de Sortie"}
        </button>
      </div>

      <h3>Select Articles from Déstockage</h3>
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: "10px",
          marginBottom: "20px",
        }}
      >
        {articles.map((a) => (
          <div
            key={a._id}
            style={{
              border: "1px solid #ccc",
              padding: "10px",
              width: "220px",
              background: selectedArticles.find((s) => s._id === a._id)
                ? "#e0f7fa"
                : "#f9f9f9",
              cursor: "pointer",
            }}
            onClick={() => toggleSelect(a)}
          >
            <strong>{a.codeArticle}</strong>
            <p>Emplacement: {a.emplacement}</p>
            <p>Quantité: {a.quantiteEntree}</p>
          </div>
        ))}
      </div>

      <h3>📋 Existing Bons de Sortie</h3>
      <table
        border="1"
        cellPadding="8"
        style={{ width: "100%", borderCollapse: "collapse" }}
      >
        <thead>
          <tr>
            <th>Année</th>
            <th>Num Bon</th>
            <th>Client</th>
            <th>Date</th>
            <th>État</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {bons.map((bon) => (
            <tr key={bon._id}>
              <td>{bon.annee}</td>
              <td>{bon.numBon}</td>
              <td>{bon.client}</td>
              <td>{new Date(bon.date).toLocaleDateString("fr-FR")}</td>
              <td>{bon.etat}</td>
              <td>
                <button onClick={() => handleDownloadPDF(bon._id)}>
                  🧾 PDF
                </button>
                <button
                  onClick={() => handleDeleteBon(bon._id)}
                  style={{ marginLeft: "8px", color: "red", cursor: "pointer" }}
                  title="Delete"
                >
                  🗑️
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default BonDeSortiePage;

// DashboardPage.jsx

import React, { useEffect, useState } from "react";
import axios from "axios";
import { Bar, Pie } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Tooltip,
  Legend
);

const DashboardPage = () => {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        const res = await axios.get("https://fabric-stock-backend.onrender.com/api/articles");
        setArticles(res.data);
      } catch (err) {
        console.error("Error fetching articles:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchArticles();
  }, []);

  const processData = () => {
    const articleMap = {};

    articles.forEach((article) => {
      const code = article.codeArticle;
      if (!articleMap[code]) {
        articleMap[code] = { in: 0, out: 0 };
      }
      articleMap[code].in += article.quantiteEntree;
      articleMap[code].out += article.quantiteSortie;
    });

    const labels = Object.keys(articleMap);
    const quantitiesIn = labels.map((label) => articleMap[label].in);
    const quantitiesOut = labels.map((label) => articleMap[label].out);

    return { labels, quantitiesIn, quantitiesOut };
  };

  const { labels, quantitiesIn, quantitiesOut } = processData();

  if (loading) return <div>Loading dashboard...</div>;

  return (
    <div style={{ maxWidth: "800px", margin: "0 auto", padding: "20px" }}>
      <h2>📊 Dashboard Analytics</h2>

      <h3>Quantities In per Article</h3>
      <Bar
        data={{
          labels,
          datasets: [
            {
              label: "Quantities In",
              data: quantitiesIn,
              backgroundColor: "rgba(75, 192, 192, 0.6)",
            },
          ],
        }}
        options={{ responsive: true }}
      />

      <h3>Quantities Out per Article</h3>
      <Bar
        data={{
          labels,
          datasets: [
            {
              label: "Quantities Out",
              data: quantitiesOut,
              backgroundColor: "rgba(255, 99, 132, 0.6)",
            },
          ],
        }}
        options={{ responsive: true }}
      />

      <h3>Stock Distribution (Pie)</h3>
      <Pie
        data={{
          labels,
          datasets: [
            {
              label: "Current Stock Distribution",
              data: labels.map(
                (label, idx) => quantitiesIn[idx] - quantitiesOut[idx]
              ),
              backgroundColor: [
                "#36A2EB",
                "#FF6384",
                "#FFCE56",
                "#4BC0C0",
                "#9966FF",
              ],
            },
          ],
        }}
        options={{ responsive: true }}
      />
    </div>
  );
};

export default DashboardPage;

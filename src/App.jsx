import React from "react";
import { Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import Navbar from "./components/Navbar";
import StockagePage from "./pages/StockagePage";
import DestockagePage from "./pages/DestockagePage";
import EmplacementPage from "./pages/EmplacementPage";
import BonDeSortiePage from "./pages/BonDeSortiePage";
import DashboardPage from "./pages/DashboardPage";
import ArticlesPage from "./pages/ArticlesPage"; // ✅ NEW import

export default function App() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<StockagePage />} />
        <Route path="/stockage" element={<StockagePage />} />
        <Route path="/destockage" element={<DestockagePage />} />
        <Route path="/emplacement" element={<EmplacementPage />} />
        <Route path="/bon-de-sortie" element={<BonDeSortiePage />} />
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/articles" element={<ArticlesPage />} />{" "}
        {/* ✅ NEW ROUTE */}
      </Routes>
      <ToastContainer position="top-center" autoClose={2500} />
    </>
  );
}

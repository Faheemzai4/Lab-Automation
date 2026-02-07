"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import api from "../../../services/api";

export default function AddProductPage() {
  const router = useRouter();
  const [productName, setProductName] = useState("");
  const [revision, setRevision] = useState("");
  const [manufacturingUnit, setManufacturingUnit] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleAddProduct = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const token = localStorage.getItem("token");
      if (!token) return router.push("/auth/login");

      const headers = { Authorization: `Bearer ${token}` };

      const res = await api.post(
        "/products",
        { productName, revision, manufacturingUnit },
        { headers },
      );

      setLoading(false);
      router.push("/products");
    } catch (err: unknown) {
      const errorMsg =
        (err as any)?.response?.data?.message || "Failed to add product";
      setError(errorMsg);
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <form
        onSubmit={handleAddProduct}
        className="bg-white p-8 rounded shadow-md w-96"
      >
        <h2 className="text-2xl font-bold mb-6 text-center">Add Product</h2>

        {error && <p className="text-red-500 mb-4 text-center">{error}</p>}

        <input
          type="text"
          placeholder="Product Name"
          value={productName}
          onChange={(e) => setProductName(e.target.value)}
          className="w-full mb-4 p-3 border rounded"
          required
        />

        <input
          type="text"
          placeholder="Revision (e.g., R1)"
          value={revision}
          onChange={(e) => setRevision(e.target.value)}
          className="w-full mb-4 p-3 border rounded"
          required
        />

        <input
          type="text"
          placeholder="Manufacturing Unit"
          value={manufacturingUnit}
          onChange={(e) => setManufacturingUnit(e.target.value)}
          className="w-full mb-6 p-3 border rounded"
          required
        />

        <button
          type="submit"
          disabled={loading}
          className={`w-full p-3 rounded text-white ${
            loading
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-blue-600 hover:bg-blue-700"
          }`}
        >
          {loading ? "Adding..." : "Add Product"}
        </button>
      </form>
    </div>
  );
}

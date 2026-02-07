"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import api from "../../services/api";
import { useUser } from "@/context/UserContext";

interface ProductType {
  _id: string;
  productCode: string;
  productName: string;
  status: string;
}

export default function TestingPage() {
  const router = useRouter();
  const { user } = useUser();
  const [products, setProducts] = useState<ProductType[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!user) return;
    if (user.role !== "Tester") router.push("/dashboard");
    else fetchProducts();
  }, [user]);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      if (!token) return router.push("/auth/login");

      const headers = { Authorization: `Bearer ${token}` };
      const res = await api.get("/testing/pending", { headers });
      setProducts(res.data);
    } catch (err: any) {
      setError(err?.response?.data?.message || "Failed to load products");
    } finally {
      setLoading(false);
    }
  };

  const handleTested = async (id: string) => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const headers = { Authorization: `Bearer ${token}` };

      await api.put(`/testing/tested/${id}`, {}, { headers });
      fetchProducts();
    } catch (err: any) {
      setError(err?.response?.data?.message || "Failed to mark as tested");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container min-h-screen p-8">
      <h1 className="text-4xl font-bold text-gray-800 mb-8">
        Testing Dashboard
      </h1>

      {error && (
        <div className="mb-6 bg-red-50 border-l-4 border-red-500 text-red-700 p-4 rounded shadow-sm">
          {error}
        </div>
      )}

      {loading && (
        <div className="mb-6 text-center text-gray-500 font-medium">
          Loading...
        </div>
      )}

      <div className="overflow-x-auto shadow-lg rounded-lg border border-gray-200 bg-white">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-100">
            <tr>
              <th>Product Code</th>
              <th>Product Name</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {products.length === 0 && !loading && (
              <tr>
                <td colSpan={4} className="text-center py-6 text-gray-400">
                  No pending products for testing.
                </td>
              </tr>
            )}
            {products.map((p) => (
              <tr key={p._id}>
                <td className="px-6 py-4">{p.productCode}</td>
                <td className="px-6 py-4">{p.productName}</td>
                <td className="px-6 py-4">
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-semibold ${
                      p.status === "Under Testing"
                        ? "bg-yellow-100 text-yellow-800"
                        : "bg-green-100 text-green-800"
                    }`}
                  >
                    {p.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-center">
                  <button
                    disabled={loading}
                    onClick={() => handleTested(p._id)}
                    className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600"
                  >
                    Tested
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

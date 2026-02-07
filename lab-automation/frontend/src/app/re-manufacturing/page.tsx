"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import api from "../../services/api";
import { useUser } from "@/context/UserContext";

interface ProductType {
  _id: string;
  productCode: string;
  productName: string;
  testType?: string;
  status: string;
}

export default function ReManufacturingPage() {
  const router = useRouter();
  const { user } = useUser();
  const [products, setProducts] = useState<ProductType[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [reasonMap, setReasonMap] = useState<{ [key: string]: string }>({});

  useEffect(() => {
    if (!user) return;
    if (user.role !== "Admin") {
      router.push("/dashboard");
    } else {
      fetchProducts();
    }
  }, [user]);

  const fetchProducts = async () => {
    setLoading(true);
    setError("");
    try {
      const token = localStorage.getItem("token");
      if (!token) return router.push("/auth/login");

      const headers = { Authorization: `Bearer ${token}` };
      const res = await api.get("/re-manufacturing/pending", { headers });

      setProducts(res.data);
    } catch (err: any) {
      setError(err?.response?.data?.message || "Failed to load products");
    } finally {
      setLoading(false);
    }
  };

  const handleSend = async (id: string) => {
    if (!reasonMap[id]) {
      setError("Please provide a reason for failure.");
      return;
    }

    setLoading(true);
    setError("");
    try {
      const token = localStorage.getItem("token");
      const headers = { Authorization: `Bearer ${token}` };

      await api.put(
        `/re-manufacturing/${id}`,
        { reason: reasonMap[id] },
        { headers },
      );

      setReasonMap({ ...reasonMap, [id]: "" });
      fetchProducts();
    } catch (err: any) {
      setError(err?.response?.data?.message || "Failed to send product");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container min-h-screen p-8">
      <h1 className="text-4xl font-bold text-gray-800 mb-8">
        Re-Manufacturing Dashboard
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
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-700 uppercase tracking-wider">
                Product Code
              </th>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-700 uppercase tracking-wider">
                Product Name
              </th>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-700 uppercase tracking-wider">
                Test Type
              </th>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-700 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-700 uppercase tracking-wider">
                Reason
              </th>
              <th className="px-6 py-3 text-center text-sm font-medium text-gray-700 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>

          <tbody className="bg-white divide-y divide-gray-200">
            {products.length === 0 && !loading && (
              <tr>
                <td colSpan={6} className="text-center py-6 text-gray-400">
                  No pending products for re-manufacturing.
                </td>
              </tr>
            )}

            {products.map((p, idx) => (
              <tr
                key={p._id}
                className={idx % 2 === 0 ? "bg-white" : "bg-gray-50"}
              >
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">
                  {p.productCode}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">
                  {p.productName}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">
                  {p.testType || "-"}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">
                  <span
                    className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      p.status === "Failed"
                        ? "bg-red-100 text-red-800"
                        : "bg-green-100 text-green-800"
                    }`}
                  >
                    {p.status}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <input
                    type="text"
                    placeholder="Reason for failure"
                    value={reasonMap[p._id] || ""}
                    onChange={(e) =>
                      setReasonMap({ ...reasonMap, [p._id]: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400"
                  />
                </td>
                <td className="px-6 py-4 text-center">
                  <button
                    disabled={loading}
                    onClick={() => handleSend(p._id)}
                    className="bg-yellow-500 text-white px-4 py-2 rounded-md hover:bg-yellow-600 transition-shadow shadow-sm hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Send
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

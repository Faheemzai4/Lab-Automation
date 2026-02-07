"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@/context/UserContext";
import api from "../../services/api";

interface ProductType {
  _id: string;
  productCode: string;
  productName: string;
  status: string;
  testType?: string;
}

export default function CpriApprovalPage() {
  const router = useRouter();
  const { user } = useUser();

  const [products, setProducts] = useState<ProductType[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!user) return;
    if (user.role !== "Manager") router.push("/dashboard");
  }, [user]);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      if (!token) return router.push("/auth/login");

      const headers = { Authorization: `Bearer ${token}` };
      const res = await api.get("/cpri/pending", { headers });
      setProducts(res.data);
    } catch (err: any) {
      setError(err?.response?.data?.message || "Failed to load products");
    } finally {
      setLoading(false);
    }
  };

  const handleApproval = async (productId: string, approve: boolean) => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const headers = { Authorization: `Bearer ${token}` };
      await api.put(
        `/cpri/${productId}`,
        { approvalStatus: approve ? "Approved" : "Rejected" },
        { headers },
      );
      fetchProducts();
    } catch (err: any) {
      setError(err?.response?.data?.message || "Approval failed");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) fetchProducts();
  }, [user]);

  if (!user) return <p className="p-8 text-center">Loading...</p>;

  return (
    <div className="container p-8">
      <h1 className="text-3xl font-bold mb-6">CPRI Approval</h1>

      {error && <p className="text-red-500 mb-4">{error}</p>}

      <div className="overflow-x-auto">
        <table className="w-full border border-gray-300 rounded-lg">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-3 text-left border-b">Product Code</th>
              <th className="p-3 text-left border-b">Product Name</th>
              <th className="p-3 text-left border-b">Status</th>
              <th className="p-3 text-left border-b">Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.length === 0 && (
              <tr>
                <td colSpan={4} className="p-4 text-center text-gray-500">
                  No pending CPRI approvals
                </td>
              </tr>
            )}
            {products.map((p) => (
              <tr key={p._id} className="hover:bg-gray-50">
                <td className="p-3 border-b">{p.productCode}</td>
                <td className="p-3 border-b">{p.productName}</td>
                <td className="p-3 border-b">
                  <span
                    className={`px-2 py-1 rounded-full text-sm font-medium ${
                      p.status === "Approved"
                        ? "bg-green-100 text-green-800"
                        : p.status === "Rejected"
                          ? "bg-red-100 text-red-800"
                          : "bg-yellow-100 text-yellow-800"
                    }`}
                  >
                    {p.status}
                  </span>
                </td>
                <td className="p-3 border-b flex gap-2">
                  <button
                    onClick={() => handleApproval(p._id, true)}
                    className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700"
                  >
                    Approve
                  </button>
                  <button
                    onClick={() => handleApproval(p._id, false)}
                    className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700"
                  >
                    Reject
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

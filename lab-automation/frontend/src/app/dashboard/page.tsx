"use client";

import { useUser } from "@/context/UserContext";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  PieChart,
  Pie,
  Cell,
  Legend,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import api from "../../services/api";

interface DashboardStats {
  totalProducts: number;
  passedTests: number;
  failedTests: number;
  pendingTests: number;
  approvedCPRI: number;
  reManufacturing: number;
}

interface ProductType {
  _id: string;
  productCode: string;
  productName: string;
  status: string;
}

export default function DashboardPage() {
  const { user } = useUser();
  const router = useRouter();
  const [stats, setStats] = useState<DashboardStats>({
    totalProducts: 0,
    passedTests: 0,
    failedTests: 0,
    pendingTests: 0,
    approvedCPRI: 0,
    reManufacturing: 0,
  });
  const [products, setProducts] = useState<ProductType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchStats = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return router.push("/auth/login");

      const headers = { Authorization: `Bearer ${token}` };
      const res = await api.get("/dashboard/stats", { headers });
      setStats(res.data);
      setLoading(false);
    } catch (err: unknown) {
      setError("Failed to fetch dashboard data");
      setLoading(false);
      console.error(err);
    }
  };

  const fetchProducts = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return router.push("/auth/login");

      const headers = { Authorization: `Bearer ${token}` };
      const res = await api.get("/products", { headers });
      setProducts(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleWorkflow = async (productId: string, action: string) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return router.push("/auth/login");

      const headers = { Authorization: `Bearer ${token}` };
      const res = await api.put(
        `/products/${productId}/workflow`,
        { action },
        { headers },
      );

      const updatedProduct = res.data.product;

      setProducts((prev) =>
        prev.map((p) => (p._id === updatedProduct._id ? updatedProduct : p)),
      );

      fetchStats();
    } catch (err) {
      console.error(err);
      alert("Failed to update workflow");
    }
  };

  useEffect(() => {
    if (!user) return;

    fetchStats();
    if (user.role === "Admin") fetchProducts();
  }, [user]);

  const pieData = [
    { name: "Passed", value: stats.passedTests },
    { name: "Failed", value: stats.failedTests },
    { name: "Pending", value: stats.pendingTests },
  ];

  const COLORS = ["#4ade80", "#f87171", "#facc15"];

  if (loading)
    return (
      <div className="container flex justify-center items-center min-h-screen">
        <p className="text-xl font-semibold text-gray-700 animate-pulse">
          Loading dashboard...
        </p>
      </div>
    );

  if (error)
    return (
      <div className="container flex justify-center items-center min-h-screen">
        <p className="text-red-500 text-xl font-semibold">{error}</p>
      </div>
    );

  if (!user) {
    return (
      <div className="container flex justify-center items-center min-h-screen">
        <p className="text-xl font-semibold text-gray-700 animate-pulse">
          Loading user...
        </p>
      </div>
    );
  }
  console.log("Navbar user:", user);

  return (
    <div className="container bg-gray-50 min-h-screen p-6">
      <h1 className="text-4xl font-bold mb-8 text-gray-800">Dashboard</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6 mb-10">
        <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white p-6 rounded-xl shadow-lg transform transition hover:scale-105">
          <h2 className="text-lg font-semibold">Total Products</h2>
          <p className="text-3xl mt-2 font-bold">{stats.totalProducts}</p>
        </div>
        <div className="bg-gradient-to-r from-green-500 to-green-600 text-white p-6 rounded-xl shadow-lg transform transition hover:scale-105">
          <h2 className="text-lg font-semibold">Passed Tests</h2>
          <p className="text-3xl mt-2 font-bold">{stats.passedTests}</p>
        </div>
        <div className="bg-gradient-to-r from-red-500 to-red-600 text-white p-6 rounded-xl shadow-lg transform transition hover:scale-105">
          <h2 className="text-lg font-semibold">Failed Tests</h2>
          <p className="text-3xl mt-2 font-bold">{stats.failedTests}</p>
        </div>
        <div className="bg-gradient-to-r from-yellow-400 to-yellow-500 text-white p-6 rounded-xl shadow-lg transform transition hover:scale-105">
          <h2 className="text-lg font-semibold">Pending Tests</h2>
          <p className="text-3xl mt-2 font-bold">{stats.pendingTests}</p>
        </div>
        <div className="bg-gradient-to-r from-purple-500 to-purple-600 text-white p-6 rounded-xl shadow-lg transform transition hover:scale-105">
          <h2 className="text-lg font-semibold">CPRI Approved</h2>
          <p className="text-3xl mt-2 font-bold">{stats.approvedCPRI}</p>
        </div>
        <div className="bg-gradient-to-r from-orange-400 to-orange-500 text-white p-6 rounded-xl shadow-lg transform transition hover:scale-105">
          <h2 className="text-lg font-semibold">Re-Manufacturing</h2>
          <p className="text-3xl mt-2 font-bold">{stats.reManufacturing}</p>
        </div>
      </div>

      <div className="bg-white p-6 rounded-xl shadow-lg mb-10">
        <h2 className="text-2xl font-bold mb-4 text-gray-800">
          Test Results Overview
        </h2>
        <div className="w-full h-80 md:h-96">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={pieData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={100}
                label
              >
                {pieData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {user.role === "Admin" && (
        <div className="bg-white p-6 rounded-xl shadow-lg">
          <h2 className="text-2xl font-bold mb-4 text-gray-800">
            Admin Workflow
          </h2>
          <div className="overflow-x-auto rounded-lg shadow border border-gray-200">
            <table className="w-full table-auto border-collapse">
              <thead className="bg-gray-100">
                <tr>
                  <th className="border-b px-4 py-2 text-left">Product Code</th>
                  <th className="border-b px-4 py-2 text-left">Name</th>
                  <th className="border-b px-4 py-2 text-left">Status</th>
                  <th className="border-b px-4 py-2 text-left">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white">
                {products.map((p) => (
                  <tr key={p._id} className="hover:bg-gray-50">
                    <td className="border-b px-4 py-2">{p.productCode}</td>
                    <td className="border-b px-4 py-2">{p.productName}</td>
                    <td className="border-b px-4 py-2">{p.status}</td>
                    <td className="border-b px-4 py-2 space-x-2">
                      {p.status === "Manufactured" && (
                        <button
                          onClick={() => handleWorkflow(p._id, "SendToTesting")}
                          className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700"
                        >
                          Send to Testing
                        </button>
                      )}
                      {p.status === "Failed Testing" && (
                        <button
                          onClick={() =>
                            handleWorkflow(p._id, "SendToReManufacturing")
                          }
                          className="bg-orange-500 text-white px-3 py-1 rounded hover:bg-orange-600"
                        >
                          Send to Re-Manufacturing
                        </button>
                      )}
                      {p.status === "Manufactured" && (
                        <button
                          onClick={() => handleWorkflow(p._id, "SendToCPRI")}
                          className="bg-purple-600 text-white px-3 py-1 rounded hover:bg-purple-700"
                        >
                          Send to CPRI
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
                {products.length === 0 && (
                  <tr>
                    <td colSpan={4} className="text-center py-4 text-gray-400">
                      No products available
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

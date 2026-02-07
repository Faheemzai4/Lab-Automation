"use client";

import { useState, useEffect, FormEvent } from "react";
import api from "../../services/api";
import { useRouter } from "next/navigation";
import { useUser } from "@/context/UserContext";

interface ProductType {
  _id: string;
  productCode: string;
  productName: string;
  revision: string;
  manufacturingUnit: string;
  status: string;
  createdAt: string;
}

export default function SearchPage() {
  const router = useRouter();
  const { user } = useUser();

  const [productCode, setProductCode] = useState("");
  const [productName, setProductName] = useState("");
  const [revision, setRevision] = useState("");
  const [manufacturingUnit, setManufacturingUnit] = useState("");
  const [status, setStatus] = useState("");
  const [results, setResults] = useState<ProductType[]>([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!user) return;
    if (!["Admin", "Manager", "Tester"].includes(user.role)) {
      router.push("/dashboard");
    }
  }, [user]);

  const handleSearch = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const token = localStorage.getItem("token");
      if (!token) return router.push("/auth/login");

      const headers = { Authorization: `Bearer ${token}` };

      const query = new URLSearchParams();
      if (productCode) query.append("productCode", productCode);
      if (productName) query.append("productName", productName);
      if (revision) query.append("revision", revision);
      if (manufacturingUnit)
        query.append("manufacturingUnit", manufacturingUnit);
      if (status) query.append("status", status);

      const res = await api.get<ProductType[]>(`/search?${query.toString()}`, {
        headers,
      });
      setResults(res.data);
    } catch (err: any) {
      setError(err?.response?.data?.message || "Search failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container max-w-7xl mx-auto p-8">
      <h1 className="text-4xl font-extrabold text-gray-800 mb-8">
        Advanced Search
      </h1>

      <form
        onSubmit={handleSearch}
        className="mb-8 grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6"
      >
        <input
          type="text"
          placeholder="Product Code"
          value={productCode}
          onChange={(e) => setProductCode(e.target.value)}
          className="p-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        />
        <input
          type="text"
          placeholder="Product Name"
          value={productName}
          onChange={(e) => setProductName(e.target.value)}
          className="p-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        />
        <input
          type="text"
          placeholder="Revision"
          value={revision}
          onChange={(e) => setRevision(e.target.value)}
          className="p-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        />
        <input
          type="text"
          placeholder="Manufacturing Unit"
          value={manufacturingUnit}
          onChange={(e) => setManufacturingUnit(e.target.value)}
          className="p-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        />
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className="p-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        >
          <option value="">Status</option>
          <option value="Manufactured">Manufactured</option>
          <option value="Under Testing">Under Testing</option>
          <option value="Failed Testing">Failed Testing</option>
          <option value="Re-manufacturing">Re-manufacturing</option>
          <option value="Passed Internal Testing">
            Passed Internal Testing
          </option>
          <option value="Sent to CPRI">Sent to CPRI</option>
          <option value="CPRI Testing">CPRI Testing</option>
          <option value="Approved">Approved</option>
          <option value="Rejected">Rejected</option>
        </select>

        <button
          type="submit"
          className="col-span-1 md:col-span-3 lg:col-span-5 bg-blue-600 text-white font-semibold py-3 rounded-lg hover:bg-blue-700 transition-shadow shadow-md hover:shadow-lg"
        >
          {loading ? "Searching..." : "Search"}
        </button>
      </form>

      {error && (
        <p className="text-red-600 font-medium mb-4 border-l-4 border-red-500 bg-red-50 p-4 rounded">
          {error}
        </p>
      )}

      <div className="overflow-x-auto rounded-lg shadow border border-gray-200">
        <table className="w-full table-auto border-collapse">
          <thead className="bg-gray-100">
            <tr>
              <th className="border-b px-4 py-2 text-left text-gray-700 font-medium">
                Product Code
              </th>
              <th className="border-b px-4 py-2 text-left text-gray-700 font-medium">
                Product Name
              </th>
              <th className="border-b px-4 py-2 text-left text-gray-700 font-medium">
                Revision
              </th>
              <th className="border-b px-4 py-2 text-left text-gray-700 font-medium">
                Manufacturing Unit
              </th>
              <th className="border-b px-4 py-2 text-left text-gray-700 font-medium">
                Status
              </th>
              <th className="border-b px-4 py-2 text-left text-gray-700 font-medium">
                Created At
              </th>
            </tr>
          </thead>
          <tbody className="bg-white">
            {results.length === 0 && (
              <tr>
                <td colSpan={6} className="text-center py-6 text-gray-400">
                  No results found.
                </td>
              </tr>
            )}
            {results.map((r: ProductType) => (
              <tr key={r._id} className="hover:bg-gray-50 transition">
                <td className="border-b px-4 py-2">{r.productCode}</td>
                <td className="border-b px-4 py-2">{r.productName}</td>
                <td className="border-b px-4 py-2">{r.revision}</td>
                <td className="border-b px-4 py-2">{r.manufacturingUnit}</td>
                <td className="border-b px-4 py-2">{r.status}</td>
                <td className="border-b px-4 py-2">
                  {new Date(r.createdAt).toLocaleDateString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

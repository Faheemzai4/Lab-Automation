"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import api from "../../services/api";
import { useUser } from "../../context/UserContext";

interface ProductType {
  _id: string;
  productCode: string;
  productName: string;
  revision: string;
  manufacturingUnit: string;
  status: string;
}

export default function ProductsPage() {
  const router = useRouter();
  const { user } = useUser();
  const [products, setProducts] = useState<ProductType[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user === null) return;
    if (user.role !== "Admin") router.push("/dashboard");
  }, [user]);

  const fetchProducts = async () => {
    if (!user) return;
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      if (!token) return router.push("/auth/login");

      const headers = { Authorization: `Bearer ${token}` };
      const res = await api.get("/products", { headers });
      setProducts(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleWorkflow = async (productId: string, action: string) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return router.push("/auth/login");

      const headers = { Authorization: `Bearer ${token}` };
      await api.put(`/products/${productId}/workflow`, { action }, { headers });
      fetchProducts();
    } catch (err) {
      console.error(err);
      alert("Failed to update workflow");
    }
  };

  useEffect(() => {
    if (user) fetchProducts();
  }, [user]);

  if (!user) return <p className="p-8 text-center">Loading...</p>;

  return (
    <div className="container p-4 sm:p-6 md:p-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <h1 className="text-3xl font-bold text-gray-800">Products</h1>
        <div className="flex gap-2 flex-wrap">
          {user.role === "Admin" && (
            <>
              <Link
                href="/products/add"
                className="bg-blue-600 text-white px-5 py-2 rounded-lg hover:bg-blue-700 transition-shadow shadow-sm hover:shadow-md"
              >
                Add Product
              </Link>
            </>
          )}
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full min-w-[640px] border border-gray-300 rounded-lg overflow-hidden">
          <thead className="bg-gray-100">
            <tr>
              <th className="text-left border-b p-3 font-medium text-gray-700">
                Code
              </th>
              <th className="text-left border-b p-3 font-medium text-gray-700">
                Name
              </th>
              <th className="text-left border-b p-3 font-medium text-gray-700">
                Revision
              </th>
              <th className="text-left border-b p-3 font-medium text-gray-700">
                Unit
              </th>
              <th className="text-left border-b p-3 font-medium text-gray-700">
                Status
              </th>
              {user.role === "Admin" && (
                <th className="text-left border-b p-3 font-medium text-gray-700">
                  Actions
                </th>
              )}
            </tr>
          </thead>
          <tbody>
            {products.length === 0 ? (
              <tr>
                <td
                  colSpan={user.role === "Admin" ? 6 : 5}
                  className="text-center py-6 text-gray-400"
                >
                  No products found.
                </td>
              </tr>
            ) : (
              products.map((p) => (
                <tr
                  key={p._id}
                  className="hover:bg-gray-50 transition-colors text-gray-700"
                >
                  <td className="border-b p-3">{p.productCode}</td>
                  <td className="border-b p-3">{p.productName}</td>
                  <td className="border-b p-3">{p.revision}</td>
                  <td className="border-b p-3">{p.manufacturingUnit}</td>
                  <td className="border-b p-3">
                    <span
                      className={`px-2 py-1 rounded-full text-sm font-medium ${
                        p.status === "Passed"
                          ? "bg-green-100 text-green-800"
                          : p.status === "Failed"
                            ? "bg-red-100 text-red-800"
                            : "bg-yellow-100 text-yellow-800"
                      }`}
                    >
                      {p.status}
                    </span>

                    {p.status === "Failed" && (
                      <span className="ml-2 px-2 py-1 text-xs bg-orange-100 text-orange-800 rounded-full">
                        Re-Manufacturing
                      </span>
                    )}
                  </td>

                  {user.role === "Admin" && (
                    <td className="border-b p-3 space-x-2">
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
                  )}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

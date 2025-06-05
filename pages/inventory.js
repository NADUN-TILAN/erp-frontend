import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";

export default function InventoryPage() {
  const { data: session } = useSession();
  const [products, setProducts] = useState([]);

  useEffect(() => {
    fetch("http://localhost:5001/api/product") // adjust if running in Docker
      .then((res) => res.json())
      .then((data) => setProducts(data));
  }, []);

  if (!session) return <p className="text-center mt-10">Please sign in to view inventory.</p>;

  return (
    <div className="p-10">
      <h1 className="text-2xl font-bold mb-4">Inventory</h1>
      <table className="min-w-full bg-white border border-gray-300">
        <thead>
          <tr>
            <th className="border px-4 py-2">SKU</th>
            <th className="border px-4 py-2">Name</th>
            <th className="border px-4 py-2">Quantity</th>
            <th className="border px-4 py-2">Price</th>
          </tr>
        </thead>
        <tbody>
          {products.map(product => (
            <tr key={product.id}>
              <td className="border px-4 py-2">{product.sku}</td>
              <td className="border px-4 py-2">{product.name}</td>
              <td className="border px-4 py-2">{product.quantity}</td>
              <td className="border px-4 py-2">${product.price}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

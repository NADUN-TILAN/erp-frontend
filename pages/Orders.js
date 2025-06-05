import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";

export default function Orders() {
  const { data: session } = useSession();
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    fetch("http://localhost:5002/api/orders")
      .then(res => res.json())
      .then(data => setOrders(data));
  }, []);

  if (!session) return <p>Please sign in to view orders.</p>;

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Orders</h1>
      {orders.length === 0 ? <p>No orders found.</p> : (
        <ul className="space-y-4">
          {orders.map(order => (
            <li key={order.id} className="border p-4 rounded">
              <p><strong>Order #: </strong>{order.orderNumber}</p>
              <p><strong>Date: </strong>{new Date(order.createdAt).toLocaleString()}</p>
              <ul className="pl-4">
                {order.items.map(item => (
                  <li key={item.id}>{item.productId} - Qty: {item.quantity}</li>
                ))}
              </ul>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

import { useLocation } from "wouter";
import { useListOrders } from "@workspace/api-client-react";
import { FiArrowRight, FiClock, FiPackage } from "react-icons/fi";

const STATUS_COLORS: Record<string, string> = {
  pending: "bg-yellow-50 text-yellow-700 border-yellow-200",
  confirmed: "bg-blue-50 text-blue-700 border-blue-200",
  preparing: "bg-orange-50 text-orange-700 border-orange-200",
  out_for_delivery: "bg-purple-50 text-purple-700 border-purple-200",
  delivered: "bg-green-50 text-green-700 border-green-200",
  cancelled: "bg-red-50 text-red-600 border-red-200",
};

const STATUS_LABELS: Record<string, string> = {
  pending: "Pending",
  confirmed: "Confirmed",
  preparing: "Preparing",
  out_for_delivery: "Out for Delivery",
  delivered: "Delivered",
  cancelled: "Cancelled",
};

export default function OrdersPage() {
  const [, navigate] = useLocation();
  const { data: orders, isLoading } = useListOrders();

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 py-8">
        <h1 className="text-2xl font-extrabold text-foreground mb-6">Your Orders</h1>

        {isLoading ? (
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="bg-card rounded-2xl p-5 border border-border animate-pulse">
                <div className="h-4 bg-muted rounded w-1/2 mb-3" />
                <div className="h-3 bg-muted rounded w-1/3 mb-4" />
                <div className="h-10 bg-muted rounded w-full" />
              </div>
            ))}
          </div>
        ) : orders && orders.length > 0 ? (
          <div className="space-y-4">
            {orders.map((order) => (
              <div
                key={order.id}
                onClick={() => navigate(`/orders/${order.id}`)}
                className="bg-white rounded-2xl border border-border p-5 cursor-pointer hover:shadow-sm transition-shadow"
              >
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div>
                    <h3 className="font-bold text-foreground">{order.restaurantName}</h3>
                    <p className="text-sm text-muted-foreground mt-0.5">
                      Order #{order.id} •{" "}
                      {new Date(order.createdAt).toLocaleDateString("en-IN", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>
                  </div>
                  <span
                    className={`flex-shrink-0 text-xs font-semibold px-2.5 py-1 rounded-full border ${
                      STATUS_COLORS[order.status] ?? "bg-muted text-muted-foreground border-border"
                    }`}
                  >
                    {STATUS_LABELS[order.status] ?? order.status}
                  </span>
                </div>

                <div className="text-sm text-muted-foreground mb-4">
                  {order.items.slice(0, 3).map((item, i) => (
                    <span key={i}>
                      {i > 0 && ", "}
                      {item.name} x{item.quantity}
                    </span>
                  ))}
                  {order.items.length > 3 && ` +${order.items.length - 3} more`}
                </div>

                <div className="flex items-center justify-between pt-3 border-t border-border">
                  <div className="text-sm font-semibold text-foreground">
                    ₹{order.grandTotal.toFixed(0)} • {order.items.reduce((s, i) => s + i.quantity, 0)} items
                  </div>
                  <div className="flex items-center gap-1 text-primary text-sm font-medium">
                    View Details <FiArrowRight className="w-3.5 h-3.5" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <div className="w-20 h-20 bg-muted rounded-full flex items-center justify-center mx-auto mb-5">
              <FiPackage className="w-9 h-9 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-bold text-foreground mb-2">No orders yet</h3>
            <p className="text-muted-foreground mb-6">Your order history will appear here</p>
            <button
              onClick={() => navigate("/restaurants")}
              className="bg-primary text-white px-8 py-3.5 rounded-xl font-semibold hover:bg-primary/90 transition-colors"
            >
              Order Now
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

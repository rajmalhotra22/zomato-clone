import { useParams, useLocation } from "wouter";
import { useGetOrder } from "@workspace/api-client-react";
import { FiArrowLeft, FiMapPin, FiCheckCircle, FiClock, FiPackage, FiTruck } from "react-icons/fi";

const STATUS_STEPS = ["confirmed", "preparing", "out_for_delivery", "delivered"];

const STATUS_INFO: Record<string, { label: string; icon: any; color: string }> = {
  pending: { label: "Pending", icon: FiClock, color: "text-yellow-600" },
  confirmed: { label: "Order Confirmed", icon: FiCheckCircle, color: "text-blue-600" },
  preparing: { label: "Preparing Your Food", icon: FiPackage, color: "text-orange-600" },
  out_for_delivery: { label: "Out for Delivery", icon: FiTruck, color: "text-purple-600" },
  delivered: { label: "Delivered", icon: FiCheckCircle, color: "text-green-600" },
  cancelled: { label: "Cancelled", icon: FiArrowLeft, color: "text-red-600" },
};

export default function OrderDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [, navigate] = useLocation();
  const orderId = parseInt(id, 10);
  const { data: order, isLoading } = useGetOrder(orderId, {
    query: { enabled: !!orderId },
  });

  if (isLoading) {
    return (
      <div className="max-w-2xl mx-auto px-4 sm:px-6 py-8 animate-pulse">
        <div className="h-8 bg-muted rounded w-1/3 mb-6" />
        <div className="bg-card rounded-2xl p-5 border border-border space-y-3 mb-5">
          <div className="h-4 bg-muted rounded w-1/2" />
          <div className="h-3 bg-muted rounded w-1/3" />
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="text-center py-20">
        <p className="text-muted-foreground">Order not found</p>
      </div>
    );
  }

  const currentStepIdx = STATUS_STEPS.indexOf(order.status);
  const statusInfo = STATUS_INFO[order.status] ?? STATUS_INFO.confirmed;
  const StatusIcon = statusInfo.icon;

  return (
    <div className="min-h-screen bg-background">
      <div className="bg-white border-b border-border">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 py-4 flex items-center gap-3">
          <button onClick={() => navigate("/orders")} className="p-2 rounded-full hover:bg-muted transition-colors">
            <FiArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-lg font-bold text-foreground">Order #{order.id}</h1>
            <p className="text-sm text-muted-foreground">{order.restaurantName}</p>
          </div>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 sm:px-6 py-6 space-y-5">
        {/* Status */}
        <div className="bg-white rounded-2xl border border-border p-5">
          <div className={`flex items-center gap-3 mb-5 ${statusInfo.color}`}>
            <StatusIcon className="w-6 h-6" />
            <span className="text-lg font-bold">{statusInfo.label}</span>
          </div>

          {/* Progress bar */}
          {order.status !== "cancelled" && (
            <div className="relative">
              <div className="flex items-center justify-between relative">
                {STATUS_STEPS.map((step, idx) => {
                  const isDone = idx <= currentStepIdx;
                  const stepInfo = STATUS_INFO[step];
                  const StepIcon = stepInfo?.icon ?? FiCheckCircle;
                  return (
                    <div key={step} className="flex flex-col items-center gap-1.5 relative z-10">
                      <div
                        className={`w-9 h-9 rounded-full flex items-center justify-center transition-colors ${
                          isDone ? "bg-primary text-white" : "bg-muted text-muted-foreground"
                        }`}
                      >
                        <StepIcon className="w-4 h-4" />
                      </div>
                      <span className={`text-xs font-medium text-center max-w-16 leading-tight ${isDone ? "text-foreground" : "text-muted-foreground"}`}>
                        {stepInfo?.label?.split(" ").slice(-1)[0]}
                      </span>
                    </div>
                  );
                })}
                {/* Progress line */}
                <div className="absolute top-4 left-4 right-4 h-0.5 bg-muted -z-0">
                  <div
                    className="h-full bg-primary transition-all duration-500"
                    style={{
                      width: `${Math.max(0, (currentStepIdx / (STATUS_STEPS.length - 1)) * 100)}%`,
                    }}
                  />
                </div>
              </div>
            </div>
          )}

          <div className="mt-4 pt-4 border-t border-border text-sm text-muted-foreground">
            <p>Estimated delivery: {new Date(order.estimatedDelivery).toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" })}</p>
          </div>
        </div>

        {/* Items */}
        <div className="bg-white rounded-2xl border border-border overflow-hidden">
          <div className="p-4 border-b border-border">
            <h2 className="font-bold text-foreground">Order Items</h2>
          </div>
          {order.items.map((item, i) => (
            <div key={i} className="flex justify-between items-center px-4 py-3 border-b border-border last:border-0">
              <div>
                <p className="font-medium text-foreground">{item.name}</p>
                <p className="text-sm text-muted-foreground">Qty: {item.quantity}</p>
              </div>
              <span className="font-semibold text-foreground">₹{(item.price * item.quantity).toFixed(0)}</span>
            </div>
          ))}
        </div>

        {/* Address */}
        <div className="bg-white rounded-2xl border border-border p-4">
          <h2 className="font-bold text-foreground mb-2 flex items-center gap-2">
            <FiMapPin className="w-4 h-4 text-primary" /> Delivery Address
          </h2>
          <p className="text-sm text-muted-foreground">{order.deliveryAddress}</p>
        </div>

        {/* Bill */}
        <div className="bg-white rounded-2xl border border-border p-4">
          <h2 className="font-bold text-foreground mb-4">Bill Details</h2>
          <div className="space-y-2.5 text-sm">
            <div className="flex justify-between text-foreground">
              <span>Item Total</span>
              <span>₹{order.totalAmount.toFixed(0)}</span>
            </div>
            <div className="flex justify-between text-muted-foreground">
              <span>Delivery Fee</span>
              <span>₹{order.deliveryFee.toFixed(0)}</span>
            </div>
            <div className="border-t border-border pt-2.5 flex justify-between font-bold text-base text-foreground">
              <span>Total Paid</span>
              <span>₹{order.grandTotal.toFixed(0)}</span>
            </div>
          </div>
        </div>

        <div className="text-center text-xs text-muted-foreground pt-2">
          Placed on{" "}
          {new Date(order.createdAt).toLocaleDateString("en-IN", {
            day: "numeric",
            month: "long",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
          })}
        </div>
      </div>
    </div>
  );
}

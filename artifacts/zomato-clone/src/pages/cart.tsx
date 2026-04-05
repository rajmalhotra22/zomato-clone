import { useState } from "react";
import { useLocation } from "wouter";
import { useCart } from "@/context/CartContext";
import { useCreateOrder } from "@workspace/api-client-react";
import { FiPlus, FiMinus, FiTrash2, FiMapPin, FiArrowLeft, FiCheckCircle } from "react-icons/fi";

export default function CartPage() {
  const { items, restaurantId, restaurantName, totalAmount, updateQuantity, removeItem, clearCart } = useCart();
  const [, navigate] = useLocation();
  const [address, setAddress] = useState("123 MG Road, Bengaluru, Karnataka 560001");
  const [ordered, setOrdered] = useState(false);
  const [orderId, setOrderId] = useState<number | null>(null);

  const createOrder = useCreateOrder();

  const deliveryFee = items.length > 0 ? 30 : 0;
  const platformFee = items.length > 0 ? 5 : 0;
  const grandTotal = totalAmount + deliveryFee + platformFee;

  async function handlePlaceOrder() {
    if (!restaurantId || items.length === 0) return;
    if (!address.trim()) {
      alert("Please enter a delivery address");
      return;
    }

    try {
      const result = await createOrder.mutateAsync({
        restaurantId,
        items: items.map((item) => ({
          menuItemId: item.menuItemId,
          quantity: item.quantity,
        })),
        deliveryAddress: address,
      });
      clearCart();
      setOrderId(result.id);
      setOrdered(true);
    } catch (err) {
      alert("Failed to place order. Please try again.");
    }
  }

  if (ordered && orderId) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-6">
        <div className="text-center max-w-sm">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <FiCheckCircle className="w-10 h-10 text-green-600" />
          </div>
          <h2 className="text-2xl font-extrabold text-foreground mb-2">Order Placed!</h2>
          <p className="text-muted-foreground mb-6">
            Your order from <strong>{restaurantName}</strong> is confirmed. We'll have it delivered shortly!
          </p>
          <div className="flex flex-col gap-3">
            <button
              onClick={() => navigate(`/orders/${orderId}`)}
              className="w-full bg-primary text-white py-3.5 rounded-xl font-semibold hover:bg-primary/90 transition-colors"
            >
              Track Order
            </button>
            <button
              onClick={() => navigate("/")}
              className="w-full bg-muted text-foreground py-3.5 rounded-xl font-semibold hover:bg-muted/80 transition-colors"
            >
              Back to Home
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-6">
        <div className="text-center">
          <div className="text-7xl mb-6">🛒</div>
          <h2 className="text-2xl font-bold text-foreground mb-2">Your cart is empty</h2>
          <p className="text-muted-foreground mb-6">Add items from a restaurant to get started</p>
          <button
            onClick={() => navigate("/restaurants")}
            className="bg-primary text-white px-8 py-3.5 rounded-xl font-semibold hover:bg-primary/90 transition-colors"
          >
            Browse Restaurants
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-white border-b border-border">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 py-4 flex items-center gap-3">
          <button onClick={() => navigate(-1 as any)} className="p-2 rounded-full hover:bg-muted transition-colors">
            <FiArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-lg font-bold text-foreground">Your Cart</h1>
            <p className="text-sm text-muted-foreground">{restaurantName}</p>
          </div>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 sm:px-6 py-6 space-y-5">
        {/* Items */}
        <div className="bg-white rounded-2xl border border-border overflow-hidden">
          <div className="p-4 border-b border-border">
            <h2 className="font-bold text-foreground">{restaurantName}</h2>
          </div>
          {items.map((item) => (
            <div key={item.menuItemId} className="flex items-center gap-4 p-4 border-b border-border last:border-0">
              <div className="w-16 h-16 rounded-xl overflow-hidden bg-muted flex-shrink-0">
                <img src={item.imageUrl} alt={item.name} className="w-full h-full object-cover" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5 mb-0.5">
                  <div
                    className={`w-3.5 h-3.5 rounded-sm border-2 flex items-center justify-center ${
                      item.isVeg ? "border-green-600" : "border-red-500"
                    }`}
                  >
                    <div className={`w-1.5 h-1.5 rounded-full ${item.isVeg ? "bg-green-600" : "bg-red-500"}`} />
                  </div>
                </div>
                <p className="font-medium text-foreground leading-tight">{item.name}</p>
                <p className="text-sm font-bold text-foreground mt-0.5">₹{(item.price * item.quantity).toFixed(0)}</p>
              </div>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => updateQuantity(item.menuItemId, item.quantity - 1)}
                  className="w-8 h-8 rounded-lg border border-primary text-primary flex items-center justify-center hover:bg-primary/5 transition-colors"
                >
                  {item.quantity === 1 ? <FiTrash2 className="w-3.5 h-3.5" /> : <FiMinus className="w-3.5 h-3.5" />}
                </button>
                <span className="w-8 text-center text-sm font-bold">{item.quantity}</span>
                <button
                  onClick={() => updateQuantity(item.menuItemId, item.quantity + 1)}
                  className="w-8 h-8 rounded-lg bg-primary text-white flex items-center justify-center hover:bg-primary/90 transition-colors"
                >
                  <FiPlus className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Delivery address */}
        <div className="bg-white rounded-2xl border border-border p-4">
          <h2 className="font-bold text-foreground mb-3 flex items-center gap-2">
            <FiMapPin className="w-4 h-4 text-primary" />
            Delivery Address
          </h2>
          <textarea
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            rows={2}
            className="w-full text-sm bg-muted rounded-xl px-3 py-2.5 border border-transparent focus:border-primary focus:bg-white focus:outline-none resize-none"
          />
        </div>

        {/* Bill */}
        <div className="bg-white rounded-2xl border border-border p-4">
          <h2 className="font-bold text-foreground mb-4">Bill Details</h2>
          <div className="space-y-2.5 text-sm">
            <div className="flex justify-between text-foreground">
              <span>Item Total</span>
              <span>₹{totalAmount.toFixed(0)}</span>
            </div>
            <div className="flex justify-between text-muted-foreground">
              <span>Delivery Fee</span>
              <span>₹{deliveryFee}</span>
            </div>
            <div className="flex justify-between text-muted-foreground">
              <span>Platform Fee</span>
              <span>₹{platformFee}</span>
            </div>
            <div className="border-t border-border pt-2.5 flex justify-between font-bold text-base text-foreground">
              <span>To Pay</span>
              <span>₹{grandTotal.toFixed(0)}</span>
            </div>
          </div>
        </div>

        {/* Place Order */}
        <button
          onClick={handlePlaceOrder}
          disabled={createOrder.isPending}
          className="w-full bg-primary text-white py-4 rounded-2xl font-bold text-base hover:bg-primary/90 transition-colors disabled:opacity-60 flex items-center justify-center gap-2"
        >
          {createOrder.isPending ? (
            <>
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              Placing Order...
            </>
          ) : (
            `Place Order • ₹${grandTotal.toFixed(0)}`
          )}
        </button>
      </div>
    </div>
  );
}

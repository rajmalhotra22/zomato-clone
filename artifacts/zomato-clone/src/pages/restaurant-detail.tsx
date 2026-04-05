import { useParams, useLocation } from "wouter";
import { useGetRestaurant, useGetRestaurantMenu } from "@workspace/api-client-react";
import { useCart } from "@/context/CartContext";
import { useState } from "react";
import { FiStar, FiClock, FiTruck, FiPlus, FiMinus, FiArrowLeft } from "react-icons/fi";

export default function RestaurantDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [, navigate] = useLocation();
  const restaurantId = parseInt(id, 10);
  const { data: restaurant, isLoading: restLoading } = useGetRestaurant(restaurantId, {
    query: { enabled: !!restaurantId },
  });
  const { data: menu, isLoading: menuLoading } = useGetRestaurantMenu(restaurantId, undefined, {
    query: { enabled: !!restaurantId },
  });

  const { addItem, items, updateQuantity, restaurantId: cartRestaurantId } = useCart();
  const [activeCategory, setActiveCategory] = useState<string | null>(null);

  function getItemQuantity(menuItemId: number) {
    const cartItem = items.find((i) => i.menuItemId === menuItemId);
    return cartItem?.quantity ?? 0;
  }

  if (restLoading) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 animate-pulse">
        <div className="h-64 bg-muted rounded-2xl mb-6" />
        <div className="h-8 bg-muted rounded w-1/2 mb-3" />
        <div className="h-4 bg-muted rounded w-1/3" />
      </div>
    );
  }

  if (!restaurant) {
    return (
      <div className="text-center py-20">
        <p className="text-muted-foreground">Restaurant not found</p>
      </div>
    );
  }

  const categories = menu ?? [];
  const filteredCategories = activeCategory
    ? categories.filter((c) => c.category === activeCategory)
    : categories;

  return (
    <div className="min-h-screen bg-background">
      {/* Hero */}
      <div className="relative h-56 sm:h-72 overflow-hidden bg-muted">
        <img
          src={restaurant.imageUrl}
          alt={restaurant.name}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        <button
          onClick={() => navigate("/restaurants")}
          className="absolute top-4 left-4 bg-white/90 hover:bg-white p-2 rounded-full transition-colors"
        >
          <FiArrowLeft className="w-5 h-5 text-foreground" />
        </button>
        {restaurant.discount && (
          <div className="absolute bottom-4 left-4 bg-primary text-white text-xs font-bold px-3 py-1.5 rounded-lg">
            {restaurant.discount}
          </div>
        )}
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        {/* Restaurant info */}
        <div className="bg-white -mt-4 relative z-10 rounded-2xl shadow-sm border border-border p-5 mb-6">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h1 className="text-2xl font-extrabold text-foreground">{restaurant.name}</h1>
              <p className="text-muted-foreground mt-1">{restaurant.cuisine}</p>
              <p className="text-muted-foreground text-sm mt-1">{restaurant.address}</p>
            </div>
            <div className="flex flex-col items-end gap-1 flex-shrink-0">
              <div className="flex items-center gap-1.5 bg-green-50 border border-green-200 rounded-xl px-3 py-1.5">
                <FiStar className="w-4 h-4 fill-green-600 text-green-600" />
                <span className="font-bold text-green-700">{restaurant.rating.toFixed(1)}</span>
                <span className="text-green-600 text-xs">({restaurant.reviewCount.toLocaleString()})</span>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-4 mt-4 pt-4 border-t border-border text-sm text-muted-foreground">
            <div className="flex items-center gap-1.5">
              <FiClock className="w-4 h-4 text-primary" />
              <span>{restaurant.deliveryTime} min delivery</span>
            </div>
            <div className="flex items-center gap-1.5">
              <FiTruck className="w-4 h-4 text-primary" />
              <span>{restaurant.deliveryFee === 0 ? "Free delivery" : `₹${restaurant.deliveryFee} delivery`}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span>Min order: ₹{restaurant.minimumOrder}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span>₹{restaurant.priceForTwo} for two</span>
            </div>
            {restaurant.isVeg && (
              <span className="bg-green-50 text-green-700 border border-green-200 text-xs font-medium px-2 py-0.5 rounded-full">
                Pure Veg
              </span>
            )}
            {!restaurant.isOpen && (
              <span className="bg-red-50 text-red-600 border border-red-200 text-xs font-medium px-2 py-0.5 rounded-full">
                Currently Closed
              </span>
            )}
          </div>
        </div>

        {/* Category tabs */}
        {categories.length > 0 && (
          <div className="flex gap-2 overflow-x-auto scrollbar-none mb-6 pb-1">
            <button
              onClick={() => setActiveCategory(null)}
              className={`px-4 py-2 rounded-lg text-sm font-medium flex-shrink-0 transition-colors ${
                !activeCategory
                  ? "bg-primary text-white"
                  : "bg-muted text-muted-foreground hover:bg-muted/80"
              }`}
            >
              All
            </button>
            {categories.map((cat) => (
              <button
                key={cat.category}
                onClick={() => setActiveCategory(cat.category === activeCategory ? null : cat.category)}
                className={`px-4 py-2 rounded-lg text-sm font-medium flex-shrink-0 transition-colors ${
                  activeCategory === cat.category
                    ? "bg-primary text-white"
                    : "bg-muted text-muted-foreground hover:bg-muted/80"
                }`}
              >
                {cat.category} ({cat.items.length})
              </button>
            ))}
          </div>
        )}

        {/* Menu */}
        {menuLoading ? (
          <div className="space-y-3">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="bg-card rounded-2xl p-4 flex gap-4 animate-pulse">
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-muted rounded w-1/2" />
                  <div className="h-3 bg-muted rounded w-3/4" />
                  <div className="h-4 bg-muted rounded w-1/4 mt-2" />
                </div>
                <div className="w-24 h-24 bg-muted rounded-xl flex-shrink-0" />
              </div>
            ))}
          </div>
        ) : (
          <div className="space-y-8 pb-32">
            {filteredCategories.map((cat) => (
              <div key={cat.category}>
                <h2 className="text-lg font-bold text-foreground mb-4 flex items-center gap-2">
                  {cat.category}
                  <span className="text-sm font-normal text-muted-foreground">({cat.items.length})</span>
                </h2>
                <div className="space-y-3">
                  {cat.items.map((item) => {
                    const qty = getItemQuantity(item.id);
                    return (
                      <div key={item.id} className="bg-white rounded-2xl border border-border p-4 flex gap-4">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <div
                              className={`w-4 h-4 rounded-sm border-2 flex-shrink-0 flex items-center justify-center ${
                                item.isVeg ? "border-green-600" : "border-red-500"
                              }`}
                            >
                              <div
                                className={`w-2 h-2 rounded-full ${
                                  item.isVeg ? "bg-green-600" : "bg-red-500"
                                }`}
                              />
                            </div>
                            {item.isPopular && (
                              <span className="text-xs text-primary font-semibold bg-primary/10 px-1.5 py-0.5 rounded">
                                Bestseller
                              </span>
                            )}
                          </div>
                          <h3 className="font-semibold text-foreground leading-tight">{item.name}</h3>
                          <p className="text-sm text-muted-foreground mt-1 line-clamp-2">{item.description}</p>
                          <p className="font-bold text-foreground mt-2">₹{item.price}</p>
                        </div>

                        <div className="flex-shrink-0 flex flex-col items-center gap-2 w-24">
                          <div className="w-24 h-24 rounded-xl overflow-hidden bg-muted">
                            <img
                              src={item.imageUrl}
                              alt={item.name}
                              className="w-full h-full object-cover"
                              loading="lazy"
                            />
                          </div>
                          {item.isAvailable ? (
                            qty > 0 ? (
                              <div className="flex items-center gap-1 bg-primary text-white rounded-lg overflow-hidden w-full">
                                <button
                                  onClick={() => updateQuantity(item.id, qty - 1)}
                                  className="p-1.5 hover:bg-primary/80 transition-colors"
                                >
                                  <FiMinus className="w-3.5 h-3.5" />
                                </button>
                                <span className="flex-1 text-center text-sm font-bold">{qty}</span>
                                <button
                                  onClick={() =>
                                    addItem(
                                      {
                                        menuItemId: item.id,
                                        name: item.name,
                                        price: item.price,
                                        quantity: 1,
                                        isVeg: item.isVeg,
                                        imageUrl: item.imageUrl,
                                      },
                                      restaurant.id,
                                      restaurant.name
                                    )
                                  }
                                  className="p-1.5 hover:bg-primary/80 transition-colors"
                                >
                                  <FiPlus className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            ) : (
                              <button
                                onClick={() =>
                                  addItem(
                                    {
                                      menuItemId: item.id,
                                      name: item.name,
                                      price: item.price,
                                      quantity: 1,
                                      isVeg: item.isVeg,
                                      imageUrl: item.imageUrl,
                                    },
                                    restaurant.id,
                                    restaurant.name
                                  )
                                }
                                className="w-full bg-white border border-primary text-primary text-sm font-semibold py-1.5 rounded-lg hover:bg-primary/5 transition-colors flex items-center justify-center gap-1"
                              >
                                <FiPlus className="w-3.5 h-3.5" /> Add
                              </button>
                            )
                          ) : (
                            <span className="text-xs text-muted-foreground">Unavailable</span>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Floating Cart Bar */}
      <CartBar restaurantId={restaurant.id} />
    </div>
  );
}

function CartBar({ restaurantId }: { restaurantId: number }) {
  const { items, totalItems, totalAmount, restaurantId: cartRestaurantId } = useCart();
  const [, navigate] = useLocation();

  if (totalItems === 0 || cartRestaurantId !== restaurantId) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 p-4 bg-white/80 backdrop-blur-sm border-t border-border">
      <div className="max-w-4xl mx-auto">
        <button
          onClick={() => navigate("/cart")}
          className="w-full flex items-center justify-between bg-primary text-white px-6 py-4 rounded-2xl font-semibold shadow-lg hover:bg-primary/90 transition-colors"
        >
          <div className="flex items-center gap-2">
            <span className="bg-white/20 text-white text-sm font-bold w-7 h-7 rounded-lg flex items-center justify-center">
              {totalItems}
            </span>
            <span>{totalItems} item{totalItems > 1 ? "s" : ""} added</span>
          </div>
          <div className="flex items-center gap-2">
            <span>View Cart</span>
            <span className="font-bold">₹{totalAmount.toFixed(0)}</span>
          </div>
        </button>
      </div>
    </div>
  );
}

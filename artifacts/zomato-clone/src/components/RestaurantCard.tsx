import { Link } from "wouter";
import { FiStar, FiClock, FiTruck } from "react-icons/fi";

interface Restaurant {
  id: number;
  name: string;
  cuisine: string;
  rating: number;
  reviewCount: number;
  deliveryTime: number;
  deliveryFee: number;
  imageUrl: string;
  isVeg: boolean;
  isOpen: boolean;
  discount?: string | null;
  priceForTwo: number;
}

export function RestaurantCard({ restaurant }: { restaurant: Restaurant }) {
  return (
    <Link href={`/restaurants/${restaurant.id}`}>
      <div className={`group bg-card rounded-2xl overflow-hidden shadow-sm border border-card-border hover:shadow-md transition-all duration-200 cursor-pointer ${!restaurant.isOpen ? "opacity-60" : ""}`}>
        {/* Image */}
        <div className="relative aspect-[16/9] overflow-hidden bg-muted">
          <img
            src={restaurant.imageUrl}
            alt={restaurant.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            loading="lazy"
          />
          {restaurant.discount && (
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent px-3 py-2">
              <span className="text-white text-xs font-bold uppercase tracking-wide">{restaurant.discount}</span>
            </div>
          )}
          {!restaurant.isOpen && (
            <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
              <span className="bg-white/90 text-sm font-semibold px-3 py-1 rounded-full text-muted-foreground">Currently Closed</span>
            </div>
          )}
          {restaurant.isVeg && (
            <div className="absolute top-2 right-2 bg-green-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">Pure Veg</div>
          )}
        </div>

        {/* Info */}
        <div className="p-4">
          <div className="flex items-start justify-between gap-2">
            <h3 className="font-bold text-foreground text-base leading-tight line-clamp-1">{restaurant.name}</h3>
            <div className="flex items-center gap-1 bg-green-50 border border-green-200 rounded-lg px-2 py-0.5 flex-shrink-0">
              <FiStar className="w-3 h-3 fill-green-600 text-green-600" />
              <span className="text-sm font-bold text-green-700">{restaurant.rating.toFixed(1)}</span>
            </div>
          </div>
          <p className="text-muted-foreground text-sm mt-0.5 line-clamp-1">{restaurant.cuisine}</p>

          <div className="flex items-center gap-3 mt-3 pt-3 border-t border-border text-xs text-muted-foreground">
            <div className="flex items-center gap-1">
              <FiClock className="w-3.5 h-3.5" />
              <span>{restaurant.deliveryTime} min</span>
            </div>
            <div className="flex items-center gap-1">
              <FiTruck className="w-3.5 h-3.5" />
              <span>{restaurant.deliveryFee === 0 ? "Free delivery" : `₹${restaurant.deliveryFee} delivery`}</span>
            </div>
            <span className="ml-auto">₹{restaurant.priceForTwo} for two</span>
          </div>
        </div>
      </div>
    </Link>
  );
}

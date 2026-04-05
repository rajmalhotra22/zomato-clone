import { useState } from "react";
import { useLocation } from "wouter";
import { useGetFeaturedRestaurants, useListCategories, useGetRestaurantStats } from "@workspace/api-client-react";
import { RestaurantCard } from "@/components/RestaurantCard";
import { FiSearch, FiMapPin, FiArrowRight } from "react-icons/fi";

export default function HomePage() {
  const [search, setSearch] = useState("");
  const [, navigate] = useLocation();
  const { data: featured, isLoading: featuredLoading } = useGetFeaturedRestaurants();
  const { data: categories } = useListCategories();
  const { data: stats } = useGetRestaurantStats();

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    if (search.trim()) {
      navigate(`/restaurants?search=${encodeURIComponent(search)}`);
    } else {
      navigate("/restaurants");
    }
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Hero */}
      <div
        className="relative overflow-hidden"
        style={{
          background: "linear-gradient(135deg, hsl(4 83% 52%) 0%, hsl(15 90% 55%) 50%, hsl(30 95% 60%) 100%)",
        }}
      >
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-20 w-40 h-40 rounded-full bg-white" />
          <div className="absolute bottom-0 right-10 w-64 h-64 rounded-full bg-white" />
          <div className="absolute top-5 right-40 w-20 h-20 rounded-full bg-white" />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 py-16 sm:py-24">
          <div className="max-w-2xl">
            <h1 className="text-4xl sm:text-5xl font-extrabold text-white leading-tight mb-3">
              Discover great food, delivered fast
            </h1>
            <p className="text-white/85 text-lg mb-8">
              Order from top restaurants near you. Fresh meals, lightning-fast delivery.
            </p>

            {/* Search bar */}
            <form onSubmit={handleSearch} className="flex gap-2 max-w-xl">
              <div className="flex-1 relative">
                <FiMapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <input
                  readOnly
                  value="Bengaluru, Karnataka"
                  className="w-full pl-10 pr-4 py-4 text-sm bg-white rounded-xl border-0 focus:outline-none text-muted-foreground cursor-default"
                />
              </div>
              <div className="flex-[2] relative">
                <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <input
                  type="search"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search for restaurants or dishes..."
                  className="w-full pl-10 pr-4 py-4 text-sm bg-white rounded-xl border-0 focus:outline-none focus:ring-2 focus:ring-white/50"
                />
              </div>
              <button
                type="submit"
                className="px-6 py-4 bg-foreground text-background font-semibold text-sm rounded-xl hover:opacity-90 transition-opacity"
              >
                Search
              </button>
            </form>

            {/* Stats */}
            {stats && (
              <div className="flex flex-wrap gap-6 mt-8">
                <div className="text-white">
                  <div className="text-2xl font-extrabold">{stats.totalRestaurants}+</div>
                  <div className="text-white/75 text-sm">Restaurants</div>
                </div>
                <div className="text-white">
                  <div className="text-2xl font-extrabold">{stats.totalCuisines}+</div>
                  <div className="text-white/75 text-sm">Cuisines</div>
                </div>
                <div className="text-white">
                  <div className="text-2xl font-extrabold">{stats.avgDeliveryTime} min</div>
                  <div className="text-white/75 text-sm">Avg. delivery</div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Categories */}
      {categories && categories.length > 0 && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
          <h2 className="text-xl font-bold text-foreground mb-5">What's on your mind?</h2>
          <div className="grid grid-cols-4 sm:grid-cols-8 gap-3">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => navigate(`/restaurants?cuisine=${encodeURIComponent(cat.name)}`)}
                className="flex flex-col items-center gap-2 group"
              >
                <div className="w-full aspect-square rounded-2xl overflow-hidden bg-muted group-hover:shadow-md transition-shadow">
                  <img
                    src={cat.imageUrl}
                    alt={cat.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                    loading="lazy"
                  />
                </div>
                <span className="text-xs font-medium text-foreground text-center">{cat.name}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Featured Restaurants */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 pb-16">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-xl font-bold text-foreground">Featured Restaurants</h2>
          <button
            onClick={() => navigate("/restaurants")}
            className="flex items-center gap-1 text-sm text-primary font-medium hover:underline"
          >
            See all <FiArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {featuredLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="bg-card rounded-2xl overflow-hidden animate-pulse">
                <div className="aspect-[16/9] bg-muted" />
                <div className="p-4 space-y-2">
                  <div className="h-4 bg-muted rounded w-3/4" />
                  <div className="h-3 bg-muted rounded w-1/2" />
                  <div className="h-3 bg-muted rounded w-full mt-4" />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {featured?.map((restaurant) => (
              <RestaurantCard key={restaurant.id} restaurant={restaurant} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

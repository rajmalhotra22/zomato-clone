import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { useListRestaurants, useListCategories } from "@workspace/api-client-react";
import { RestaurantCard } from "@/components/RestaurantCard";
import { FiFilter, FiSearch } from "react-icons/fi";

type SortOption = "rating" | "delivery_time" | "cost";

export default function RestaurantsPage() {
  const [location] = useLocation();
  const params = new URLSearchParams(
    typeof window !== "undefined" ? window.location.search : ""
  );

  const [search, setSearch] = useState(params.get("search") ?? "");
  const [cuisine, setCuisine] = useState(params.get("cuisine") ?? "");
  const [sort, setSort] = useState<SortOption | "">("");
  const [vegOnly, setVegOnly] = useState(false);

  const queryParams: Record<string, string | boolean | undefined> = {};
  if (search) queryParams.search = search;
  if (cuisine) queryParams.cuisine = cuisine;
  if (sort) queryParams.sort = sort;
  if (vegOnly) queryParams.vegetarian = true;

  const { data: restaurants, isLoading } = useListRestaurants(queryParams as any);
  const { data: categories } = useListCategories();

  const sortOptions: { value: SortOption; label: string }[] = [
    { value: "rating", label: "Top Rated" },
    { value: "delivery_time", label: "Fastest Delivery" },
    { value: "cost", label: "Cost: Low to High" },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Filter bar */}
      <div className="sticky top-16 z-40 bg-white border-b border-border shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3">
          <div className="flex items-center gap-3 overflow-x-auto scrollbar-none">
            {/* Search input */}
            <div className="relative flex-shrink-0 hidden sm:block">
              <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground w-3.5 h-3.5" />
              <input
                type="search"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search restaurants..."
                className="pl-8 pr-3 py-2 text-sm bg-muted rounded-lg border border-transparent focus:border-primary focus:bg-white focus:outline-none w-44"
              />
            </div>

            {/* Veg filter */}
            <button
              onClick={() => setVegOnly(!vegOnly)}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium flex-shrink-0 border transition-colors ${
                vegOnly
                  ? "bg-green-50 border-green-400 text-green-700"
                  : "border-border text-muted-foreground hover:border-foreground"
              }`}
            >
              <span
                className={`w-3 h-3 rounded-sm border-2 ${
                  vegOnly ? "bg-green-500 border-green-500" : "border-green-500"
                }`}
              />
              Pure Veg
            </button>

            {/* Sort options */}
            {sortOptions.map((opt) => (
              <button
                key={opt.value}
                onClick={() => setSort(sort === opt.value ? "" : opt.value)}
                className={`px-3 py-2 rounded-lg text-sm font-medium flex-shrink-0 border transition-colors ${
                  sort === opt.value
                    ? "bg-primary/10 border-primary text-primary"
                    : "border-border text-muted-foreground hover:border-foreground"
                }`}
              >
                {opt.label}
              </button>
            ))}

            <div className="h-5 w-px bg-border flex-shrink-0" />

            {/* Cuisine filters */}
            <button
              onClick={() => setCuisine("")}
              className={`px-3 py-2 rounded-lg text-sm font-medium flex-shrink-0 border transition-colors ${
                !cuisine
                  ? "bg-primary text-white border-primary"
                  : "border-border text-muted-foreground hover:border-foreground"
              }`}
            >
              All
            </button>
            {categories?.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setCuisine(cuisine === cat.name ? "" : cat.name)}
                className={`px-3 py-2 rounded-lg text-sm font-medium flex-shrink-0 border transition-colors ${
                  cuisine === cat.name
                    ? "bg-primary text-white border-primary"
                    : "border-border text-muted-foreground hover:border-foreground"
                }`}
              >
                {cat.name}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        <div className="flex items-center justify-between mb-5">
          <h1 className="text-xl font-bold text-foreground">
            {cuisine ? `${cuisine} Restaurants` : "All Restaurants"}
            {restaurants && (
              <span className="ml-2 text-base font-normal text-muted-foreground">
                ({restaurants.length})
              </span>
            )}
          </h1>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {[...Array(8)].map((_, i) => (
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
        ) : restaurants && restaurants.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {restaurants.map((restaurant) => (
              <RestaurantCard key={restaurant.id} restaurant={restaurant} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <div className="text-6xl mb-4">🍽️</div>
            <h3 className="text-lg font-semibold text-foreground mb-2">No restaurants found</h3>
            <p className="text-muted-foreground">Try adjusting your filters or search query</p>
          </div>
        )}
      </div>
    </div>
  );
}

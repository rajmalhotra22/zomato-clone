import { useState } from "react";
import { Link, useLocation } from "wouter";
import { useCart } from "@/context/CartContext";
import { FiShoppingCart, FiMapPin, FiSearch, FiList } from "react-icons/fi";

export function Navbar() {
  const { totalItems } = useCart();
  const [location] = useLocation();
  const [search, setSearch] = useState("");

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    if (search.trim()) {
      window.location.href = `/restaurants?search=${encodeURIComponent(search)}`;
    }
  }

  return (
    <nav className="sticky top-0 z-50 bg-white border-b border-border shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center gap-4 h-16">
          {/* Logo */}
          <Link href="/" className="flex-shrink-0">
            <span className="text-2xl font-extrabold text-primary tracking-tight">foodie</span>
          </Link>

          {/* Location */}
          <button className="hidden md:flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors border-b-2 border-primary pb-0.5 flex-shrink-0">
            <FiMapPin className="w-3.5 h-3.5 text-primary" />
            <span className="font-medium">Bengaluru</span>
            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>

          {/* Search */}
          <form onSubmit={handleSearch} className="flex-1 max-w-lg hidden md:block">
            <div className="relative">
              <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <input
                type="search"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search for restaurants or dishes..."
                className="w-full pl-9 pr-4 py-2.5 text-sm bg-muted rounded-xl border border-transparent focus:border-primary focus:bg-white focus:outline-none transition-all"
              />
            </div>
          </form>

          <div className="ml-auto flex items-center gap-2">
            {/* Orders */}
            <Link
              href="/orders"
              className={`hidden md:flex items-center gap-1.5 px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                location.startsWith("/orders")
                  ? "text-primary bg-secondary"
                  : "text-foreground hover:bg-muted"
              }`}
            >
              <FiList className="w-4 h-4" />
              Orders
            </Link>

            {/* Cart */}
            <Link
              href="/cart"
              className={`relative flex items-center gap-1.5 px-4 py-2 text-sm font-semibold rounded-lg transition-colors ${
                location === "/cart"
                  ? "bg-primary text-white"
                  : "bg-primary text-white hover:bg-primary/90"
              }`}
            >
              <FiShoppingCart className="w-4 h-4" />
              <span className="hidden sm:inline">Cart</span>
              {totalItems > 0 && (
                <span className="absolute -top-1.5 -right-1.5 bg-yellow-400 text-yellow-900 text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center">
                  {totalItems}
                </span>
              )}
            </Link>
          </div>
        </div>

        {/* Mobile search */}
        <div className="md:hidden pb-3">
          <form onSubmit={handleSearch}>
            <div className="relative">
              <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <input
                type="search"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search restaurants or dishes..."
                className="w-full pl-9 pr-4 py-2.5 text-sm bg-muted rounded-xl border border-transparent focus:border-primary focus:bg-white focus:outline-none transition-all"
              />
            </div>
          </form>
        </div>
      </div>
    </nav>
  );
}

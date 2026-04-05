import { Router, type IRouter } from "express";
import { eq, ilike, sql } from "drizzle-orm";
import { db, restaurantsTable, menuItemsTable } from "@workspace/db";
import {
  ListRestaurantsQueryParams,
  ListRestaurantsResponse,
  GetRestaurantParams,
  GetRestaurantResponse,
  GetFeaturedRestaurantsResponse,
  GetRestaurantStatsResponse,
  GetRestaurantMenuParams,
  GetRestaurantMenuQueryParams,
  GetRestaurantMenuResponse,
} from "@workspace/api-zod";

const router: IRouter = Router();

router.get("/restaurants", async (req, res): Promise<void> => {
  const query = ListRestaurantsQueryParams.safeParse(req.query);
  if (!query.success) {
    res.status(400).json({ error: query.error.message });
    return;
  }

  const { cuisine, search, sort, vegetarian } = query.data;

  let dbQuery = db.select().from(restaurantsTable).$dynamic();

  if (cuisine) {
    dbQuery = dbQuery.where(ilike(restaurantsTable.cuisine, `%${cuisine}%`));
  }
  if (search) {
    dbQuery = dbQuery.where(ilike(restaurantsTable.name, `%${search}%`));
  }
  if (vegetarian === true) {
    dbQuery = dbQuery.where(eq(restaurantsTable.isVeg, true));
  }

  const restaurants = await dbQuery;

  let sorted = restaurants;
  if (sort === "rating") {
    sorted = [...restaurants].sort((a, b) => b.rating - a.rating);
  } else if (sort === "delivery_time") {
    sorted = [...restaurants].sort((a, b) => a.deliveryTime - b.deliveryTime);
  } else if (sort === "cost") {
    sorted = [...restaurants].sort((a, b) => a.priceForTwo - b.priceForTwo);
  }

  res.json(ListRestaurantsResponse.parse(sorted));
});

router.get("/restaurants/featured", async (_req, res): Promise<void> => {
  const restaurants = await db
    .select()
    .from(restaurantsTable)
    .where(eq(restaurantsTable.isFeatured, true))
    .limit(8);
  res.json(GetFeaturedRestaurantsResponse.parse(restaurants));
});

router.get("/restaurants/stats", async (_req, res): Promise<void> => {
  const totalRestaurants = await db
    .select({ count: sql<number>`count(*)::int` })
    .from(restaurantsTable);

  const cuisines = await db
    .selectDistinct({ cuisine: restaurantsTable.cuisine })
    .from(restaurantsTable);

  const avgDelivery = await db
    .select({ avg: sql<number>`avg(delivery_time)::int` })
    .from(restaurantsTable);

  const stats = {
    totalRestaurants: totalRestaurants[0]?.count ?? 0,
    totalCuisines: cuisines.length,
    avgDeliveryTime: avgDelivery[0]?.avg ?? 30,
    totalOrders: 1289,
  };

  res.json(GetRestaurantStatsResponse.parse(stats));
});

router.get("/restaurants/:id", async (req, res): Promise<void> => {
  const params = GetRestaurantParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }

  const [restaurant] = await db
    .select()
    .from(restaurantsTable)
    .where(eq(restaurantsTable.id, params.data.id));

  if (!restaurant) {
    res.status(404).json({ error: "Restaurant not found" });
    return;
  }

  res.json(GetRestaurantResponse.parse(restaurant));
});

router.get("/restaurants/:id/menu", async (req, res): Promise<void> => {
  const params = GetRestaurantMenuParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }

  const queryParams = GetRestaurantMenuQueryParams.safeParse(req.query);

  const items = await db
    .select()
    .from(menuItemsTable)
    .where(eq(menuItemsTable.restaurantId, params.data.id));

  let filtered = items;
  if (queryParams.success && queryParams.data.category) {
    filtered = items.filter(
      (item) => item.category.toLowerCase() === queryParams.data.category!.toLowerCase()
    );
  }

  const grouped = filtered.reduce<Record<string, typeof filtered>>((acc, item) => {
    if (!acc[item.category]) acc[item.category] = [];
    acc[item.category].push(item);
    return acc;
  }, {});

  const result = Object.entries(grouped).map(([category, menuItems]) => ({
    category,
    items: menuItems,
  }));

  res.json(GetRestaurantMenuResponse.parse(result));
});

export default router;

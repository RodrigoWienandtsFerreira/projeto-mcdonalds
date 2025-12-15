import { notFound } from "next/navigation";

import { db } from "@/lib/prisma";

import RestaurantCategories from "./components/categories";
import RestaurantHeader from "./components/header";

interface RestaurantMenuPageProps {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ consumptionMethod: string }>;
}

const isConsumptionMethodValid = (consumptionMethod: string) => {
  // 1. Se não tiver nada (undefined ou vazio), retorna falso na hora
  if (!consumptionMethod) {
    return false;
  }

  // 2. Agora é seguro usar o toUpperCase()
  return ["DINE_IN", "TAKEAWAY"].includes(consumptionMethod.toUpperCase());
};
const RestaurantMenuPage = async ({
  params,
  searchParams,
}: RestaurantMenuPageProps) => {
  const { slug } = await params;
  const { consumptionMethod } = await searchParams;
  if (!isConsumptionMethodValid(consumptionMethod)) {
    return notFound();
  }
  const restaurant = await db.restaurant.findFirst({
    where: { slug },
    include: {
      menuCategories: {
        include: { products: true },
      },
    },
  });
  console.log(restaurant?.menuCategories);
  if (!restaurant) {
    return notFound();
  }
  return (
    <div>
      <RestaurantHeader restaurant={restaurant}></RestaurantHeader>
      <RestaurantCategories restaurant={restaurant} />
    </div>
  );
};
export default RestaurantMenuPage;

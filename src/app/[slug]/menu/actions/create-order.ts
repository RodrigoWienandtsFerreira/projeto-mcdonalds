"use server";
import { ConsuptionMethod } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { db } from "@/lib/prisma";

import { removeCPFPuncuation } from "../helpers/cpf";
interface createOrderInput {
  customerName: string;
  customerCPF: string;
  products: Array<{
    id: string;

    quantity: number;
  }>;
  consumptionMethod: ConsuptionMethod;
  slug: string;
}

export const createOrder = async (input: createOrderInput) => {
  const restaurant = await db.restaurant.findFirst({
    where: {
      slug: input.slug,
    },
  });
  if (!restaurant) {
    throw new Error("Restaurant not found");
  }
  const productsWithPrice = await db.product.findMany({
    where: {
      id: {
        in: input.products.map((product) => product.id),
      },
    },
  });
  const productsWithPricesAndQuantities = input.products.map((product) => ({
    productId: product.id,
    quantity: product.quantity,
    price: productsWithPrice.find((p) => p.id == product.id)!.price,
  }));

  await db.order.create({
    data: {
      status: "PENDING",
      customerName: input.customerName,
      customerCPF: removeCPFPuncuation(input.customerCPF),
      orderProducts: {
        createMany: {
          data: productsWithPricesAndQuantities,
        },
      },
      total: productsWithPricesAndQuantities.reduce(
        (acc, product) => acc + product.price * product.quantity,
        0
      ),
      consumptionMethod: input.consumptionMethod,
      restaurantId: restaurant.id,
    },
  });
  revalidatePath(`/${input.slug}/orders`);
  redirect(`/${input.slug}/orders?cpf=${removeCPFPuncuation(input.customerCPF)}`);
};

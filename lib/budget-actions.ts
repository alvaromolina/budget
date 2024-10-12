"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";
import prisma from "@/lib/prisma";
import { auth } from "@/auth";

const budgetCategorySchema = z.object({
  id: z.string().optional(),
  name: z.string().min(1),
  value: z.coerce.number().min(0),
});

const budgetFormSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(1),
  categories: z.array(budgetCategorySchema),
});

export async function createOrUpdateBudget(data: z.infer<typeof budgetFormSchema>) {
  const session = await auth();
  const userId = session?.user?.id;

  if (!userId) {
    throw new Error("User not authenticated");
  }

  const validatedFields = budgetFormSchema.safeParse(data);

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: "Invalid form data. Please check your inputs.",
    };
  }

  const { id, name, categories } = validatedFields.data;

  try {
    const budget = await prisma.budget.upsert({
      where: { id: id || "" },
      update: {
        name,
        categories: {
          deleteMany: {},
          create: categories.map(({ id, ...category }) => category),
        },
      },
      create: {
        name,
        userId,
        categories: {
          create: categories,
        },
      },
    });

    revalidatePath("/app/budget");
    return { success: true, budget };
  } catch (error) {
    console.error("Failed to save budget:", error);
    return {
      message: "Database Error: Failed to save budget.",
    };
  }
}
import { auth } from '@/auth';
import prisma from "@/lib/prisma";
import { BudgetForm } from "@/components/ui/budget/budget-form";
import { BudgetPieChart } from "@/components/ui/budget/budget-pie-chart";
import { PageHeader, PageHeaderDescription, PageHeaderHeading } from "@/components/page-header";

export default async function BudgetPage() {
  const session = await auth();
  const userId = session?.user?.id;

  const budget = await prisma.budget.findFirst({
    where: { userId },
    include: { categories: true },
  });

  const formattedBudget = budget ? {
    ...budget,
    categories: budget.categories.map(category => ({
      ...category,
      value: Number(category.value)
    }))
  } : undefined;

  const formattedCategories = budget?.categories.map(category => ({
    name: category.name,
    value: Number(category.value)
  })) || [];

  return (
    <>
      <PageHeader>
        <PageHeaderHeading>Presupuesto {formattedBudget?.id}</PageHeaderHeading>
        <PageHeaderDescription>
          Administra tus categorías y asignaciones de presupuesto
        </PageHeaderDescription>
      </PageHeader>
      <div className="grid gap-4 md:grid-cols-2">
        <BudgetForm budget={formattedBudget} />
        <BudgetPieChart categories={formattedCategories} />
      </div>
    </>
  );
}

"use client";

import { useState } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { createOrUpdateBudget } from "@/lib/budget-actions";

// Define the type for a budget category
type BudgetCategory = {
  id?: string;
  name: string;
  value: number;
};

// Define the type for the entire budget
type Budget = {
  id?: string;
  name: string;
  categories: BudgetCategory[];
};

const budgetFormSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(1, "El nombre del presupuesto es requerido"),
  categories: z.array(z.object({
    id: z.string().optional(),
    name: z.string().min(1, "El nombre de la categoría es requerido"),
    value: z.coerce.number().min(0, "El valor debe ser un número positivo"),
  })),
});

export function BudgetForm({ budget }: { budget?: Budget }) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm({
    resolver: zodResolver(budgetFormSchema),
    defaultValues: budget || { name: "", categories: [{ name: "", value: 0 }] },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "categories",
  });

  const onSubmit = async (data: z.infer<typeof budgetFormSchema>) => {
    setIsSubmitting(true);
    await createOrUpdateBudget(data);
    setIsSubmitting(false);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nombre del presupuesto</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {fields.map((field, index) => (
          <div key={field.id} className="flex items-end space-x-2">
            <FormField
              control={form.control}
              name={`categories.${index}.name`}
              render={({ field }) => (
                <FormItem className="flex-grow">
                  <FormLabel>Categoría</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name={`categories.${index}.value`}
              render={({ field }) => (
                <FormItem className="flex-grow">
                  <FormLabel>Valor</FormLabel>
                  <FormControl>
                    <Input {...field} type="number" min="0" step="0.01" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="button" variant="destructive" onClick={() => remove(index)}>
              Eliminar
            </Button>
          </div>
        ))}

        <div className="flex space-x-4">
          <Button type="button" onClick={() => append({ name: "", value: 0 })}>
            Agregar categoría
          </Button>

          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Guardando..." : "Guardar presupuesto"}
          </Button>
        </div>
      </form>
    </Form>
  );
}

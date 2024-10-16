// components/TransactionForm.js
'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { TransactionSchema   } from '@/prisma/zod-extended';


import { createTransaction, updateTransaction } from '@/lib/transaction-actions';
import { useState } from 'react';
import { useRouter } from 'next/navigation'
import { Prisma,  MoneyAccount, Transaction, BudgetCategory } from '@prisma/client';

import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { toast } from '@/components/ui/use-toast';
import { Calendar } from '@/components/ui/calendar';
import { format } from 'date-fns';

export function TransactionForm({
  accountId,
  budgetCategories,
  transaction,
}: {
  accountId: String;
  budgetCategories: BudgetCategory[];
  transaction?: Transaction;
}) {




  const FormSchema = TransactionSchema.partial().merge(
    TransactionSchema.omit({
      id: true,
      createdAt: true,
      updatedAt: true,
    }),
  );
  const router = useRouter();

  type TransactionFormValues = z.infer<typeof FormSchema>;
  const defaultValues: Partial<TransactionFormValues> = transaction ? transaction : {
    value: 0,
    dateTransaction: new Date(),
    accountId: accountId.toString(),
    budgetCategoryId: null,
    description: null,
    reference: null,
    additionalReference: null
  };

  const form = useForm<TransactionFormValues>({
    resolver: zodResolver(FormSchema),
    defaultValues,
  });


  const [errorMessage, setErrorMessage] = useState('');


  async function onSubmit(data: TransactionFormValues) {
    const response = transaction ? await updateTransaction(data) : await createTransaction(data);
    if (response?.message) {
      setErrorMessage(response.message);
    } else {
      toast({
        title: 'Transaction saved',
        description: `Transaction ${transaction ? 'updated' : 'created'} successfully.`,
      });
    }
  }



  const handleCancel = () => {
    router.back(); // Navigate back to the previous page
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-6'>
        <FormField
          control={form.control}
          name='dateTransaction'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Date of Transaction</FormLabel>
              <FormControl>
                <Input
                  type='date'
                  value={format(new Date(field.value || Date.now()), 'yyyy-MM-dd')}
                  onChange={(e) => field.onChange(new Date(e.target.value).toISOString())}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name='value'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Amount</FormLabel>
              <FormControl>
                <Input 
                  type='number'
                  step='0.01'
                  placeholder='0.00'
                  {...field}
                  value={field.value ? field.value.toString() : ''} // Convert value to string
                  onChange={(e) => field.onChange(parseFloat(e.target.value))} // Ensure onChange parses the string to a float
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />


        <FormField
          control={form.control}
          name='budgetCategoryId'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Budget Category</FormLabel>
              <Select 
                onValueChange={field.onChange}
                defaultValue={field.value ?? undefined}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder='Select a budget category' />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {budgetCategories.map((category) => (
                    <SelectItem key={category.id} value={category.id}>
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name='description'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Input 
                    placeholder='Description of the transaction'
                    {...field}
                    value={field.value ?? ''} 
                  />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <p className='text-sm font-medium text-destructive'>{errorMessage}</p>
        <p className='text-sm font-medium text-destructive'>{errorMessage}</p>

        <div className='flex space-x-4'>
          <Button type="submit">Submit</Button>
          <Button type='button' variant='outline' onClick={handleCancel}>
              Cancel
            </Button>
        </div>
      </form>
    </Form>
  );
}
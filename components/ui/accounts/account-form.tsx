"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { MoneyAccountSchema } from "@/prisma/generated/zod"
import { createAccount, updateAccount } from '@/lib/account-actions';
import { Bank, MoneyAccount, AccountType, TransactionType } from "@prisma/client"
import {useState} from "react"
import { useRouter } from 'next/navigation'


import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { toast } from "@/components/ui/use-toast"
import { Input } from "@/components/ui/input"



export function AccountForm({ accountTypes, banks, account }: { accountTypes: AccountType[], banks: Bank[] , account?: MoneyAccount} ) {


  const FormSchema = MoneyAccountSchema.partial().merge(MoneyAccountSchema.omit({ id: true, createdAt: true, updatedAt: true, userId: true, balance: true}));

  const router = useRouter();

  if (account){
    delete (account as Partial<MoneyAccount>)['balance']
  }
  type AccountFormValues = z.infer<typeof FormSchema>
  const defaultValues: Partial<AccountFormValues> = account ? account :  {
    name: "",
    bankId: null,
    accountType: AccountType.ASSET,
  };

  const form = useForm<AccountFormValues>({
    resolver: zodResolver(FormSchema),
    defaultValues
  });

  console.log(form)

  const [errorMessage, setErrorMessage] = useState("");

  async function  onSubmit(data: any) {
    console.log(1);

    console.log(data);
    const response = account ? await updateAccount(data) : await createAccount(data);
    console.log(response)

    if (response?.message){
      setErrorMessage(response?.message)
      console.log(errorMessage)

    }
  }


  const handleCancel = () => {
    router.back(); // Navigate back to the previous page
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="w-2/3 space-y-6">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input placeholder="Account name" {...field} />
              </FormControl>
              <FormDescription>
                Name of the account
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="bankId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Banco</FormLabel>
              <Select  
                onValueChange={field.onChange}
                defaultValue={field.value ?? undefined} 
                >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a bank" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                {banks.map((bank) => (
                  <SelectItem key={bank.id} value={bank.id}>{bank.name}</SelectItem>
                ))}
                </SelectContent>
              </Select>
              <FormDescription>
                Select a bank
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="accountType"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Account Type</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a account type" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                {accountTypes.map((accountType) => (
                  <SelectItem key={accountType} value={accountType}>{accountType}</SelectItem>
                ))}
                </SelectContent>
              </Select>
              <FormDescription>
                You can select the account type
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
          <p
            className="text-sm font-medium text-destructive"
          >
            {errorMessage}
          </p>
        <p></p>

        <div className='flex space-x-4'>
          <Button type="submit">Submit</Button>
          <Button type='button' variant='outline' onClick={handleCancel}>
              Cancel
            </Button>
        </div>

      </form>
    </Form>
  )
}

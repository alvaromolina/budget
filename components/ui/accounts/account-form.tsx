"use client"

import Link from "next/link"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { AccountSchema } from "@/prisma/generated/zod"
import { createAccount, updateAccount } from '@/lib/account-actions';
import { Bank, Account } from "@prisma/client"
import {useState} from "react"

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



export function AccountForm({ banks, account }: { banks: Bank[] , account?: Account} ) {

  const CreateFormSchema = AccountSchema.omit({ id: true, createdAt: true, updatedAt: true, userId: true});
  const UpdateFormSchema = AccountSchema.omit({ updatedAt: true});
  type CreateAccountFormValues = z.infer<typeof CreateFormSchema>
  type UpdateAccountFormValues = z.infer<typeof UpdateFormSchema>
  const defaultValuesCreate: Partial<CreateAccountFormValues> =   {}
  const defaultValuesUpdate: Partial<UpdateAccountFormValues> =   account ? account : {}
  const defaultValues: Partial<UpdateAccountFormValues> =  account ? defaultValuesUpdate : defaultValuesCreate
  const formCreate = useForm<CreateAccountFormValues>({
    resolver: zodResolver(CreateFormSchema),
    defaultValues
  });
  const formUpdate = useForm<UpdateAccountFormValues>({
    resolver: zodResolver(UpdateFormSchema),
    defaultValues
  });
  const form = account ? formUpdate : formCreate
  const [errorMessage, setErrorMessage] = useState("");
  
  async function  onSubmitUpdate(data: UpdateAccountFormValues) {
    const response = await updateAccount(data);
    console.log(response)
    if (response?.message){
      setErrorMessage(response?.message)
      console.log(errorMessage)

    }
  }
  async function  onSubmitCreate(data: CreateAccountFormValues) {
    const response = await createAccount(data);
    console.log(response)
    if (response?.message){
      setErrorMessage(response?.message)
      console.log(errorMessage)

    }
  }
  const onSubmit = !account?  onSubmitCreate : onSubmitUpdate

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="w-2/3 space-y-6">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a verified email to display" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="m@example.com">m@example.com</SelectItem>
                  <SelectItem value="m@google.com">m@google.com</SelectItem>
                  <SelectItem value="m@support.com">m@support.com</SelectItem>
                </SelectContent>
              </Select>
              <FormDescription>
                You can manage email addresses in your{" "}
                <Link href="/examples/forms">email settings</Link>.
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
              <FormLabel>Name</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a verified email to display" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                {banks.map((bank) => (
                  <SelectItem key={bank.id} value={bank.id}>{bank.name}</SelectItem>
                ))}
                </SelectContent>
              </Select>
              <FormDescription>
                You can manage email addresses in your{" "}
                <Link href="/examples/forms">email settings</Link>.
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
              <FormLabel>Name</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a verified email to display" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="CASH">CASH</SelectItem>
                  <SelectItem value="m@google.com">m@google.com</SelectItem>
                  <SelectItem value="m@support.com">m@support.com</SelectItem>
                </SelectContent>
              </Select>
              <FormDescription>
                You can manage email addresses in your{" "}
                <Link href="/examples/forms">email settings</Link>.
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
        <Button type="submit">Submit</Button>
      </form>
    </Form>
  )
}

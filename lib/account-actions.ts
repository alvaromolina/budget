'use server';

import { z } from 'zod';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import prisma from "@/lib/prisma";
import { MoneyAccountSchema } from "@/prisma/generated/zod";
import { auth } from '@/auth';

 
const FormSchema = MoneyAccountSchema.partial().merge(MoneyAccountSchema.omit({ id: true, createdAt: true, updatedAt: true, userId: true, balance: true}));


export async function createAccount(data: z.infer<typeof FormSchema>) {
    const session = await auth();
    const userId = session?.user?.id;
    const validatedFields = FormSchema.safeParse(data);
    if (!validatedFields.success) {
        return {
        errors: validatedFields.error.flatten().fieldErrors,
        message: 'Missing Fields. Failed to Create Account.',
        };
    }
    const { name,  accountType, bankId } = validatedFields.data;

    try{
        const account = await prisma.moneyAccount.create({ 
            data: {
                userId,
                name,
                accountType,
                bankId
            }
        })
    }
    catch(error){
        console.log(error)
        return {
            message: 'Database Error: Failed to Create Account.',
        };
    }
    revalidatePath('/app/accounts');
    redirect('/app/accounts');
}


export async function updateAccount(data: z.infer<typeof FormSchema>) {
    const validatedFields = FormSchema.safeParse(data);
    if (!validatedFields.success) {
        return {
        errors: validatedFields.error.flatten().fieldErrors,
        message: 'Missing Fields. Failed to Update Account.',
        };
    }
    const { id, name, accountType, bankId } = validatedFields.data;
    try{
        const account = await prisma.moneyAccount.update({ 
            where: {
                id,
              },
            data: {
                name,
                accountType,
                bankId
            }
        })
    }
    catch(error){
        return {
            message: 'Database Error: Failed to Update Account.',
        };
    }
    revalidatePath('/app/accounts');
    redirect('/app/accounts');
}

export async function deleteAccount(id: string) {
    const deleteAccount = await prisma.moneyAccount.delete({
        where: {
            id: id,
        },
    })
    revalidatePath('/app/accounts');
}


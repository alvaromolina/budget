'use server';

import { z } from 'zod';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import prisma from "@/lib/prisma";
import { Prisma } from '@prisma/client';

import { TransactionSchema   } from '@/prisma/zod-extended';
import { auth } from '@/auth';

const FormSchema = TransactionSchema.partial().merge(TransactionSchema.omit({ id: true, createdAt: true, updatedAt: true}));

export async function createTransaction(data: z.infer<typeof FormSchema>) {
    const session = await auth();
    const userId = session?.user?.id;

    //data.value = new Prisma.Decimal(data.value);
    const validatedFields = FormSchema.safeParse(data);

    if (!validatedFields.success) {

        console.log(validatedFields.error.flatten().fieldErrors);

        return {
        errors: validatedFields.error.flatten().fieldErrors,
        message: 'Missing Fields. Failed to Create Transaction.',
        };
    }
    const { transactionType, value, dateTransaction, accountId, budgetLabelId, description, reference, additionalReference } = validatedFields.data;
    try{
        const transaction = await prisma.transaction.create({ 
            data: {
                transactionType,
                value,
                dateTransaction,
                accountId,
                budgetLabelId,
                description,
                reference,
                additionalReference
            }
        })
    }
    catch(error){
        console.log(error);
        return {
            message: 'Database Error: Failed to Create Transaction.',
        };
    }
    revalidatePath('/app/accounts/'+String(accountId)+'/transactions');
    redirect('/app/accounts/'+String(accountId)+'/transactions');
}

export async function updateTransaction(data: z.infer<typeof FormSchema>) {
    const validatedFields = FormSchema.safeParse(data);
    if (!validatedFields.success) {
        return {
        errors: validatedFields.error.flatten().fieldErrors,
        message: 'Missing Fields. Failed to Update Transaction.',
        };
    }
    const { id, transactionType, value, dateTransaction, accountId, budgetLabelId, description, reference, additionalReference } = validatedFields.data;
    try{
        const transaction = await prisma.transaction.update({ 
            where: {
                id,
              },
            data: {
                transactionType,
                value,
                dateTransaction,
                accountId,
                budgetLabelId,
                description,
                reference,
                additionalReference
            }
        })
    }
    catch(error){
        return {
            message: 'Database Error: Failed to Update Transaction.',
        };
    }
    revalidatePath('/app/transactions');
    redirect('/app/transactions');
}

export async function deleteTransaction(id: string) {
    const deleteTransaction = await prisma.transaction.delete({
        where: {
            id: id,
        },
    })
    revalidatePath('/app/transactions');
}
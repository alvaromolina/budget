'use server';

import { z } from 'zod';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import prisma from "@/lib/prisma";
import { Prisma} from '@prisma/client';


import { TransactionSchema   } from '@/prisma/zod-extended';

const FormSchema = TransactionSchema.partial().merge(TransactionSchema.omit({ id: true, createdAt: true, updatedAt: true}));

export async function createTransaction(data: z.infer<typeof FormSchema>) {
    const validatedFields = FormSchema.safeParse(data);
    if (!validatedFields.success) {
        return {
            errors: validatedFields.error.flatten().fieldErrors,
            message: 'Missing Fields. Failed to Create Transaction.',
        };
    }

    const { transactionType, value, dateTransaction, accountId, budgetLabelId, description, reference, additionalReference } = validatedFields.data;

    try {
        const result = await prisma.$transaction(async (prisma) => {
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
                },
            });

            const accountUpdate = await prisma.moneyAccount.update({
                where: { id: accountId },
                data: {
                    balance: {
                        increment: transactionType === 'CREDIT' ? value : -value
                    }
                }
            });

            return transaction;
        });
    } catch (error) {
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

    try {
        const result = await prisma.$transaction(async (prisma) => {
            const existingTransaction = await prisma.transaction.findUnique({
                where: { id },
                select: { value: true, transactionType: true }
            });

            if (!existingTransaction) {
                throw new Error("Transaction not found");
            }

            const transaction = await prisma.transaction.update({
                where: { id },
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
            });

            const balanceAdjustment = new Prisma.Decimal(value.toString()).minus(existingTransaction.value);
            const accountUpdate = await prisma.moneyAccount.update({
                where: { id: accountId },
                data: {
                    balance: {
                        increment: transactionType === 'CREDIT' ? balanceAdjustment : -balanceAdjustment
                    }
                }
            });

            return transaction;
        });
    } catch (error) {
        return {
            message: 'Database Error: Failed to Update Transaction.',
        };
    }

    revalidatePath('/app/accounts/'+String(accountId)+'/transactions');
    redirect('/app/accounts/'+String(accountId)+'/transactions');
}

export async function deleteTransaction(id: string) {

    const transaction = await prisma.transaction.findUnique({
        where: { id },
        select: { value: true, transactionType: true, accountId: true }
    });

    try {
        const result = await prisma.$transaction(async (prisma) => {
            const transaction = await prisma.transaction.findUnique({
                where: { id },
                select: { value: true, transactionType: true, accountId: true }
            });

            if (!transaction) {
                throw new Error("Transaction not found");
            }

            await prisma.transaction.delete({
                where: { id },
            });

            await prisma.moneyAccount.update({
                where: { id: transaction.accountId },
                data: {
                    balance: {
                        decrement: transaction.transactionType === 'CREDIT' ? transaction.value : -transaction.value
                    }
                }
            });
        });
    } catch (error) {
        return {
            message: 'Database Error: Failed to Delete Transaction.',
        };
    }

    revalidatePath('/app/accounts/'+String(transaction?.accountId)+'/transactions');
}
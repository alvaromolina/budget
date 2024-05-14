'use server';

import { z } from 'zod';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import prisma from "@/lib/prisma";
import { Prisma} from '@prisma/client';
import { auth } from '@/auth';


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

    const { value, dateTransaction, accountId, budgetLabelId, description, reference, additionalReference } = validatedFields.data;

    try {
        const result = await prisma.$transaction(async (prisma) => {
            const transaction = await prisma.transaction.create({
                data: {
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
                        increment: value
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

    const { id, value, dateTransaction, accountId, budgetLabelId, description, reference, additionalReference } = validatedFields.data;

    try {
        const result = await prisma.$transaction(async (prisma) => {
            const existingTransaction = await prisma.transaction.findUnique({
                where: { id },
                select: { value: true }
            });

            if (!existingTransaction) {
                throw new Error("Transaction not found");
            }

            const transaction = await prisma.transaction.update({
                where: { id },
                data: {
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
                        increment:  balanceAdjustment 
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
        select: { value: true,  accountId: true }
    });

    try {
        const result = await prisma.$transaction(async (prisma) => {
            const transaction = await prisma.transaction.findUnique({
                where: { id },
                select: { value: true, accountId: true }
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
                        decrement: transaction.value
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

export interface BalanceDetails {
    year: number;
    month: number;
    runningbalance: number;
    monthlychange: number;
    transactionType: string;
}

export async function getMonthlyBalances(): Promise<Array<BalanceDetails>>{

    const session = await auth();
    const userId = session?.user?.id;
    const sqlQuery = `
    WITH DateSeries AS (
        SELECT generate_series(MIN(DATE_TRUNC('month', "dateTransaction")), MAX(DATE_TRUNC('month', "dateTransaction")), interval '1 month') AS Month,
        'CREDIT' as "transactionType"
        FROM Transactions
        JOIN money_accounts ON Transactions."accountId" = money_accounts.id
        WHERE money_accounts."userId" = $1
        UNION
        SELECT generate_series(MIN(DATE_TRUNC('month', "dateTransaction")), MAX(DATE_TRUNC('month', "dateTransaction")), interval '1 month') AS Month,
        'DEBIT' as "transactionType"
        FROM Transactions
        JOIN money_accounts ON Transactions."accountId" = money_accounts.id
        WHERE money_accounts."userId" = $1
    ),
    MonthlyTransactions AS (
        SELECT
            DATE_TRUNC('year', "dateTransaction") as Year,
            DATE_TRUNC('month', "dateTransaction") as Month,
            SUM(value) as MonthlyChange,
            'CREDIT' as "transactionType"
        FROM Transactions
        JOIN money_accounts ON Transactions."accountId" = money_accounts.id
        WHERE Transactions.value > 0
        AND money_accounts."userId" = $1
        GROUP BY DATE_TRUNC('year', "dateTransaction"), DATE_TRUNC('month', "dateTransaction")
        UNION 
        SELECT
        DATE_TRUNC('year', "dateTransaction") as Year,
        DATE_TRUNC('month', "dateTransaction") as Month,
        SUM(value) as MonthlyChange,
        'DEBIT' as "transactionType"
        FROM Transactions
        JOIN money_accounts ON Transactions."accountId" = money_accounts.id
        WHERE Transactions.value < 0
        AND money_accounts."userId" = $1
        GROUP BY DATE_TRUNC('year', "dateTransaction"), DATE_TRUNC('month', "dateTransaction")
    )
    SELECT
        EXTRACT(YEAR FROM ds.Month) as Year,
        EXTRACT(MONTH FROM ds.Month) as Month,
        COALESCE(mt.MonthlyChange, 0) as MonthlyChange,
    SUM(COALESCE(mt.MonthlyChange, 0)) OVER (
        PARTITION BY ds."transactionType"
        ORDER BY EXTRACT(YEAR FROM ds.Month), EXTRACT(MONTH FROM ds.Month)
    ) as RunningBalance,
    ds."transactionType"    
    FROM DateSeries ds
    LEFT JOIN MonthlyTransactions mt ON ds.Month = mt.Month and ds."transactionType" = mt."transactionType"
    ORDER BY Year, Month;
    `;
  


  
    return await prisma.$queryRawUnsafe(sqlQuery, userId);
  }

'use server';

import { z } from 'zod';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import prisma from "@/lib/prisma";
import { AccountSchema } from "@/prisma/generated/zod";
import { auth } from '@/auth';

 
const CreateAccount = AccountSchema.omit({ id: true, createdAt: true, updatedAt: true,  userId: true});

const UpdateInvoice = AccountSchema.omit({ id: true, createdAt: true, updatedAt: true });



export async function createAccount(data: z.infer<typeof CreateAccount>) {
    const session = await auth();
    const userId = session?.user?.id;

    const validatedFields = CreateAccount.safeParse(data);
    // If form validation fails, return errors early. Otherwise, continue.
    if (!validatedFields.success) {
        return {
        errors: validatedFields.error.flatten().fieldErrors,
        message: 'Missing Fields. Failed to Create Account.',
        };
    }
    // Prepare data for insertion into the database
    const { name,  accountType, bankId } = validatedFields.data;

    try{
        const account = await prisma.account.create({ data: {
            userId: userId,
            name: name,
            accountType: accountType,
            bankId: bankId
        }
        })
    }
    catch(error){
        return {
            message: 'Database Error: Failed to Create Account.',
        };
    }
    revalidatePath('/app/accounts');
    redirect('/app/accounts');
}
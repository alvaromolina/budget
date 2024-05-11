import { z } from 'zod';
import { Prisma } from '@prisma/client';

/////////////////////////////////////////
// HELPER FUNCTIONS
/////////////////////////////////////////

// DECIMAL
//------------------------------------------------------

export const DecimalJsLikeSchema: z.ZodType<Prisma.DecimalJsLike> = z.object({
  d: z.array(z.number()),
  e: z.number(),
  s: z.number(),
  toFixed: z.function(z.tuple([]), z.string()),
})

export const DECIMAL_STRING_REGEX = /^(?:-?Infinity|NaN|-?(?:0[bB][01]+(?:\.[01]+)?(?:[pP][-+]?\d+)?|0[oO][0-7]+(?:\.[0-7]+)?(?:[pP][-+]?\d+)?|0[xX][\da-fA-F]+(?:\.[\da-fA-F]+)?(?:[pP][-+]?\d+)?|(?:\d+|\d*\.\d+)(?:[eE][-+]?\d+)?))$/;

export const isValidDecimalInput =
  (v?: null | string | number | Prisma.DecimalJsLike): v is string | number | Prisma.DecimalJsLike => {
    if (v === undefined || v === null) return false;
    return (
      (typeof v === 'object' && 'd' in v && 'e' in v && 's' in v && 'toFixed' in v) ||
      (typeof v === 'string' && DECIMAL_STRING_REGEX.test(v)) ||
      typeof v === 'number'
    )
  };

/////////////////////////////////////////
// ENUMS
/////////////////////////////////////////

export const TransactionIsolationLevelSchema = z.enum(['ReadUncommitted','ReadCommitted','RepeatableRead','Serializable']);

export const UserScalarFieldEnumSchema = z.enum(['id','name','email','password','createdAt','updatedAt']);

export const BankScalarFieldEnumSchema = z.enum(['id','name','createdAt','updatedAt']);

export const MoneyAccountScalarFieldEnumSchema = z.enum(['id','name','accountType','userId','bankId','balance','createdAt','updatedAt']);

export const BudgetLabelScalarFieldEnumSchema = z.enum(['id','name','transactionType']);

export const TransactionScalarFieldEnumSchema = z.enum(['id','value','dateTransaction','transactionType','accountId','budgetLabelId','description','reference','additionalReference','createdAt','updatedAt']);

export const SortOrderSchema = z.enum(['asc','desc']);

export const QueryModeSchema = z.enum(['default','insensitive']);

export const NullsOrderSchema = z.enum(['first','last']);

export const TransactionTypeSchema = z.enum(['CREDIT','DEBIT']);

export type TransactionTypeType = `${z.infer<typeof TransactionTypeSchema>}`

export const AccountTypeSchema = z.enum(['BANK','CASH','ASSET','DEBT','INVESTMENT']);

export type AccountTypeType = `${z.infer<typeof AccountTypeSchema>}`

/////////////////////////////////////////
// MODELS
/////////////////////////////////////////

/////////////////////////////////////////
// USER SCHEMA
/////////////////////////////////////////

export const UserSchema = z.object({
  id: z.string().cuid(),
  name: z.string().nullable(),
  email: z.string().nullable(),
  password: z.string(),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
})

export type User = z.infer<typeof UserSchema>

/////////////////////////////////////////
// BANK SCHEMA
/////////////////////////////////////////

export const BankSchema = z.object({
  id: z.string().cuid(),
  name: z.string(),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
})

export type Bank = z.infer<typeof BankSchema>

/////////////////////////////////////////
// MONEY ACCOUNT SCHEMA
/////////////////////////////////////////

export const MoneyAccountSchema = z.object({
  accountType: AccountTypeSchema,
  id: z.string().cuid(),
  name: z.string(),
  userId: z.string(),
  bankId: z.string().nullable(),
  balance: z.instanceof(Prisma.Decimal, { message: "Field 'balance' must be a Decimal. Location: ['Models', 'MoneyAccount']"}).nullable(),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
})

export type MoneyAccount = z.infer<typeof MoneyAccountSchema>

/////////////////////////////////////////
// BUDGET LABEL SCHEMA
/////////////////////////////////////////

export const BudgetLabelSchema = z.object({
  transactionType: TransactionTypeSchema,
  id: z.string().cuid(),
  name: z.string(),
})

export type BudgetLabel = z.infer<typeof BudgetLabelSchema>

/////////////////////////////////////////
// TRANSACTION SCHEMA
/////////////////////////////////////////

export const TransactionSchema = z.object({
  transactionType: TransactionTypeSchema,
  id: z.string().cuid(),
  value: z.instanceof(Prisma.Decimal, { message: "Field 'value' must be a Decimal. Location: ['Models', 'Transaction']"}),
  dateTransaction: z.coerce.date(),
  accountId: z.string(),
  budgetLabelId: z.string().nullable(),
  description: z.string().nullable(),
  reference: z.string().nullable(),
  additionalReference: z.string().nullable(),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
})

export type Transaction = z.infer<typeof TransactionSchema>

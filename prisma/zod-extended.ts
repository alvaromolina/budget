import { z } from 'zod';
import { isValidDecimalInput, DecimalJsLikeSchema, TransactionSchema as GeneratedTransactionSchema } from '@/prisma/generated/zod';

import { Prisma} from '@prisma/client';


export const TransactionSchema = GeneratedTransactionSchema.extend({
    value: z
    .union([
      z.number(),
      z.string(),
      z.instanceof(Prisma.Decimal),
      DecimalJsLikeSchema,
    ])
    .refine((v) => isValidDecimalInput(v), {
      message: 'Must be a Decimal',
    }),
  });
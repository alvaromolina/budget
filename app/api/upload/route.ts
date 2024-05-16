import { writeFile } from 'fs/promises'
import { NextRequest, NextResponse } from 'next/server'
import * as xlsx from 'xlsx';
import prisma from "@/lib/prisma";
import { createTransaction } from '@/lib/transaction-actions';
import { TransactionSchema   } from '@/prisma/zod-extended';
import { z } from 'zod';


export async function POST(request: NextRequest) {



    try {
        const data = await request.formData()
        const accountId = request.nextUrl.searchParams.get('accountId') as string;

        const file: File | null = data.get('file') as unknown as File
    
        if (!file) {
        return NextResponse.json({ success: false })
        }
    
        const bytes = await file.arrayBuffer()
        const buffer = Buffer.from(bytes)


        const workbook = xlsx.read(buffer, { type: 'buffer' });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];

        const jsonData: any[][] = xlsx.utils.sheet_to_json(worksheet, { defval: "", header: 1 });
        let dataRows = jsonData.slice(2);

        type RowObject = {
            fecha: string;
            hora: string;
            descripcion: string;
            referencia: string;
            adicionales: string;
            debitos: string | number;
            creditos: string | number;
          };
      
        const requiredColumns: (keyof RowObject)[] = [
            'fecha',
            'hora',
            'descripcion',
            'referencia',
            'adicionales',
            'debitos',
            'creditos',
          ];
        dataRows = dataRows.filter((row) =>  row[0] !== '');
        console.log(dataRows)
        for (const row of dataRows) {
          const rowObject: RowObject = {
            fecha: row[0],
            hora: row[1],
            descripcion: row[3],
            referencia: row[4],
            adicionales: row[10],
            debitos: row[7],
            creditos: row[8],
          };

    
          for (const col of requiredColumns) {
            if (!rowObject[col] && col !== 'debitos' && col !== 'creditos') {
              return NextResponse.json({ success: false })
            }
          }
    
          // Concatenate fecha and hora and parse into a Date object
          const dateTimeString = `${rowObject.fecha} ${rowObject.hora}`;
          const [day, month, year] = rowObject.fecha.split('/');
          const [hours, minutes, seconds] = rowObject.hora.split(':');
          const parsedDate = new Date(
            Number(year),
            Number(month) - 1,
            Number(day),
            Number(hours),
            Number(minutes),
            Number(seconds)
          );
    
          if (isNaN(parsedDate.getTime())) {
              return NextResponse.json({ success: false })
          }
    
          // Determine the value to use
          const creditValue = rowObject.creditos ? parseFloat((rowObject.creditos as string).replace(/,/g, '')) : 0;
          const debitValue = rowObject.debitos ? parseFloat((rowObject.debitos as string).replace(/,/g, '')) : 0;
    
          // Determine the value to use
          const value = creditValue !== 0 ? creditValue : -debitValue;
          
          const transactionData = {
            value: value,
            dateTransaction: parsedDate,
            accountId: accountId,
            budgetLabelId: null,
            description: rowObject.descripcion,
            reference: rowObject.referencia,
            additionalReference: rowObject.adicionales,
          };

          const result = await prisma.$transaction(async (prisma) => {
            const transaction = await prisma.transaction.create({
                data: transactionData,
            });

            const accountUpdate = await prisma.moneyAccount.update({
                where: { id: accountId },
                data: {
                    balance: {
                        increment: value
                    }
                }
            });

          });
    
        }
        return NextResponse.json({ success: true })

        // With the file data in the buffer, you can do whatever you want with it.
        // For this, we'll just write it to the filesystem in a new location
        /*const path = `/tmp/${file.name}`
        await writeFile(path, buffer)
        console.log(`open ${path} to see the uploaded file`)*/
  
    } catch (error) {
        console.log(error)

        return NextResponse.json({ success: false })
    }
  }
"use client"

import { CircularProgressbar } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';

const percentage = 66;




export function BudgetTotal() {
  return (
    <CircularProgressbar value={percentage} text={`${percentage}%`} />
  )
}
"use client"

import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip, Legend, CartesianGrid} from "recharts"


export function NetworthActivePasive(data: any) {

  return (
    <ResponsiveContainer width="100%" height={350}>

    
      <BarChart data={data.data} stackOffset="sign">
        <XAxis
          dataKey="name"
          stroke="#888888"
          fontSize={12}
          tickLine={false}
          axisLine={false}
        />
        <YAxis />
        <Tooltip />
        <Legend />
        <Bar dataKey="credit" stackId="a" fill="#8884d8" />
        <Bar dataKey="debit" stackId="a" fill="#82ca9d" />
      </BarChart>
    </ResponsiveContainer>
  )
}
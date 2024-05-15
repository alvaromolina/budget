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
        <YAxis 
          stroke="#888888"
          fontSize={12}
          tickLine={false}
          axisLine={false}
          tickFormatter={(value) => `$${value.toLocaleString()}`}/>
        <Tooltip />
        <Bar dataKey="active"  stackId="a" fill="#1E90FF" radius={[4, 4, 0, 0]}/>
        <Bar dataKey="pasive"  stackId="a" fill="#FF6347" radius={[4, 4, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  )
}
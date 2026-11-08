'use client'

import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'

/**
 * Hourly utilisation as a bar chart. `data[].rate` is a 0..1 fraction, shown
 * on the Y axis as a percentage.
 */
export function UtilisationChart({
  data,
}: {
  data: Array<{ hour: number; rate: number }>
}) {
  const chartData = data.map((row) => ({
    hour: `${String(row.hour).padStart(2, '0')}:00`,
    percent: Math.round(row.rate * 1000) / 10,
  }))

  return (
    <ResponsiveContainer width="100%" height={240}>
      <BarChart data={chartData} margin={{ top: 8, right: 8, bottom: 8, left: 0 }}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="hour" interval={2} fontSize={11} />
        <YAxis unit="%" fontSize={11} />
        <Tooltip formatter={(value: number) => `${value}%`} />
        <Bar dataKey="percent" fill="var(--primary)" radius={[2, 2, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  )
}

/**
 * Revenue per local date as a bar chart.
 */
export function RevenueChart({
  data,
}: {
  data: Array<{ date: string; amount: number }>
}) {
  return (
    <ResponsiveContainer width="100%" height={240}>
      <BarChart data={data} margin={{ top: 8, right: 8, bottom: 8, left: 0 }}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="date" fontSize={11} />
        <YAxis fontSize={11} width={64} tickFormatter={(value: number) => new Intl.NumberFormat('vi-VN').format(value)} />
        <Tooltip formatter={(value: number) => `${new Intl.NumberFormat('vi-VN').format(value)} ₫`} />
        <Bar dataKey="amount" fill="var(--primary)" radius={[2, 2, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  )
}

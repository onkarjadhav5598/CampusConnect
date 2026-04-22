import React from 'react';
import { cn } from '../../lib/utils';
import {
  AreaChart, Area, BarChart, Bar,
  XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Cell,
} from 'recharts';

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="glass border border-white/10 rounded-xl p-3 text-sm shadow-xl">
        <p className="text-gray-400 mb-1">{label}</p>
        {payload.map((p) => (
          <p key={p.name} className="font-semibold" style={{ color: p.color }}>
            {p.name}: <span className="text-white">{p.value}</span>
          </p>
        ))}
      </div>
    );
  }
  return null;
};

/**
 * ChartCard
 * @param {string} title
 * @param {object[]} data
 * @param {string} dataKey - key in data objects for the value
 * @param {string} nameKey - key for x-axis labels (default: 'name')
 * @param {'area'|'bar'} type
 * @param {string} color  - hex or CSS color
 * @param {string} className
 */
export default function ChartCard({
  title,
  data = [],
  dataKey = 'value',
  nameKey = 'name',
  type = 'area',
  color = '#a855f7',
  className,
  children,
}) {
  return (
    <div className={cn("glass rounded-2xl border border-white/5 p-6", className)}>
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-base font-bold text-white">{title}</h3>
        {children}
      </div>
      <div className="h-56">
        <ResponsiveContainer width="100%" height="100%">
          {type === 'area' ? (
            <AreaChart data={data}>
              <defs>
                <linearGradient id={`grad-${dataKey}`} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={color} stopOpacity={0.3} />
                  <stop offset="95%" stopColor={color} stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#2a2a35" vertical={false} />
              <XAxis dataKey={nameKey} stroke="#6b7280" axisLine={false} tickLine={false} tick={{ fontSize: 11 }} />
              <YAxis stroke="#6b7280" axisLine={false} tickLine={false} tick={{ fontSize: 11 }} />
              <Tooltip content={<CustomTooltip />} />
              <Area
                type="monotone"
                dataKey={dataKey}
                stroke={color}
                strokeWidth={2.5}
                fillOpacity={1}
                fill={`url(#grad-${dataKey})`}
              />
            </AreaChart>
          ) : (
            <BarChart data={data}>
              <CartesianGrid strokeDasharray="3 3" stroke="#2a2a35" vertical={false} />
              <XAxis dataKey={nameKey} stroke="#6b7280" axisLine={false} tickLine={false} tick={{ fontSize: 11 }} />
              <YAxis stroke="#6b7280" axisLine={false} tickLine={false} tick={{ fontSize: 11 }} />
              <Tooltip content={<CustomTooltip />} cursor={{ fill: '#1f1f2e' }} />
              <Bar dataKey={dataKey} radius={[4, 4, 0, 0]}>
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color || color} />
                ))}
              </Bar>
            </BarChart>
          )}
        </ResponsiveContainer>
      </div>
    </div>
  );
}

import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '../../lib/utils';

export const StatsCard = ({ title, value, icon: Icon, trend, className }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn(
        "glass rounded-2xl p-6 flex flex-col gap-4 border border-white/5 hover:border-white/10 transition-all",
        className
      )}
    >
      <div className="flex justify-between items-start">
        <div className="p-3 bg-primary/10 rounded-xl text-primary border border-primary/10">
          {Icon && <Icon className="w-6 h-6" />}
        </div>
        {trend && (
          <span className={cn(
            "text-xs font-semibold px-2.5 py-1 rounded-full",
            trend.isPositive
              ? "bg-green-500/10 text-green-400 border border-green-500/20"
              : "bg-red-500/10 text-red-400 border border-red-500/20"
          )}>
            {trend.isPositive ? '↑' : '↓'} {Math.abs(trend.value)}%
          </span>
        )}
      </div>
      <div>
        <p className="text-gray-400 text-sm font-medium mb-1">{title}</p>
        <h2 className="text-3xl font-bold tracking-tight text-white">{value ?? '—'}</h2>
      </div>
    </motion.div>
  );
};

export default StatsCard;

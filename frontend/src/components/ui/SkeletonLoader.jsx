import React from 'react';
import { cn } from '../../lib/utils';
import { Card } from './Card';

export const SkeletonLoader = ({ className, type = 'card' }) => {
  const shimmer = "relative overflow-hidden before:absolute before:inset-0 before:-translate-x-full before:animate-[shimmer_2s_infinite] before:bg-gradient-to-r before:from-transparent before:via-white/10 before:to-transparent";

  if (type === 'card') {
    return (
      <Card className={cn("p-0 flex flex-col h-full", shimmer, className)}>
        <div className="aspect-[4/3] bg-white/5 w-full" />
        <div className="p-5 flex flex-col flex-grow gap-4">
          <div className="h-6 bg-white/5 rounded-md w-3/4" />
          <div className="space-y-2">
            <div className="h-4 bg-white/5 rounded-md w-1/2" />
            <div className="h-4 bg-white/5 rounded-md w-2/3" />
            <div className="h-4 bg-white/5 rounded-md w-1/3" />
          </div>
          <div className="mt-auto pt-4 flex gap-3">
            <div className="h-11 bg-white/5 rounded-lg flex-1" />
            <div className="h-11 bg-white/5 rounded-lg flex-1" />
          </div>
        </div>
      </Card>
    );
  }

  if (type === 'text') {
    return <div className={cn("h-4 bg-white/5 rounded-md", shimmer, className)} />;
  }

  return <div className={cn("bg-white/5 rounded-md", shimmer, className)} />;
};

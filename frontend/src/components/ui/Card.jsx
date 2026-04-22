import React from 'react';
import { cn } from '../../lib/utils';
import { motion } from 'framer-motion';

export const Card = ({ className, children, hoverEffect = false, ...props }) => {
  const Component = hoverEffect ? motion.div : 'div';
  const motionProps = hoverEffect ? {
    whileHover: { y: -5 },
    transition: { type: "spring", stiffness: 300 }
  } : {};

  return (
    <Component
      className={cn("glass rounded-2xl p-6", className)}
      {...motionProps}
      {...props}
    >
      {children}
    </Component>
  );
};

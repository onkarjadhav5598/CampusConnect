import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '../../lib/utils';
import { Loader2 } from 'lucide-react';

const Button = React.forwardRef(({
  className,
  variant = 'primary',
  size = 'md',
  isLoading = false,
  children,
  asChild = false,
  ...props
}, ref) => {
  const baseStyles =
    "inline-flex items-center justify-center rounded-lg font-medium transition-all duration-200 " +
    "focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-background " +
    "disabled:opacity-50 disabled:pointer-events-none cursor-pointer";

  const variants = {
    primary: "bg-gradient-primary text-white hover:shadow-glow",
    secondary: "bg-secondary text-white hover:bg-blue-600",
    outline: "border border-primary text-primary hover:bg-primary/10",
    ghost: "text-gray-300 hover:text-white hover:bg-white/10",
    danger: "bg-red-500/10 text-red-400 border border-red-500/20 hover:bg-red-500/20",
  };

  const sizes = {
    sm: "h-9 px-4 text-sm",
    md: "h-11 px-6 text-base",
    lg: "h-14 px-8 text-lg",
    icon: "h-9 w-9 p-0",
  };

  if (asChild && React.isValidElement(children)) {
    return React.cloneElement(children, {
      className: cn(baseStyles, variants[variant], sizes[size], className),
      ref,
      ...props,
    });
  }

  return (
    <motion.button
      ref={ref}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className={cn(baseStyles, variants[variant], sizes[size], className)}
      disabled={isLoading || props.disabled}
      {...props}
    >
      {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
      {children}
    </motion.button>
  );
});

Button.displayName = 'Button';

export { Button };
export default Button;

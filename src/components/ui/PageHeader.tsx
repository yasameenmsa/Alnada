import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '../../utils/cn';

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  className?: string;
  children?: React.ReactNode;
}

const PageHeader: React.FC<PageHeaderProps> = ({
  title,
  subtitle,
  className,
  children
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn('text-center mb-12', className)}
    >
      <h1 className="text-4xl font-bold mb-4">{title}</h1>
      {subtitle && (
        <p className="text-gray-600 max-w-2xl mx-auto mb-8">{subtitle}</p>
      )}
      {children}
    </motion.div>
  );
};

export default PageHeader;
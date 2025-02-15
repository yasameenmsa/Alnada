import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '../../utils/cn';
import Container from '../ui/Container';

interface SectionProps {
  className?: string;
  children: React.ReactNode;
  containerClassName?: string;
  background?: 'white' | 'gray';
}

const Section: React.FC<SectionProps> = ({
  className,
  children,
  containerClassName,
  background = 'white'
}) => {
  const bgStyles = {
    white: 'bg-white',
    gray: 'bg-gray-50'
  };

  return (
    <section className={cn('py-20', bgStyles[background], className)}>
      <Container className={containerClassName}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          {children}
        </motion.div>
      </Container>
    </section>
  );
};

export default Section;
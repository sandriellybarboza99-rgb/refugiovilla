import React from 'react';
import { motion } from 'framer-motion';
import './Section.css';

export default function Section({ children, id, className = "" }) {
  return (
    <motion.section 
      id={id}
      className={`section-container ${className}`}
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.8 }}
    >
      <div className="section-content">
        {children}
      </div>
    </motion.section>
  );
}
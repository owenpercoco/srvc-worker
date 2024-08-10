import React, { ReactNode, useState } from 'react';

interface AccordionProps {
  title: string;
  expanded?: boolean;
  children: ReactNode;
}

const Accordion = ({ title, expanded = false, children }: AccordionProps) => {
  const [isExpanded, setIsExpanded] = useState(expanded);

  const toggleAccordion = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <div>
      <div className="accordion-header" onClick={toggleAccordion}>
        <h2>{title}</h2>
        <span className="expand-arrow">{isExpanded ? '▲' : '▼'}</span>
      </div>
      {isExpanded && <div className="accordion-content">{children}</div>}
    </div>
  );
};

export default Accordion;
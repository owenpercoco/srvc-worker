import React, { ReactNode } from 'react';

interface AccordionProps {
  title: string;
  classes?: string | boolean;
  vertical?: boolean;
  children: ReactNode;
}

const Container = ({ title, classes = false, vertical = false, children }: AccordionProps) => {
  const className = `container${vertical ? ' vertical' : ''}${classes ? ` ${classes}` : ''}`

  return (
    <div className={className} title={title}>
      {children}
    </div>
  );
};

export default Container;

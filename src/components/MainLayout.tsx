import React, { ReactNode } from 'react';
import Header from './Header';

type MainLayoutProps = {
  children: ReactNode;
};

const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  return (
    <div >
      <Header />
        <main>
          {children}
        </main>
    </div>
  );
};

export default MainLayout;